import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./index.scss";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

export default function Carousel() {
  return (
    <>
      <div className="session">
        <div className="line"></div>
      </div>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="swiper"
      >
        <SwiperSlide>
          <img
            src="https://i.postimg.cc/Vk42Rk7B/Screenshot-2024-09-11-202817.png"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://i.postimg.cc/7PGDZ0Bv/Screenshot-2024-09-11-20-21-45-319.png"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://i.postimg.cc/Bb1hfqcy/Screenshot-2024-09-11-20-04-20-419.png"
            alt=""
          />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
