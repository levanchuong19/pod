/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Form,
  GetProp,
  Image,
  Input,
  InputNumber,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import DashboardTemplate, {
  Column,
} from "../../../components/dashboard_template";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

function ManageDevice() {
  const title = "devices";
  const columns: Column[] = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (_text: any, _record: any, index: number) => index + 1,
    },
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "RoomType", dataIndex: "roomType", key: "roomType" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Floor", dataIndex: "floor", key: "floor" },
    {
      title: "ImageUrl",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (img: string | undefined) => <Image src={img} width={200} />,
    },
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
    <>
      {/* Room Type */}
      <Form.Item
        label="Room Type"
        name="roomType"
        rules={[{ required: true, message: "Please input the room type!" }]}
      >
        <Input placeholder="Enter room type" />
      </Form.Item>

      {/* Floor */}
      <Form.Item
        label="Floor"
        name="floor"
        rules={[{ required: true, message: "Please input the floor!" }]}
      >
        <Input placeholder="Enter floor number" />
      </Form.Item>

      {/* Status */}
      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: "Please select the status!" }]}
      >
        <InputNumber />
      </Form.Item>

      {/* Image URL */}
      <Form.Item label="Image URL" name="imageUrl">
        <Upload
          action="http://localhost:5088/api/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
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
        {/* <Input /> */}
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
        apiURI="devices"
      />
    </div>
  );
}

export default ManageDevice;
