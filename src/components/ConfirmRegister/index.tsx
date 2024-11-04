import { Button, Form, Input } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../components/config/api";
import AuthenLayout from "../../components/auth-layout";

function ConfirmCode() {
  const navigate = useNavigate();

  const handleConfirmCode = async (values: {
    email: any;
    verificationCode: any;
  }) => {
    try {
      const { email, verificationCode } = values;
      const response = await api.get(`authentication/email/verify`, {
        params: {
          email: email,
          verificationCode: verificationCode,
        },
      });

      console.log(response);
      toast.success("Xác thực thành công!");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Confirm Failed, Try again!!.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",

        backgroundColor: "#f0f2f5",
      }}
    >
      <AuthenLayout>
        <div
          style={{
            maxWidth: "400px",
            width: "100%",
            background: "#fff",
            padding: "30px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Xác nhận mã OTP
          </h2>
          <Form labelCol={{ span: 24 }} onFinish={handleConfirmCode}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                },
              ]}
            >
              <Input placeholder="Nhập email của bạn" />
            </Form.Item>
            <Form.Item
              label="Mã xác nhận"
              name="verificationCode"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mã xác nhận!",
                },
              ]}
            >
              <Input placeholder="Nhập mã xác nhận từ email" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                height: "40px",
                fontSize: "16px",
              }}
            >
              Confirm
            </Button>
          </Form>
        </div>
      </AuthenLayout>
    </div>
  );
}

export default ConfirmCode;
