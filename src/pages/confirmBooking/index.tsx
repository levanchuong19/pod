/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import api from "../../components/config/api";
import { Booking } from "../../components/modal/booking";
import { useParams } from "react-router-dom";
import "./index.scss";
import formatVND from "../../utils/currency";
import { Button, Checkbox, Popconfirm } from "antd";
import { format } from "date-fns";
import { Payment } from "../../components/modal/payment";
import { POD } from "../../components/modal/pod";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import moment from "moment";

dayjs.extend(utc);
dayjs.extend(timezone);
interface JwtPayload {
  userId: string;
}

function ConfirmBooking() {
  const [isBooking, setIsbooking] = useState<Booking | null>(null);
  const [isPayment, setIsPayment] = useState<Payment | null>(null);
  const [isRewardpoints, setIsRewardpoints] = useState<any>();
  const [oldPrice, setOldPrice] = useState<number>();
  const [isChecked, setIsChecked] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const { id } = useParams();
  const [pods, setPod] = useState<POD>();
  const token = localStorage.getItem("accessToken");

  const fetchPod = async () => {
    try {
      const response = await api.get(`pods/${isBooking?.podId}`);
      console.log(response.data.data);
      setPod(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchPod();
  }, [isBooking?.podId]);

  const calculateDiscount = (points: number) => {
    if (points < 400) return 0;
    const discountPercentage = Math.floor(points / 400) * 10;
    return discountPercentage > 100 ? 100 : discountPercentage;
  };

  const fetchRewardPoint = async () => {
    if (token) {
      const decodedToken: JwtPayload = jwtDecode(token);
      const userId = decodedToken.userId;
      console.log("id:", userId);
      try {
        const response = await api.get(`rewardpoints/total/${userId}`);
        console.log("isRewardpoints", response.data.data.value);
        setIsRewardpoints(response.data.data.value);
      } catch (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    fetchRewardPoint();
  }, []);

  const fetchBooking = async () => {
    const response = await api.get(`bookings/${id}`);
    console.log("BookingData", response.data.data);
    setIsbooking(response.data.data);
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchPayment = async (bookingCode: string) => {
    try {
      console.log("Gửi mã booking:", bookingCode);
      const payload = { bookingCode };
      console.log("Payment request payload:", payload);
      const response = await api.post(
        `payments/create?bookingCode=${bookingCode}`
      );
      console.log("bookingResult:", response.data);
      const paymentUrl = response.data;
      console.log("paymentUrl: ", paymentUrl);
      setIsPayment(response.data);
    } catch (error) {
      console.error("Lỗi từ server:", error);
    }
  };

  useEffect(() => {
    if (isBooking?.code) {
      fetchPayment(isBooking.code);
    }
  }, [isBooking?.code]);

  const handlePayment = async () => {
    if (!isBooking?.code) {
      console.error("No booking code available.");
      return;
    }

    try {
      const paymentUrl = isPayment?.result;
      console.log("VNPay Payment URL:", paymentUrl);

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        console.error("No payment URL received.");
      }
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy");
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  const formatBookingTime = () => {
    if (!isBooking?.startTime || !isBooking?.endTime) {
      return "Không có thông tin thời gian";
    }
    const startDate = new Date(isBooking.startTime);
    const endDate = new Date(isBooking.endTime);
    const isMultipleDays = startDate.toDateString() !== endDate.toDateString();
    if (isMultipleDays) {
      return `${formatDate(startDate)} ${formatTime(startDate)} - ${formatDate(
        endDate
      )} ${formatTime(endDate)}`;
    } else {
      return `${formatDate(startDate)}
                    ${formatTime(startDate)} - ${formatTime(endDate)}`;
    }
  };

  // const calculateDurationInHours = (startTime: Date, endTime: Date) => {
  //   const openingHour = 7;
  //   const closingHour = 22;
  //   let totalHours = 0;
  //   let currentDate = new Date(startTime);
  //   while (currentDate <= endTime) {
  //     const startOfDay = new Date(currentDate);
  //     const endOfDay = new Date(currentDate);
  //     startOfDay.setHours(openingHour, 0, 0, 0);
  //     endOfDay.setHours(closingHour, 0, 0, 0);
  //     const actualStart = currentDate > startOfDay ? currentDate : startOfDay;
  //     const actualEnd = endTime < endOfDay ? endTime : endOfDay;
  //     const hoursForThisDay =
  //       (actualEnd.getTime() - actualStart.getTime()) / (1000 * 60 * 60);
  //     if (hoursForThisDay > 0) {
  //       totalHours += hoursForThisDay;
  //     }
  //     currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  //     currentDate.setHours(openingHour, 0, 0, 0);
  //   }

  //   return totalHours;
  // };
  // const calculateTime = (
  //   startTime: string | number | Date,
  //   endTime: string | number | Date
  // ) => {
  //   const start = new Date(startTime);
  //   const end = new Date(endTime);
  //   const totalHours = calculateDurationInHours(start, end);
  //   const hours = Math.floor(totalHours);
  //   const minutes = Math.round((totalHours % 1) * 60);

  //   return `${hours} giờ ${minutes} phút`;
  // };
  const calculateDuration = (startTime: Date, endTime: Date) => {
    const durationInMinutes =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const days = Math.floor(durationInMinutes / (24 * 60));
    const remainingMinutesAfterDays = durationInMinutes % (24 * 60);
    const hours = Math.floor(remainingMinutesAfterDays / 60);
    const minutes = remainingMinutesAfterDays % 60;

    let durationString = "";
    if (days > 0) {
      durationString += `${days} ngày `;
    }
    if (hours > 0 || days > 0) {
      durationString += `${hours} giờ `;
    }
    durationString += `${minutes} phút`;

    return durationString;
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

  const onChange = async () => {
    try {
      const oldBooking = { ...isBooking };
      const price = oldBooking.totalPrice;
      console.log("old price", price);
      setOldPrice(price);
      console.log("old booking", oldBooking);
      const start = isBooking?.startTime ? moment(isBooking.startTime) : null;
      const end = isBooking?.endTime ? moment(isBooking.endTime) : null;
      const updatedBooking = {
        startTime: start?.format("YYYY-MM-DDTHH:mm:ss"),
        endTime: end?.format("YYYY-MM-DDTHH:mm:ss"),
        useRewardPoints: true,
        bookingServices: isBooking?.bookingServices?.map((service) => ({
          serviceId: service.serviceId,
          quantity: service.quantity,
        })),
      };
      console.log("data update:", updatedBooking);
      if (isRewardpoints && isRewardpoints >= 400) {
        const response = await api.put(`bookings/${id}`, updatedBooking);
        console.log("Booking updated with reward points", response.data);
        setIsbooking(response.data);
        setIsChecked(true);
        setIsDisabled(true);
        toast.success("Đã sử dụng điểm thưởng thành công!");
        fetchBooking();
      } else {
        setIsChecked(false);
        // setIsDisabled(true);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật booking:", error);
      setIsChecked(false);
    }
  };

  const handleCheckboxChange = async (e: any) => {
    if (e.target.checked) {
      if (isRewardpoints && isRewardpoints < 400) {
        toast.error("Bạn không đủ điểm thưởng để sử dụng.");
        // setIsDisabled(true);
        setIsChecked(false);
      } else {
        setIsChecked(true);
      }
    } else {
      console.log("Không sử dụng điểm thưởng");
      setIsChecked(false);
    }
  };

  return (
    <div className="confirmBooking">
      <div className="confirm">
        <div className="confirm-content">
          <div className="confirm__left">
            <img width={500} src={pods?.imageUrl} alt="" />
          </div>
          <div className="confirm__right">
            <span
              style={{ height: "0.99px", backgroundColor: "black" }}
              className="spanLine"
            ></span>
            <h2>Chi tiết đơn hàng:</h2>
            <p>{formatBookingTime()}</p>
            <p>
              {isBooking?.startTime && isBooking?.endTime
                ? calculateDuration(
                    new Date(isBooking.startTime),
                    new Date(isBooking.endTime)
                  )
                : "Không có thông tin thời gian"}
            </p>
            <p>
              {formatVND(isBooking?.pricePerHour ?? 0)} x{" "}
              {isBooking?.startTime && isBooking?.endTime
                ? calculateTime(
                    new Date(isBooking.startTime),
                    new Date(isBooking.endTime)
                  )
                : ""}
            </p>
            <h4>Lựa chọn đi kèm:</h4>

            {isBooking?.bookingServices &&
              isBooking.bookingServices.map((service, index) => (
                <div key={index} className="service-item">
                  <p>Tên : {service.nameService} </p>
                  <div style={{ display: "flex", gap: "122px" }}>
                    <p>Số lượng: {service.quantity}</p>
                    <p>{formatVND(service.totalPrice)}</p>
                  </div>
                </div>
              ))}
            <div>
              <p>
                Tổng giá trị:{" "}
                <strong>
                  {oldPrice
                    ? formatVND(oldPrice)
                    : formatVND(isBooking?.totalPrice ?? 0)}
                </strong>
              </p>
              {isChecked && (
                <p>Giảm giá: {calculateDiscount(isRewardpoints ?? 0)}%</p>
              )}
            </div>
            <div style={{ display: "flex", gap: "190px", fontSize: "20px" }}>
              <h4>Tổng cộng:</h4>
              <h4>{formatVND(isBooking?.totalPrice ?? 0)}</h4>
            </div>
            <span
              style={{ height: "0.8px", backgroundColor: "black" }}
              className="spanLine"
            ></span>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>Thanh toán: </h2>
              <Popconfirm
                title={
                  isRewardpoints >= 400
                    ? `Bạn đang có ${isRewardpoints} điểm !`
                    : "Bạn cần tối thiểu 400 điểm để sử dụng."
                }
                description={
                  isRewardpoints >= 400
                    ? `Bạn sẽ không thể thay đổi. Bạn chắc chắn chứ !`
                    : " "
                }
                onConfirm={onChange}
                onCancel={() => setIsChecked(false)}
              >
                <Checkbox
                  disabled={isDisabled}
                  onChange={handleCheckboxChange}
                  checked={isChecked}
                >
                  Sử dụng điểm thưởng
                </Checkbox>
              </Popconfirm>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "150px" }}
            >
              <img
                width={60}
                src="https://vnpay.vn/s1/statics.vnpay.vn/2021/6/05g0ytd7dxcs1624443633411.png"
                alt=""
              />
              <p>Ví VNPAY</p>
            </div>
          </div>
        </div>
        <div className="confirm-button">
          <Button
            onClick={handlePayment}
            style={{ padding: "20px 50px", fontSize: "18px" }}
            type="primary"
            danger
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmBooking;
