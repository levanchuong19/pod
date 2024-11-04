import { useEffect, useState } from "react";
import formatVND from "../../utils/currency";
import { Booking } from "../modal/booking";
import { POD } from "../modal/pod";
import "./index.scss";
import api from "../config/api";
import { LayoutOutlined, UserOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { CheckboxProps, Radio } from "antd";

export type ReservationCardProps = {
  booking: Booking;
};

const BookingCard: React.FC<ReservationCardProps> = ({ booking }) => {
  const [pods, setPod] = useState<POD>();

  const onCheckboxChange: CheckboxProps["onChange"] = (e) => {
    if (e.target.checked) {
      console.log("Selected booking:", booking);
    } else {
      console.log("Selected booking:", booking);
    }
  };
  const fetchPod = async () => {
    try {
      const response = await api.get(`pods/${booking?.podId}`);
      setPod(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchPod();
  }, []);

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy");
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  const formatBookingTime = () => {
    if (!booking?.startTime || !booking?.endTime) {
      return "Không có thông tin thời gian";
    }
    const startDate = new Date(booking.startTime);
    const endDate = new Date(booking.endTime);
    const isMultipleDays = startDate.toDateString() !== endDate.toDateString();
    if (isMultipleDays) {
      return `${formatTime(startDate)} ${formatDate(startDate)}  - ${formatTime(
        endDate
      )} ${formatDate(endDate)} `;
    } else {
      return `${formatDate(startDate)}
              ${formatTime(startDate)} - ${formatTime(endDate)}`;
    }
  };

  const calculateTime = (
    startTime: string | number | Date,
    endTime: string | number | Date
  ) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationInMinutes = ((end.getTime() - start.getTime()) /
      (1000 * 60)) as number;

    const hours = Math.floor(durationInMinutes / 60);
    const minutes = Math.round(durationInMinutes % 60);

    return `${hours} giờ ${minutes} phút`;
  };

  const calculateTotalServicePrice = () => {
    if (booking?.bookingServices) {
      return booking.bookingServices.reduce(
        (total, service) => total + service.totalPrice,
        0
      );
    }
    return 0;
  };

  const adjustedTotalPrice = booking?.totalPrice
    ? booking.totalPrice - calculateTotalServicePrice()
    : 0;
  const calculateUsageHours = (startTime: Date, endTime: Date) => {
    const durationInMinutes =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const hours = durationInMinutes / 60;
    return hours > 0 ? hours : 1;
  };
  const usageHours =
    booking?.startTime && booking?.endTime
      ? calculateUsageHours(
          new Date(booking.startTime),
          new Date(booking.endTime)
        )
      : 1;
  const pricePerHour = usageHours > 0 ? adjustedTotalPrice / usageHours : 0;

  return (
    <div>
      <div className="reser" style={{ width: "100%" }}>
        <div className="reservation__left">
          <img
            style={{ borderRadius: "10px" }}
            width={300}
            src={pods?.imageUrl}
            alt=""
          />
        </div>
        <div className="reservation__right">
          <h2>{booking.podName}</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <p>
              <UserOutlined /> {pods?.capacity}
            </p>
            <p>
              <LayoutOutlined /> {pods?.area} m{" "}
            </p>
          </div>
          <p>Địa chỉ: {booking.locationAddress}</p>
          <p>{formatBookingTime()}</p>
          <p>
            {formatVND(booking.pricePerHour)} x{" "}
            {booking?.startTime && booking?.endTime
              ? calculateTime(
                  new Date(booking.startTime),
                  new Date(booking.endTime)
                )
              : ""}
          </p>
          <Radio style={{ marginRight: "20px" }} onChange={onCheckboxChange}>
            Chọn
          </Radio>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
