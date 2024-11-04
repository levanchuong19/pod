import { useEffect, useState } from "react";
import { Location } from "../modal/location";
import api from "../config/api";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import "./index.scss";
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { EnvironmentOutlined } from "@ant-design/icons";
import LocationCard from "../LocationCard";


export default function PodBooking({
  numberOfSlides = 1,
  autoplay = false,
}) {
  const [location, setLocation] = useState<Location[]>();
    const fetchLocation = async () =>{
        try{
            const response = await api.get("locations");
               setLocation(response.data.filter((item : Location) => item.isDelete ===  true));
              setLocation(response.data)
        }catch(err){
            console.log(err);
        }
    }
     useEffect(() =>{
        fetchLocation();
     },[]);
  return (
    <div style={{backgroundColor:"#fff"}}>
    <div className="line1"></div>
    <h3><EnvironmentOutlined /> Địa điểm</h3>
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
       
       {location?.map((locationItem : Location) => (<SwiperSlide className="slide"><LocationCard key={locationItem.id} location={locationItem}/></SwiperSlide>))}
      </Swiper>
      <div className="line2"></div>
    </div>
  );
}
