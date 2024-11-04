import { Button, DatePicker, Form, Input, Select, Row, Col } from "antd";
import api from "../../components/config/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "./index.scss";

function Register() {
  const navigate = useNavigate();

  const handleRegister = async (values: {
    dateOfBirth: moment.MomentInput;
  }) => {
    // set ngày tháng năm đúng form
    const formattedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth
        ? moment(values.dateOfBirth).format("DD-MM-YYYY")
        : null,
    };

    try {
      const response = await api.post(
        "authentication/register",
        formattedValues
      );
      console.log(response.data);
      toast.success("Register Success!!");
      navigate("/ConfirmRegister");
    } catch (error) {
      console.log(error);
      toast.error("Register failed");
    }
  };

  return (
    <div className="register-container">
      <Form
        name="register"
        onFinish={handleRegister}
        layout="vertical"
        className="register-form"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[
                { required: true, message: "Please select your gender!" },
              ]}
            >
              <Select>
                <Select.Option value={0}>Male</Select.Option>
                <Select.Option value={1}>Female</Select.Option>
                <Select.Option value={2}>Other</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Date of Birth"
              name="dateOfBirth"
              rules={[
                {
                  required: true,
                  message: "Please select your date of birth!",
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please input your address!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
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
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <div style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Register;
