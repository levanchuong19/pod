/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import formatVND from "../../utils/currency";
import { Booking } from "../modal/booking";
import { POD } from "../modal/pod";
import "./index.scss";
import api from "../config/api";
import { LayoutOutlined, UserOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { format } from "date-fns";

export type ReservationCardProps = {
  booking: Booking;
  canAddRating: boolean;
  onAddRating: (bookingId: string) => void;
  onRebook: (podId: string) => void;
  onPendingPayment: (bookingCode: string) => void;
};

const ReservationCard: React.FC<ReservationCardProps> = ({
  booking,
  canAddRating,
  onAddRating,
  onRebook,
  onPendingPayment,
}) => {
  const [pods, setPod] = useState<POD>();
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

  const handlePaymentClick = () => {
    if (booking.paymentStatus === "Pending") {
      onPendingPayment(booking.code);
    }
  };

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
    const durationInMinutes = (end.getTime() - start.getTime()) / (1000 * 60);

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
    <div className="Cardreser">
      <div className="reser">
        <div className="reservation__left">
          <img
            style={{ borderRadius: "10px" }}
            width={350}
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
          {pricePerHour > 0 && (
            <p>
              {formatVND(booking.pricePerHour)} x{" "}
              {booking?.startTime && booking?.endTime
                ? calculateTime(
                    new Date(booking.startTime),
                    new Date(booking.endTime)
                  )
                : ""}
            </p>
          )}
          <p>
            {booking.bookingServices.map((service) => (
              <div key={service.serviceId}>
                <p style={{ paddingBottom: "5px" }}>
                  {service.nameService}: Số lượng {service.quantity}{" "}
                </p>
                Giá: {formatVND(service.totalPrice)}
              </div>
            ))}
          </p>
          <p>
            <strong>Tổng: </strong>
            {formatVND(booking.totalPrice)}
          </p>
          {booking.paymentStatus === "Complete" && (
            <p>
              {canAddRating && (
                <span
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={() => onAddRating(booking.podId)}
                >
                  Thêm đánh giá cho dịch vụ
                </span>
              )}{" "}
              |{" "}
              <span
                style={{ cursor: "pointer", color: "blue" }}
                onClick={() => onRebook(booking.podId)}
              >
                Tiếp tục sử dụng
              </span>
            </p>
          )}
          <p>
            {booking.paymentStatus === "Pending" && (
              <Button type="primary" danger onClick={handlePaymentClick}>
                Thanh toán
              </Button>
            )}
          </p>
          {(booking.paymentStatus === "Canceled" ||
            booking.paymentStatus === "Pending") && (
            <Button
              style={{ width: 102 }}
              type="primary"
              danger
              onClick={() => onRebook(booking.podId)}
            >
              Đặt lại
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;
