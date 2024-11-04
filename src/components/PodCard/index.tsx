import { Button, Card } from "antd"
import { useNavigate } from "react-router-dom"
import { LayoutOutlined, UserOutlined } from "@ant-design/icons";
import formatVND from "../../utils/currency";
import "./index.scss"
import { POD } from "../modal/pod";


interface Card2Props{
    pod : POD
}
function PodCard({pod}: Card2Props) {
    const Navigate = useNavigate();
    const { Meta } = Card;
  return (
    <div>
        <Card className="card3"
    hoverable
    style={{ width: 350,objectFit:"cover"  }}
    cover={<a ><img alt="example" src={pod?.imageUrl} /></a> }
    
  >
    <Meta/>
    <p className="price">{formatVND(pod?.pricePerHour)}/giờ</p>
  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
  <div className="desc">
   <strong>{pod?.name}</strong>
   <div style={{display:"flex",gap:"20px"}}>
   <p><UserOutlined /> {pod?.capacity}</p>
   <p><LayoutOutlined /> {pod?.area} m </p>
   </div>
         
   </div>
   <Button className="button" type="primary" danger onClick={()=> Navigate(`/booking/${pod.id}`)}>Đặt chỗ</Button>
  </div>
  </Card>
     
    </div>
  )
}

export default PodCard