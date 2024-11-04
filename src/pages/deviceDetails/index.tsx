
import { useNavigate } from "react-router-dom";
import "./index.scss"
import { Button } from "antd";

function DeviceDetails() {
    const navigate = useNavigate();
    
    
  return (
    <div className="DeviceDetails" >
       <div className="deviceDetails">
       <div className="deviceDetails__left">
       <img style={{borderRadius:"15px",objectFit:"cover" }} width={600}  src="https://workflow.com.vn/wp-content/uploads/2024/07/pod-don-doi.png" alt="" />
       </div>

      <div className="deviceDetails__reight" >
        <h1>WorkPod đơn & đôi</h1>
        <>Không gian làm việc được trang bị đầy đủ tiện ích, hoàn hảo để 1 – 2 người tập trung hoàn thành công việc trong khoảng thời gian ngắn. Khi sử dụng WorkPOD, bạn có thể vừa tận hưởng sự riêng tư của mình nhưng vẫn có thể quan sát môi trường năng động và tràn đầy năng lượng tại WorkFlow Space.</>
        <p>Mọi WorkPod đều được trang bị:</p>
        <ul style={{gap:"8px", display:"flex", flexDirection:"column", paddingLeft:"15px"}}>
        <li>Ghế ngồi công thái học</li>
        <li>Hệ thống đối lưu không khí</li>
        <li>Hệ thống diệt khuẩn công nghệ UVC LED</li>
        <li>Ổ cắm điện, cổng USB chuẩn quốc tế</li>
        <li>Đèn điều chỉnh được ánh sáng</li>
        <li>Rèm che</li>
        <li>Cách âm lên đến 70% với môi trường bên ngoài</li>
        <li>Trà/nước lọc miễn phí</li>
        </ul>
        <Button className="button" type="primary" danger onClick={()=> navigate("/device")}> Đặt phòng ngay</Button>
      </div>
       </div>
       <div className="deviceDetails">
      <div className="deviceDetails__reight" >
        <h1>Phòng họp</h1>
        <p>Các phòng họp tại WorkFlow Space có đa dạng sức chứa từ 4 – 12 người, được phối hợp hài hòa giữa không gian xanh và ánh sáng tự nhiên. Phòng họp còn được trang bị các tiện ích hiện đại phục vụ cho các cuộc thảo luận hiệu quả:</p>
        <ul style={{gap:"8px", display:"flex", flexDirection:"column", paddingLeft:"15px"}}>
        <li>Smart tivi</li>
        <li>Ghế ngồi thoải mái</li>
        <li>Flipchart/Bảng trắng</li>
        <li>Rèm che</li>
        <li>Nước suối/ trà Shan Tuyết ủ lạnh</li>
        <li>Các tiện ích cơ bản khác: Điều hòa, wifi, máy lọc không khí, ổ điện,…</li>
        </ul>
        <Button className="button" type="primary" danger onClick={()=> navigate("/device")}> Đặt phòng ngay</Button>
      </div>
      <div className="deviceDetails__left">
       <img style={{borderRadius:"15px",objectFit:"cover" }} width={600}  src="https://workflow.com.vn/wp-content/uploads/2024/07/pod-meeting.jpg" alt="" />
       </div>
       </div>
       
    </div>
  )
}

export default DeviceDetails