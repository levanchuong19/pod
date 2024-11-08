/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Modal, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";
import api from "../config/api";
import dayjs from "dayjs";
import uploadFile from "../../utils/upload";
import { jwtDecode } from "jwt-decode";

export interface Column {
  title: string;
  dataIndex: string;
  key: string;

  render?: (text: any, record: any, index: number) => any;
}

interface JwtPayload {
  userId: any;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
}

interface DashboardTemplateProps {
  title: string;
  columns: Column[];
  apiURI: string;
  formItems: React.ReactElement;
  fileList: any;
  data: any[];
}

function DashboardTemplate({
  columns,
  formItems,
  apiURI,
  title,
  fileList,
  data,
}: DashboardTemplateProps) {
  const [datas, setDatas] = useState(data || []);
  const [showModal, setShowModal] = useState(false);
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (data) {
      setDatas(data);
    }
  }, [data]);

  //GET
  const fetchData = async () => {
    try {
      const response = await api.get(apiURI);
      console.log(response.data);

      setDatas(response.data);
      setFetching(false);
    } catch (error) {
      console.log(error);
      toast.error(`Error fetching ${title}`);
    }
  };

  //CREATE OR UPDATE
  const handleSubmit = async (values: {
    imageUrl: string;
    image: string;
    role: number | string;
    dateOfBirth: dayjs.Dayjs | string;
    id: any;
  }) => {
    if (fileList && fileList.length > 0) {
      try {
        console.log(fileList[0].originFileObj);
        const img = await uploadFile(fileList[0].originFileObj);
        console.log(img);
        values.image = img;
        values.imageUrl = img;
      } catch (error) {
        console.log(error);
        toast.error("Image upload failed!");
        return;
      }
    }

    if (values.dateOfBirth) {
      const dateFormatted = dayjs(values.dateOfBirth).format("YYYY-MM-DD");
      values.dateOfBirth = dateFormatted;
    }

    try {
      console.log("Submitting form...");
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const decodedToken: JwtPayload = jwtDecode(token || "");
      const userRole =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      console.log("role", userRole);
      if (userRole === "Staff" || userRole === "Manager") {
        // Preserve the original role from the record
        const originalRecord = datas.find((item) => item.id === values.id);
        if (originalRecord) {
          values.role = originalRecord.role; // Set role back to the original record's role
        }
      }
      if (values.role === "Customer") {
        values.role = 3;
      }
      if (values.id) {
        console.log("Updating item with ID:", values.id);
        await api.put(`${apiURI}/${values.id}`, values);
        toast.success("Update successfully");
      } else {
        console.log("Creating new item");
        await api.post(apiURI, values);
        toast.success("Successfully created!");
      }

      fetchData();
      form.resetFields();
      setShowModal(false);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  //DELETE
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`${apiURI}/${id}`);
      toast.success("Success deleted!!!");
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("delete error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const tableColumn = [
    ...columns,
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (
        id: string,
        record: { dateOfBirth: dayjs.Dayjs | string; id: string }
      ) => (
        <>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Button
              type="primary"
              onClick={() => {
                const recordValiDate = {
                  ...record,
                  dateOfBirth: record.dateOfBirth
                    ? dayjs(record.dateOfBirth, "YYYY-MM-DD ")
                    : null,
                };
                form.setFieldsValue(recordValiDate);
                setShowModal(true);
                // form.resetFields();
              }}
            >
              Update
            </Button>
            <Popconfirm
              title="Delete"
              description="Do you want to delete"
              onConfirm={() => handleDelete(id)}
            >
              <Button type="primary" danger>
                Delete
              </Button>
            </Popconfirm>
          </div>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button
        onClick={() => {
          form.resetFields();
          setShowModal(true);
        }}
        type="primary"
      >
        Create new {title}
      </Button>
      <Table loading={fetching} dataSource={datas} columns={tableColumn} />
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmit}>
          <Form.Item name="id" label="id" hidden></Form.Item>
          {formItems}
        </Form>
      </Modal>
    </div>
  );
}

export default DashboardTemplate;
