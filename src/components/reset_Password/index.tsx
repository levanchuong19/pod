/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input } from "antd";
import { toast } from "react-toastify";
import api from "../../components/config/api";
import { useNavigate } from "react-router-dom";
import "./index.scss";

function ResetPassword() {
  const navigate = useNavigate();
  const handleResetPassword = async (values: any) => {
    try {
      console.log(values);
      await api.post(`authentication/password/reset`, values);
      toast.success("Your password has been reset successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("error.response.data");
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-title">Reset Password</h2>
      <Form
        labelCol={{ span: 24 }}
        onFinish={handleResetPassword}
        className="reset-password-form"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email!" }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="password"
          rules={[
            { required: true, message: "Please enter your new password!" },
          ]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>
        <Form.Item
          label="Code"
          name="token"
          rules={[{ required: true, message: "Please enter your code!" }]}
        >
          <Input placeholder="Enter your code!" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          className="reset-password-button"
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default ResetPassword;
