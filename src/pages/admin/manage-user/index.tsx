/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DatePicker,
  Form,
  GetProp,
  Image,
  Input,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import DashboardTemplate, {
  Column,
} from "../../../components/dashboard_template";

import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import api from "../../../components/config/api";

interface JwtPayload {
  userId: any;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
}

function ManageUser() {
  const title = "accounts";
  const columns: Column[] = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (_text: any, _record: any, index: number) => index + 1,
    },
    { title: "Id", dataIndex: "id", key: "id" },
    { title: "FirstName", dataIndex: "firstName", key: "firstName" },
    { title: "LastName", dataIndex: "lastName", key: "lastName" },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (text: any) => {
        const gender: { [key: string]: string } = {
          1: "Male",
          2: "Female",
        };
        return gender[text] || "Unknown";
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text: any) => {
        const role: { [key: string]: string } = {
          Admin: "Admin",
          Manager: "Manager",
          Staff: "Staff",
          Customer: "Customer",
        };
        return role[text] || "Unknown";
      },
    },
    {
      title: "DateOfBirthday",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (dateOfBirth) => {
        return dayjs(dateOfBirth).format("YYYY-MM-DD");
      },
    },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (img) => <Image src={img} width={30} />,
    },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "PhoneNumber", dataIndex: "phoneNumber", key: "phoneNumber" },
  ];

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [roles, setRoles] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken: JwtPayload = jwtDecode(token);
      const userRole =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      setRoles(userRole);
      fetchAccountsByRole(userRole);
    }
  }, []);

  const fetchAccountsByRole = async (role: string) => {
    try {
      let apiUrl = "accounts";
      let responseStaff = null;
      let responseCustomer = null;

      if (role === "Staff") {
        apiUrl = `${apiUrl}?Role=3`; // Staff chỉ thấy tài khoản Customer
        const response = await api.get(apiUrl);
        setAccounts(response.data);
      } else if (role === "Manager") {
        responseStaff = await api.get(`${apiUrl}?Role=3`);
        responseCustomer = await api.get(`${apiUrl}?Role=2`);
        const combinedData = [...responseStaff.data, ...responseCustomer.data];
        setAccounts(combinedData);
      } else if (role === "Admin") {
        apiUrl = `${apiUrl}`;
        const response = await api.get(apiUrl);
        setAccounts(response.data);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };
  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  console.log("acccount", accounts);
  const formItems = (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[{ required: true, message: "Please input your first name!" }]}
      >
        <Input placeholder="Enter your first name" />
      </Form.Item>

      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[{ required: true, message: "Please input your last name!" }]}
      >
        <Input placeholder="Enter your last name" />
      </Form.Item>

      <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
        <Select>
          <Select.Option value={0}>Male</Select.Option>
          <Select.Option value={1}>Female</Select.Option>
          <Select.Option value={2}>Other</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Date of Birth"
        name="dateOfBirth"
        rules={[
          { required: true, message: "Please select your date of birth!" },
        ]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: "Please input your address!" }]}
      >
        <Input placeholder="Enter your address" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            type: "email",
            message: "Please enter a valid email!",
          },
        ]}
      >
        <Input placeholder="Enter your email" />
      </Form.Item>

      <Form.Item
        label="PhoneNumber"
        name="phoneNumber"
        rules={[{ required: true, message: "Please enter your phone number!" }]}
      >
        <Input placeholder="Enter your phone number" />
      </Form.Item>

      {roles === "Admin" && (
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role!" }]}
        >
          <Select disabled={roles !== "Admin"}>
            <Select.Option value={1}>Manager</Select.Option>
            <Select.Option value={2}>Staff</Select.Option>
            <Select.Option value={3}>Customer</Select.Option>
          </Select>
        </Form.Item>
      )}
      <Form.Item name="image" label="Image">
        <Upload
          action="http://localhost:5088/api/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length === 1 ? null : uploadButton}
        </Upload>
      </Form.Item>
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <DashboardTemplate
        fileList={fileList}
        title={title}
        columns={columns}
        formItems={formItems}
        data={accounts}
        apiURI="accounts"
      />
      {/* <Table dataSource={accounts} columns={columns} /> */}
    </div>
  );
}

export default ManageUser;
