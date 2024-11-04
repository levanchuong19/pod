/* eslint-disable @typescript-eslint/no-explicit-any */
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { UnorderedListOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import api from "../../components/config/api";
import { Booking } from "../../components/modal/booking";
import ReservationCard from "../../components/reservationCard";
import "./index.scss";
import { Button, Modal } from "antd";
import Ratings from "../../components/rating";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useNotification } from "../NotificationContext";
import { v4 as uuidv4 } from "uuid";

interface JwtPayload {
  userId: any;
}

export default function Reservation({ numberOfSlides = 1, autoplay = false }) {
  const [reservation, setReservation] = useState<Booking[]>();
  const [selectedStatus, setSelectedStatus] = useState<string>("On Going");
  const [activeSlide, setActiveSlide] = useState<string>("On Going");
  const [showRatings, setShowRatings] = useState(false);
  const [currentPodId, setCurrentPodId] = useState();
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [paymentBookingCode, setPaymentBookingCode] = useState<string | null>(
    null
  );
  const location = useLocation();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("bookingCode");
    if (code) {
      setPaymentBookingCode(code);
      setShowPaymentSuccessModal(true);
    }

    const fetchOnGoingBookings = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (token) {
          const decodedToken: JwtPayload = jwtDecode(token);
          const userId = decodedToken.userId;
          const response = await api.get(`bookings?AccountId=${userId}`);
          console.log("response", response.data);
          const bookings = response.data || [];
          const userBookings = bookings.filter(
            (booking: Booking) => booking.accountId === userId
          );
          setReservation(userBookings);
          setSelectedStatus("OnGoing");
          setActiveSlide("OnGoing");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchOnGoingBookings();
  }, [location]);

  const filteredBookings =
    reservation?.filter(
      (item: Booking) => item.paymentStatus === selectedStatus
    ) || [];
  const handleSlideClick = (status: string) => {
    setSelectedStatus(status);
    setActiveSlide(status);
  };

  const handleAddRating = (podId: any) => {
    console.log(`Adding rating for pod ID: ${podId}`);
    setCurrentPodId(podId);
    setShowRatings(true);
  };

  const handleRebookPod = (podId: string) => {
    navigate(`/booking/${podId}`);
  };

  const handlePaymentSuccessModalClose = () => {
    setShowPaymentSuccessModal(false);
    if (paymentBookingCode) {
      updatePaymentStatus(paymentBookingCode);
      navigate("/reservation");
    }
  };

  const updatePaymentStatus = async (code: string) => {
    console.log("code:", code);
    try {
      const response = await api.post(`payments/success?bookingCode=${code}`);
      console.log("Payment status updated:", response.data);
      addNotification({
        id: uuidv4(),
        message: "Thanh toán thành công",
        body: "Bạn đã đặt chỗ và thanh toán đơn hàng thành công.",
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handlePendingPayments = async (bookingCode: string) => {
    try {
      const response = await api.post(
        `payments/create?bookingCode=${bookingCode}`
      );
      const url = response.data.result;
      if (url) {
        window.location.href = url;
      } else {
        console.error("No payment URL received.");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  return (
    <div className="bookingPage">
      <h3
        style={{ marginTop: "30px", marginBottom: "20px", cursor: "pointer" }}
      >
        <UnorderedListOutlined /> My Booking
      </h3>
      <Swiper
        style={{
          border: "2px solid black",
          padding: "10px",
          fontWeight: "600",
        }}
        slidesPerView={numberOfSlides}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        modules={autoplay ? [Autoplay, Navigation] : [Pagination]}
        className={`carousel ${numberOfSlides > 1 ? "multi-item" : ""}`}
      >
        <SwiperSlide
          onClick={() => handleSlideClick("OnGoing")}
          className={activeSlide === "OnGoing" ? "-slide" : ""}
        >
          On Going
        </SwiperSlide>
        <SwiperSlide
          onClick={() => handleSlideClick("UpComing")}
          className={activeSlide === "UpComing" ? "-slide" : ""}
        >
          Up Coming
        </SwiperSlide>
        <SwiperSlide
          onClick={() => handleSlideClick("Pending")}
          className={activeSlide === "Pending" ? "-slide" : ""}
        >
          Pending
        </SwiperSlide>
        <SwiperSlide
          onClick={() => handleSlideClick("Complete")}
          className={activeSlide === "Complete" ? "-slide" : ""}
        >
          Completed
        </SwiperSlide>
        <SwiperSlide
          onClick={() => handleSlideClick("Canceled")}
          className={activeSlide === "Canceled" ? "-slide" : ""}
        >
          Canceled
        </SwiperSlide>
      </Swiper>
      {/* <div className="line2"></div> */}

      <div className="Reservation">
        <div className="reservation">
          <div className="reservationCard">
            {filteredBookings.length > 0 ? (
              filteredBookings?.map((item: Booking) => (
                <ReservationCard
                  key={item.id}
                  booking={item}
                  canAddRating={activeSlide === "Complete"}
                  onAddRating={handleAddRating}
                  onRebook={handleRebookPod}
                  onPendingPayment={handlePendingPayments}
                />
              ))
            ) : (
              <p>No bookings available for this status.</p>
            )}
          </div>
        </div>
      </div>
      <Modal
        open={showRatings}
        onCancel={() => setShowRatings(false)}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setShowRatings(false)}>
            Cancel
          </Button>,
        ]}
      >
        {currentPodId && <Ratings podId={currentPodId} />}
      </Modal>

      <Modal
        open={showPaymentSuccessModal}
        onOk={handlePaymentSuccessModalClose}
        onCancel={handlePaymentSuccessModalClose}
        title="Payment Successful"
      >
        <p>Your payment was successful!</p>
      </Modal>
    </div>
  );
}
