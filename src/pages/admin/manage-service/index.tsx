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
import DashboardTemplate from "../../../components/dashboard_template";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

function ManageService() {
  const title = "services";
  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (_text: any, _record: any, index: number) => index + 1,
    },
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "UnitPrice", dataIndex: "unitPrice", key: "unitPrice" },
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
      {/* Name */}
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please enter the name" }]}
      >
        <Input placeholder="Enter name" />
      </Form.Item>

      {/* Description */}
      <Form.Item name="description" label="Description">
        <Input.TextArea placeholder="Enter description" />
      </Form.Item>

      {/* Unit Price */}
      <Form.Item
        name="unitPrice"
        label="Unit Price"
        rules={[{ required: true, message: "Please enter the unit price" }]}
      >
        <InputNumber
          placeholder="Enter unit price"
          min={0}
          style={{ width: "100%" }}
        />
      </Form.Item>

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
    </>
  );
  return (
    <div>
      <DashboardTemplate
        fileList={fileList}
        title={title}
        columns={columns}
        formItems={formItems}
        apiURI="services"
        data={[]}
      />
    </div>
  );
}

export default ManageService;
