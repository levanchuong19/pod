import { useEffect, useState } from "react";
import { Location } from "../modal/location";
import api from "../config/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Device } from "../modal/device";
import { BarsOutlined } from "@ant-design/icons";
import "./index.scss";
import { POD } from "../modal/pod";
import DeviceCard from "../DeviceCard";

export default function ListDevice({ numberOfSlides = 3, autoplay = false }) {
  const [locations, setLocation] = useState<Location[]>();
  const [selectedSlide, setSelectedSlide] = useState<string>();
  const fetchLocation = async () => {
    try {
      const response = await api.get("locations");
      console.log(response.data);
      setLocation(response.data);
      setSelectedSlide("");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchLocation();
  }, []);
  const [device, setDevice] = useState<Device[]>();

  const fetchDevice = async () => {
    try {
      const response = await api.get("devices");
      console.log(response.data);
      setDevice(response.data);
      setFilteredDevices(response.data);
      setSelectedSlide("");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchDevice();
  }, []);

  const [pod, setPod] = useState<POD[]>();
  const fetchPod = async () => {
    try {
      const response = await api.get("pods");
      console.log(response.data);
      setPod(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchPod();
  }, []);

  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const handleLocationClick = (locationId: string) => {
    const filteredPods = pod?.filter((pod) => pod.locationId === locationId);
    const filtered = device?.filter((device) =>
      filteredPods?.some((pod) => pod.deviceId === device.id)
    );
    setFilteredDevices(filtered || []);
    setSelectedSlide(locationId);
  };
  return (
    <div style={{ backgroundColor: "#fff" }}>
      <h3 style={{ marginBottom: "30px" }} onClick={() => fetchDevice()}>
        {" "}
        <BarsOutlined /> Các loại thiết bị
      </h3>
      <div className="SlideLocation">
        <div className="slideLocation">
          <Swiper
            slidesPerView={numberOfSlides}
            // spaceBetween={20}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            // navigation={true}
            modules={autoplay ? [Autoplay, Navigation] : [Pagination]}
            className={`carousel ${numberOfSlides > 1 ? "multi-item" : ""}`}
          >
            {locations?.map((locationItem: Location) => (
              <SwiperSlide>
                <div
                  onClick={() => handleLocationClick(locationItem.id)}
                  className={
                    selectedSlide === locationItem?.id ? "active-slide" : ""
                  }
                >
                  {locationItem.name}{" "}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "90px",
          width: "100%",
          justifyContent: "center",
          marginBottom: "50px",
        }}
      >
        {filteredDevices?.map((deviceItem: Device) => (
          <DeviceCard key={deviceItem.id} device={deviceItem} />
        ))}
      </div>
    </div>
  );
}
