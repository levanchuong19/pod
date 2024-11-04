import { UserOutlined } from "@ant-design/icons";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./index.scss";
interface JwtPayload {
  userId: string;
}
function Header() {
  const navigate = useNavigate();
  const handleUserIconClick = async () => {
    const token = localStorage.getItem("accessToken");
    console.log(token);

    if (token) {
      try {
        const decodedToken: JwtPayload = jwtDecode(token);
        const userId = decodedToken.userId;
        console.log("id:", userId);
        if (userId == null) {
          navigate("/login");
        } else {
          navigate(`/profile/${userId}`);
        }
      } catch (error) {
        console.error("Failed to fetch user data or decode token:", error);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="header">
      <div className="header__center">
        <div className="header__left">
          <a href="/">
            <img
              width={100}
              src="https://workflow.com.vn/wp-content/themes/workflow/assets/img/logo.png"
              alt=""
            />
          </a>
          <ul>
            <a href="/">
              <li>Trang chủ</li>
            </a>
            <a href="/reservation">
              <li>Đặt chỗ</li>
            </a>
            <a href="/device">
              <li>Thiết bị</li>
            </a>
            <a href="/menu">
              <li>Dịch vụ</li>
            </a>
          </ul>
        </div>
        <div className="header__reight">
          <UserOutlined
            onClick={handleUserIconClick}
            className="user"
            style={{ fontSize: 35 }}
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
