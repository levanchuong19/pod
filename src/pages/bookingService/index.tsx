/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import api from "../../components/config/api";
import { Booking } from "../../components/modal/booking";
import { useParams } from "react-router-dom";
import "./index.scss";
import formatVND from "../../utils/currency";
import { Button } from "antd";
import { format } from "date-fns";
import { Payment } from "../../components/modal/payment";

function BookingService() {
  const [isBooking, setIsbooking] = useState<Booking | null>(null);
  const [isPayment, setIsPayment] = useState<Payment | null>(null);
  const { id } = useParams();

  const fetchPod = async () => {
    try {
      const response = await api.get(`pods/${isBooking?.podId}`);
      console.log(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchPod();
  }, [isBooking?.podId]);

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
      console.log("bookingResult:", response);
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
      return `${formatTime(startDate)}  -  ${formatDate(startDate)} `;
      // - ${formatTime(endDate)}
    }
  };

  return (
    <div className="bookingService">
      <div className="confirm">
        <div className="confirm-content">
          <h2 className="h2">Chi tiết đơn hàng</h2>
          <div className="confirm__right">
            <strong className="strong">
              Dịch vụ order thêm dành cho : {isBooking?.podName}(
              {formatVND(isBooking?.pricePerHour ?? 0) + "/giờ"})
            </strong>
            <p>Địa chỉ: {isBooking?.locationAddress}</p>
            <p>{formatBookingTime()}</p>

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

            <span
              style={{
                height: "0.8px",
                backgroundColor: "#b4b4b4",
                width: "700px",
                marginLeft: "-20px",
              }}
              className="spanLine"
            ></span>
            <div
              style={{
                display: "flex",
                fontSize: "20px",
                justifyContent: "flex-end",
                gap: "20px",
              }}
            >
              <h4>Tổng :</h4>
              <h4>{formatVND(isBooking?.totalPrice ?? 0)}</h4>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: "150px" }}
            >
              <h4>Phương thức thanh toán: </h4>
              <p>Ví VNPAY</p>
              <img
                width={50}
                src="https://vnpay.vn/s1/statics.vnpay.vn/2021/6/05g0ytd7dxcs1624443633411.png"
                alt=""
              />
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

export default BookingService;
