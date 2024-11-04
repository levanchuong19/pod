/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Form, Input } from "antd";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import api from "../../components/config/api";
import AuthenLayout from "../../components/auth-layout";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, Ggprovider } from "../../components/config/firebase";
import "./index.scss"; // Create and import a CSS file for better management
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";
import { jwtDecode } from "jwt-decode";
import { useNotification } from "../NotificationContext";
import { v4 as uuidv4 } from "uuid";

interface JwtPayload {
  userId: any;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
}
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addNotification } = useNotification();

  const handleLoginGoogle = () => {
    signInWithPopup(auth, Ggprovider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        console.log(credential);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  const handleLogin = async (values: any) => {
    try {
      const response = await api.post("authentication/login", values);
      const { accessToken } = response.data.data;
      localStorage.setItem("accessToken", accessToken);
      toast.success("Login success!");

      const decodedToken: JwtPayload = jwtDecode(accessToken);
      const roles =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      if (roles === "Customer") {
        navigate("/");
      } else {
        navigate("/dashboard");
      }
      dispatch(login(response.data));
      addNotification({
        id: uuidv4(),
        message: "Login successful!",
        body: "You have logged in successfully.",
      });
    } catch (error) {
      console.log(error);
      toast.error("Email or Password Invalid");
    }
  };

  return (
    <AuthenLayout>
      <div className="login-container">
        <h2 className="login-title">Sign In</h2>
        <Form
          labelCol={{ span: 24 }}
          onFinish={handleLogin}
          className="login-form"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter Email" }]}
          >
            <Input placeholder="Email" className="login-input" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter password" }]}
          >
            <Input.Password placeholder="Password" className="login-input" />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="login-button">
            Login
          </Button>

          <p className="forgot_password">
            <Link to={"/Forgot_Password"}>Forgot password?</Link>
          </p>

          <Button onClick={handleLoginGoogle} className="google-button">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/480px-Google_%22G%22_logo.svg.png"
              width={25}
              alt="Google logo"
            />
            <span>Login with Google</span>
          </Button>

          <div className="register-section">
            <span className="register-text">Do you have an account yet?</span>
            <a onClick={handleRegisterRedirect} className="register-link">
              Register
            </a>
          </div>
        </Form>
      </div>
    </AuthenLayout>
  );
}

export default Login;
