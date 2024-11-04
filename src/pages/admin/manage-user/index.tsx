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
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

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
    { title: "Gender", dataIndex: "gender", key: "gender" },
    {
      title: "DateOfBirthday",
      dataIndex: "dateOfBirthday",
      key: "dateOfBirthday",
      render: (dateOfBirth) => {
        return dayjs(dateOfBirth).format("DD/MM/YYYY");
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
        name="dateOfBirthday"
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
        apiURI="accounts"
      />
    </div>
  );
}

export default ManageUser;
