/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import { toast } from "react-toastify";
import "./index.scss";

function ForgotPassword() {
  const navigate = useNavigate();

  const handleForgotPassword = async (values: any) => {
    try {
      await api.post("authentication/password/forgot", values);
      toast.success("Check your email to reset your password!");
      navigate("/reset_Password");
    } catch (error) {
      console.log(error);
      toast.error("error");
    }
  };
  return (
    <div>
      <div className="forgot-password-container">
        <h2 className="forgot-password-title">Forgot Password</h2>
        <Form
          labelCol={{ span: 24 }}
          onFinish={handleForgotPassword}
          className="forgot-password-form"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input
              placeholder="Enter your email"
              className="forgot-password-input"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="forgot-password-button"
          >
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPassword;
