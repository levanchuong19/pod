/* eslint-disable react-hooks/exhaustive-deps */
import { Modal } from "antd";
import Carousel from "../../components/carousel";
import ListDevice from "../../components/list_device";

import PodBooking from "../../components/pod_list";
import { useEffect, useState } from "react";
import api from "../../components/config/api";

function Home() {
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [paymentBookingCode, setPaymentBookingCode] = useState<string | null>(
    null
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("bookingCode");
    if (code) {
      setPaymentBookingCode(code);
      setShowPaymentSuccessModal(true);
    }
  }, [location]);

  const updatePaymentStatus = async (code: string) => {
    console.log("code:", code);
    try {
      const response = await api.post(`payments/success?bookingCode=${code}`);
      console.log("Payment status updated:", response.data);
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handlePaymentSuccessModalClose = () => {
    setShowPaymentSuccessModal(false);
    if (paymentBookingCode) {
      updatePaymentStatus(paymentBookingCode);
    }
  };
  return (
    <div>
      <Carousel />
      <PodBooking numberOfSlides={3} />
      <ListDevice />
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

export default Home;
