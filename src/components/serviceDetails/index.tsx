/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../../components/config/api";
import { Service } from "../../components/modal/service";
import "./index.scss";
import ServiceCard from "../ServiceCard";
import { Button, Modal, Pagination as AntPagination } from "antd";
import { Booking } from "../modal/booking";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import BookingCard from "../bookingCard";
import { useNavigate } from "react-router-dom";

interface JwtPayload {
  userId: string;
}
function ServiceDetails() {
  const [service, setService] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [reservation, setReservation] = useState<Booking[]>();
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [showModal, setSHowModal] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [podsPerPage] = useState(6);

  const fetchService = async () => {
    try {
      const response = await api.get(
        `services?PageIndex=${currentPage}&PageSize=${podsPerPage}`
      );
      console.log(response.data);
      setService(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchService();
  }, []);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decodedToken: JwtPayload = jwtDecode(token);
        const userId = decodedToken.userId;
        console.log("userId:", userId);
        const response = await api.get(`bookings?AccountId=${userId}`);
        console.log("response", response.data);
        const bookings = response.data || [];
        const userBookings = bookings.filter(
          (booking: Booking) =>
            booking.accountId === userId &&
            (booking.paymentStatus === "OnGoing" ||
              booking.paymentStatus === "UpComing")
        );
        setReservation(userBookings);
        const activeBooking = userBookings.length > 0 ? userBookings[0] : null;
        console.log(activeBooking);
        if (activeBooking) {
          setActiveBookingId(activeBooking.id);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  const handleModal = async () => {
    if (selectedServices.length === 0) {
      toast.error("Bạn phải chọn ít nhất một dịch vụ trước khi tiếp tục.");
      return;
    }
    if (!activeBookingId) {
      toast.error(
        "Bạn cần có một booking đang hoạt động hoặc sắp tới để sử dụng thêm dịch vụ."
      );
      return;
    }
    setSHowModal(true);
  };

  const handleSubmit = async () => {
    if (selectedServices.length === 0) {
      toast.error("Bạn phải chọn ít nhất một dịch vụ trước khi tiếp tục.");
      return;
    }
    const bookingData = {
      bookingId: activeBookingId,
      bookingServices: selectedServices.map((service: Service) => ({
        serviceId: service.id,
        quantity: service.quantity,
      })),
    };

    try {
      const response = await api.post(
        "bookings/add-services-to-booking",
        bookingData
      );
      const createdBooking = response.data.data;
      navigate(`/bookingService/${createdBooking?.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi thêm dịch vụ.");
    }
  };

  const handleServiceSelection = (
    serviceId: any,
    quantity: any,
    isChecked: boolean
  ) => {
    setSelectedServices((prevServices) => {
      if (isChecked) {
        // Nếu checkbox được chọn, thêm hoặc cập nhật số lượng dịch vụ
        const existingService = prevServices.find(
          (service: Service) => service.id === serviceId
        );
        if (existingService) {
          return prevServices.map((service: Service) =>
            service.id === serviceId
              ? { ...service, quantity: quantity }
              : service
          );
        } else {
          return [...prevServices, { id: serviceId, quantity: quantity }];
        }
      } else {
        // Nếu checkbox bị bỏ chọn, xóa dịch vụ khỏi danh sách
        return prevServices.filter(
          (service: Service) => service.id !== serviceId
        );
      }
    });
  };
  const indexOfLastPod = currentPage * podsPerPage;
  const indexOfFirstPod = indexOfLastPod - podsPerPage;
  const currentPods = service?.slice(indexOfFirstPod, indexOfLastPod);
  const current = reservation?.slice(indexOfFirstPod, indexOfLastPod);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="CardService">
        <div className="cardService">
          {currentPods?.map((serviceItem: Service) => (
            <ServiceCard
              key={serviceItem.id}
              service={serviceItem}
              onSelect={handleServiceSelection}
            />
          ))}
          <AntPagination
            current={currentPage}
            pageSize={podsPerPage}
            total={service?.length}
            onChange={handleChangePage}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "5px",
              marginLeft: "960px",
            }}
          />
        </div>
      </div>
      <Button
        onClick={handleModal}
        style={{
          marginLeft: "660px",
          marginBottom: "30px",
          padding: "20px 40px",
          fontSize: "16px",
        }}
        type="primary"
        danger
      >
        {" "}
        Sử dụng thêm{" "}
      </Button>
      <Modal
        open={showModal}
        onCancel={() => setSHowModal(false)}
        width={"80%"}
        onOk={handleSubmit}
      >
        {current?.map((item: Booking) => (
          <BookingCard key={item.id} booking={item} />
        ))}

        <AntPagination
          current={currentPage}
          pageSize={podsPerPage}
          total={reservation?.length}
          onChange={handleChangePage}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
            marginRight: "110px",
          }}
        />
      </Modal>
    </>
  );
}

export default ServiceDetails;
