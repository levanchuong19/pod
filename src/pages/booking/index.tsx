/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { POD } from "../../components/modal/pod";
import api from "../../components/config/api";
import { useNavigate, useParams } from "react-router-dom";
import "./index.scss";
import { LayoutOutlined, UserOutlined } from "@ant-design/icons";
import formatVND from "../../utils/currency";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import type { CheckboxProps } from "antd";
import { Button, DatePicker, Form, Modal } from "antd";
import type { Dayjs } from "dayjs";
import FormItem from "antd/es/form/FormItem";
import { useForm } from "antd/es/form/Form";
import { Service } from "../../components/modal/service";
import ServiceCard from "../../components/ServiceCard";
import { Flex, Rate, Checkbox, Pagination as AntPagination } from "antd";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { RATING } from "../../components/modal/rating";

// import type { GetProps } from "antd";
import dayjs from "dayjs";
// import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
interface JwtPayload {
  userId: string;
}

// type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

// dayjs.extend(customParseFormat);

// const { RangePicker } = DatePicker;

// const range = (start: number, end: number) => {
//   const result = [];
//   for (let i = start; i < end; i++) {
//     result.push(i);
//   }
//   return result;
// };

export default function Bookings({ numberOfSlides = 4, autoplay = false }) {
  const [pods, setPod] = useState<POD>();
  const { id } = useParams();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [form] = useForm();
  const [service, setService] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const desc = ["terrible", "bad", "normal", "good", "wonderful"];
  const [highestRating, setHighestRating] = useState(1);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [podsPerPage] = useState(6);

  useEffect(() => {
    const fetchBookedTimes = async () => {
      try {
        const response = await api.get(`bookings/${id}/booked-times`);
        console.log("booked-times", response.data.data);
        setBookedSlots(response.data.data);
      } catch (error) {
        console.error("Error fetching booked times:", error);
      }
    };
    fetchBookedTimes();
  }, []);

  const disabledDate = (current: Dayjs | null) => {
    if (!current) return false;
    const isPastDate = current.isBefore(dayjs(), "day");

    // Kiểm tra nếu ngày hiện tại nằm giữa khoảng booking (trừ ngày đầu và ngày cuối)
    const isFullyBookedMidDay = bookedSlots.some((slot: any) => {
      const start = dayjs(slot.startTime);
      const end = dayjs(slot.endTime);
      return current.isAfter(start, "day") && current.isBefore(end, "day");
    });

    return isPastDate || isFullyBookedMidDay;
  };

  const disabledTime = (current: Dayjs, _type: string) => {
    const now = dayjs(); // Giờ hiện tại
    let disabledHours: number[] = [];

    bookedSlots.forEach((slot: any) => {
      const start = dayjs(slot.startTime);
      const end = dayjs(slot.endTime);
      const isSameStartDay = current.isSame(start, "day");
      const isSameEndDay = current.isSame(end, "day");
      if (isSameStartDay && isSameEndDay) {
        // Bôi đen các giờ từ giờ bắt đầu đến giờ kết thúc
        disabledHours.push(
          ...Array.from(
            { length: end.hour() - start.hour() + 1 },
            (_, i) => i + start.hour()
          )
        );
      } else if (isSameStartDay) {
        disabledHours.push(
          ...Array.from(
            { length: 24 - start.hour() },
            (_, i) => i + start.hour()
          )
        );
      } else if (isSameEndDay) {
        disabledHours.push(
          ...Array.from({ length: end.hour() + 1 }, (_, i) => i)
        );
      }
    });

    // Bôi đen giờ đã trôi qua trong ngày hiện tại
    if (current.isSame(now, "day")) {
      disabledHours.push(
        ...Array.from({ length: now.hour() + 1 }, (_, i) => i)
      );
    }

    return {
      disabledHours: () => [...new Set(disabledHours)],
    };
  };

  const handleTimeChange = (timeRange: [Dayjs, Dayjs] | null) => {
    if (timeRange) {
      const [start, end] = timeRange;
      setStartTime(start);
      setEndTime(end);
      console.log("onOk: ", start, "-", end);
    } else {
      setStartTime(null);
      setEndTime(null);
    }
  };
  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Vui lòng đăng nhập trước khi thực hiện !");
      navigate("/login");
      return;
    }
    const decodedToken: JwtPayload = jwtDecode(token);
    const userId = decodedToken.userId;
    console.log("id:", userId);
    if (!startTime || !endTime) {
      toast.error("Vui lòng lựa chọn khoảng thời gian đặt POD");
      return;
    }
    const durationInHours = endTime.diff(startTime, "hour");
    if (durationInHours < 1) {
      toast.error("Thời gian đặt phòng phải ít nhất 1 tiếng !");
      return;
    }
    const bookingData = {
      accountId: userId,
      podId: pods?.id,
      startTime: startTime.format("YYYY-MM-DDTHH:mm:ss"),
      endTime: endTime.format("YYYY-MM-DDTHH:mm:ss"),

      paymentMethod: 0,
      bookingServices: selectedServices.map((service: Service) => ({
        serviceId: service.id,
        quantity: service.quantity,
      })),
    };
    console.log("Booking Data:", bookingData);
    try {
      const response = await api.post("bookings", bookingData);
      const createdBooking = response.data.data;
      console.log(createdBooking.id);
      console.log(response.data);
      setStartTime(null);
      setEndTime(null);
      setSelectedServices([]);
      navigate(`/confirmBooking/${createdBooking?.id}`);
    } catch (err) {
      toast.error("Vui lòng lựa chọn khoảng thời gian khác !");
      console.log(err);
    }
  };
  const handleServiceSelection = (
    serviceId: any,
    quantity: any,
    isChecked: boolean
  ) => {
    setSelectedServices((prevServices: any) => {
      if (isChecked) {
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

  const handleOk = () => {
    console.log(selectedServices);
    if (selectedServices.length > 0) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
    setShowModal(false);
  };

  const fetchService = async () => {
    try {
      const response = await api.get("services");
      console.log(response.data);
      setService(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchService();
  }, []);

  const fetchPod = async () => {
    try {
      const response = await api.get(`pods/${id}`);
      console.log(response.data.data);
      setPod(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchPod();
  }, [id]);

  const handleCheckboxChange: CheckboxProps["onChange"] = (e) => {
    if (e.target.checked) {
      setShowModal(true);
    } else {
      setSelectedServices([]);
      setIsChecked(false);
    }
  };
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const fetchRatings = async () => {
    try {
      const response = await api.get("ratings");
      const ratingsData = response.data;
      const filteredRatings = ratingsData.filter(
        (item: RATING) => item.podId === id
      );
      if (filteredRatings.length > 0) {
        const maxRating = Math.max(
          ...filteredRatings.map((ratingItem: RATING) => ratingItem.ratingValue)
        );
        setHighestRating(maxRating);
      } else {
        console.log("No ratings found for this pod.");
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRatings();
    }
  }, []);

  const indexOfLastPod = currentPage * podsPerPage;
  const indexOfFirstPod = indexOfLastPod - podsPerPage;
  const currentPods = service?.slice(indexOfFirstPod, indexOfLastPod);

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="Booking">
      <div className="booking">
        <div className="img">
          <img width={570} src={pods?.imageUrl} alt="" />
        </div>

        <div className="booking__content">
          <div className="booking__content1">
            <h1>{pods?.name}</h1>
            <p className="price">{formatVND(pods?.pricePerHour ?? 0)}/giờ</p>
          </div>
          <Flex>
            <Rate tooltips={desc} value={highestRating} />
          </Flex>
          <div className="booking__content2">
            <p>
              <UserOutlined /> {pods?.capacity}
            </p>
            <p>
              <LayoutOutlined /> {pods?.area} m{" "}
            </p>
          </div>

          <Form
            form={form}
            style={{ display: "flex", gap: "70px", marginBottom: "-30px" }}
          >
            <FormItem
              name="date"
              rules={[
                { required: true, message: "Vui lòng lựa chọn ngày phù hợp" },
              ]}
            >
              <DatePicker.RangePicker
                disabledDate={disabledDate}
                disabledTime={disabledTime}
                showTime={{
                  hideDisabledOptions: false,
                  defaultValue: [
                    dayjs("00:00:00", "HH:mm"),
                    dayjs("11:59:59", "HH:mm"),
                  ],
                }}
                format="YYYY-MM-DD HH:mm"
                onChange={(value: any) => handleTimeChange(value)}
              />
            </FormItem>
          </Form>
          <h2>Giới thiệu</h2>
          <p>
            {showFullDescription
              ? pods?.description
              : pods?.description.substring(0, 260)}
            {pods?.description && pods?.description.length > 265 && (
              <span
                onClick={toggleDescription}
                style={{ color: "rgb(194, 191, 191)", cursor: "pointer" }}
              >
                {showFullDescription ? " Thu gọn" : "... Xem thêm"}
              </span>
            )}
          </p>
          <h2>Tiện ích</h2>
          <div
            style={{
              width: "580px",
              backgroundColor: "rgb(235, 235, 235)",
              height: "90px",
              borderRadius: "50px",
            }}
          >
            <Swiper
              slidesPerView={numberOfSlides}
              // spaceBetween={20}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              style={{
                borderRadius: "10px",
              }}
              // navigation={true}
              modules={autoplay ? [Autoplay, Navigation] : [Pagination]}
            >
              <SwiperSlide style={{ width: "60px" }}>
                <div style={{ fontSize: "13px", width: "75px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="34px"
                    viewBox="0 -960 960 960"
                    width="50px"
                    fill="#5f6368"
                  >
                    <path d="M340-720q-33 0-56.5-23.5T260-800q0-33 23.5-56.5T340-880q33 0 56.5 23.5T420-800q0 33-23.5 56.5T340-720Zm220 560H302q-33 0-60.5-23.5T207-240l-87-440h82l88 440h270v80Zm220 80L664-280H386q-29 0-50.5-17.5T308-344l-44-214q-11-48 22.5-85t81.5-37q35 0 63.5 21t36.5 57l44 202h130q21 0 39 11t29 29l140 240-70 40Z" />
                  </svg>
                  <br></br>
                  Bàn cao cấp & Ghế công thái học
                </div>
              </SwiperSlide>
              <SwiperSlide style={{ width: "60px" }}>
                <div style={{ fontSize: "13px", width: "70px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="34px"
                    viewBox="0 -960 960 960"
                    width="44px"
                    fill="#5f6368"
                  >
                    <path d="M440-520h80v-280q0-17-11.5-28.5T480-840q-17 0-28.5 11.5T440-800v280ZM200-360h560v-80H200v80Zm-58 240h98v-80q0-17 11.5-28.5T280-240q17 0 28.5 11.5T320-200v80h120v-80q0-17 11.5-28.5T480-240q17 0 28.5 11.5T520-200v80h120v-80q0-17 11.5-28.5T680-240q17 0 28.5 11.5T720-200v80h98l-40-160H182l-40 160Zm676 80H142q-39 0-63-31t-14-69l55-220v-80q0-33 23.5-56.5T200-520h160v-280q0-50 35-85t85-35q50 0 85 35t35 85v280h160q33 0 56.5 23.5T840-440v80l55 220q13 38-11.5 69T818-40Zm-58-400H200h560Zm-240-80h-80 80Z" />
                  </svg>
                  <br></br>
                  Vệ sinh hàng ngày
                </div>
              </SwiperSlide>
              <SwiperSlide style={{ width: "60px" }}>
                <div style={{ fontSize: "13px", width: "50px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="27px"
                    viewBox="0 -960 960 960"
                    width="40px"
                    fill="#5f6368"
                  >
                    <path d="M480-120q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM254-346l-84-86q59-59 138.5-93.5T480-560q92 0 171.5 35T790-430l-84 84q-44-44-102-69t-124-25q-66 0-124 25t-102 69ZM84-516 0-600q92-94 215-147t265-53q142 0 265 53t215 147l-84 84q-77-77-178.5-120.5T480-680q-116 0-217.5 43.5T84-516Z" />
                  </svg>
                  <br></br>
                  Wifi tốc độ cao
                </div>
              </SwiperSlide>
              <SwiperSlide style={{ width: "60px" }}>
                <div style={{ fontSize: "13px", width: "70px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="44px"
                    viewBox="0 -960 960 960"
                    width="44px"
                    fill="#5f6368"
                  >
                    <path d="M120-120v-600q0-50 35-85t85-35h160q50 0 85 35t35 85v600H120Zm280-240h40v-200h-40v200ZM200-200h240v-80h-40q-33 0-56.5-23.5T320-360v-200q0-33 23.5-56.5T400-640h40v-80q0-17-11.5-28.5T400-760H240q-17 0-28.5 11.5T200-720v520Zm488-217q-26 0-51-7t-49-18l25-76q20 9 39.5 15t36.5 6q12 0 24-4t25-12q24-17 48-23t46-6q25 0 51.5 6.5T933-518l-25 76q-23-8-42.5-14t-33.5-6q-12 0-26.5 4.5T775-442q-21 14-42.5 19.5T688-417Zm1-156q-26 0-52-7t-49-18l25-76q26 11 44 16t32 5q12 0 24-3.5t25-12.5q25-17 48.5-23t45.5-6q25 0 50 6.5t51 17.5l-25 76q-26-9-44-14.5t-32-5.5q-13 0-26.5 4T775-598q-18 13-40.5 19t-45.5 6Zm0 312q-26 0-51.5-7T588-286l25-76q22 10 41 15.5t35 5.5q12 0 24-3.5t25-12.5q23-16 49-22.5t46-6.5q25 0 51 7t49 17l-25 76q-26-9-44.5-14.5T832-306q-14 0-28.5 4.5T775-286q-17 12-39.5 18.5T689-261Zm-249 61v-528.5 8.5-8.5V-200Z" />
                  </svg>
                  <br></br>
                  Máy lạnh
                </div>
              </SwiperSlide>
              <SwiperSlide style={{ width: "60px" }}>
                <div style={{ fontSize: "13px", width: "78px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="34px"
                    viewBox="0 -960 960 960"
                    width="44px"
                    fill="#5f6368"
                  >
                    <path d="M80-160v-200q0-50 35-85t85-35h40v-320h480v320h40q50 0 85 35t35 85v200H80Zm240-320h320v-240H320v240ZM160-240h640v-120q0-17-11.5-28.5T760-400H200q-17 0-28.5 11.5T160-360v120Zm560-40q17 0 28.5-11.5T760-320q0-17-11.5-28.5T720-360q-17 0-28.5 11.5T680-320q0 17 11.5 28.5T720-280ZM160-400h640-640Z" />
                  </svg>
                  <br></br>
                  Sử dụng máy in, scan, hủy tài liệu
                </div>
              </SwiperSlide>
              <SwiperSlide style={{ width: "60px" }}>
                <div style={{ fontSize: "13px", width: "70px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="34px"
                    viewBox="0 -960 960 960"
                    width="55px"
                    fill="#5f6368"
                  >
                    <path d="M200-520v320h560v-320H200Zm0-80h560v-160H200v160Zm280 360q-33 0-56.5-23.5T400-320q0-27 15-57.5T480-480q50 72 65 102.5t15 57.5q0 33-23.5 56.5T480-240Zm200-400q17 0 28.5-11.5T720-680q0-17-11.5-28.5T680-720q-17 0-28.5 11.5T640-680q0 17 11.5 28.5T680-640ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-480v-160 160Z" />
                  </svg>
                  <br></br>
                  Diệt khuẩn bằng UVC
                </div>
              </SwiperSlide>
              <SwiperSlide style={{ width: "60px" }}>
                <div style={{ fontSize: "13px", width: "70px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="34px"
                    viewBox="0 -960 960 960"
                    width="50px"
                    fill="#5f6368"
                  >
                    <path d="M160-120v-80h640v80H160Zm160-160q-66 0-113-47t-47-113v-400h640q33 0 56.5 23.5T880-760v120q0 33-23.5 56.5T800-560h-80v120q0 66-47 113t-113 47H320Zm0-80h240q33 0 56.5-23.5T640-440v-320H240v320q0 33 23.5 56.5T320-360Zm400-280h80v-120h-80v120ZM320-360h-80 400-320Z" />
                  </svg>
                  <br></br>
                  Quán cafe trong khuôn viên
                </div>
              </SwiperSlide>
              <SwiperSlide style={{ width: "60px" }}>
                <div style={{ fontSize: "13px", width: "70px" }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="34px"
                    viewBox="0 -960 960 960"
                    width="44px"
                    fill="#5f6368"
                  >
                    <path d="M660-80v-120H560l140-200v120h100L660-80Zm-340 0q-17 0-28.5-11.5T280-120v-640q0-17 11.5-28.5T320-800h80v-80h160v80h80q17 0 28.5 11.5T680-760v280q-21 0-41 3.5T600-466v-254H360v400h94q-7 19-10.5 39t-3.5 41q0 46 16 87t45 73H320Z" />
                  </svg>
                  <br></br>
                  Nguồn và cổng sạc USB
                </div>
              </SwiperSlide>
            </Swiper>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Checkbox
              style={{ marginTop: "15px" }}
              onChange={handleCheckboxChange}
              checked={isChecked}
            >
              Sử dụng thêm dịch vụ đi kèm
            </Checkbox>
          </div>
        </div>
        <Button
          className="button"
          style={{
            marginLeft: "42%",
            width: "200px",
            fontSize: "18px",
            padding: "20px",
          }}
          type="primary"
          danger
          htmlType="submit"
          onClick={handleSubmit}
        >
          Xác Nhận
        </Button>
      </div>
      <Modal
        width={"83%"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleOk}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            padding: "25px",
          }}
        >
          {currentPods?.map((serviceItem: Service) => (
            <ServiceCard
              key={serviceItem.id}
              service={serviceItem}
              // isChecked={checkedStates[service.id] || false}
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
              alignItems: "end",
              marginBottom: "20px",
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
