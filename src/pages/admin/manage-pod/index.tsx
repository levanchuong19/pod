/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Form,
  GetProp,
  Image,
  Input,
  InputNumber,
  Select,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";

import { useEffect } from "react";
import DashboardTemplate, {
  Column,
} from "../../../components/dashboard_template";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../../components/config/api";

function ManagePod() {
  const title = "pods";

  const columns: Column[] = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (_text: any, _record: any, index: number) => index + 1,
    },
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Capacity", dataIndex: "capacity", key: "capacity" },
    { title: "Area", dataIndex: "area", key: "area" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (img: string | undefined) => <Image src={img} />,
    },
    { title: "PricePerHour", dataIndex: "pricePerHour", key: "pricePerHour" },
    { title: "Location", dataIndex: "locationName", key: "locationName" },
    { title: "DeviceId", dataIndex: "deviceType", key: "deviceType" },
  ];

  const [previewOpen, setPreviewOpen] = useState(false);
  const [location, setLocation] = useState([]);
  const [devices, setDevices] = useState([]);
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

  const fetchDataLocation = async () => {
    const response = await api.get("locations");
    console.log(response.data);
    setLocation(response.data);
  };
  const fetchDataDevices = async () => {
    const response = await api.get("devices");
    console.log(response.data);
    setDevices(response.data);
  };
  useEffect(() => {
    fetchDataLocation();
    fetchDataDevices();
  }, []);

  const optionLocation = location?.map((item: any) => ({
    key: item?.id,
    value: item?.id,
    label: item?.name,
  }));
  const optionDevices = devices?.map((item: any) => ({
    key: item?.id,
    value: item?.id,
    label: item?.roomType,
  }));

  const formItems = (
    <>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please enter the name" }]}
      >
        <Input placeholder="Enter name" />
      </Form.Item>

      {/* Capacity */}
      <Form.Item
        name="capacity"
        label="Capacity"
        rules={[{ required: true, message: "Please enter the capacity" }]}
      >
        <InputNumber
          placeholder="Enter capacity"
          min={0}
          style={{ width: "100%" }}
        />
      </Form.Item>

      {/* Area */}
      <Form.Item
        name="area"
        label="Area"
        rules={[{ required: true, message: "Please enter the area" }]}
      >
        <InputNumber
          placeholder="Enter area"
          min={0}
          style={{ width: "100%" }}
        />
      </Form.Item>

      {/* Description */}
      <Form.Item name="description" label="Description">
        <Input.TextArea placeholder="Enter description" />
      </Form.Item>

      {/* Price Per Hour */}
      <Form.Item
        name="pricePerHour"
        label="Price Per Hour"
        rules={[{ required: true, message: "Please enter the price per hour" }]}
      >
        <InputNumber
          placeholder="Enter price per hour"
          min={0}
          style={{ width: "100%" }}
        />
      </Form.Item>

      {/* Image Upload */}
      <Form.Item name="imageUrl" label="Image">
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length == 1 ? null : uploadButton}
        </Upload>
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
      </Form.Item>

      {/*  LocationId */}
      <Form.Item label="LocationId" name="locationId">
        <Select options={optionLocation} />
      </Form.Item>

      {/*  DeviceId */}
      <Form.Item label="DeviceId" name="deviceId">
        <Select options={optionDevices} />
      </Form.Item>
    </>
  );

  return (
    <div>
      <DashboardTemplate
        fileList={fileList}
        title={title}
        columns={columns}
        formItems={formItems}
        apiURI="pods"
      />
    </div>
  );
}

export default ManagePod;
