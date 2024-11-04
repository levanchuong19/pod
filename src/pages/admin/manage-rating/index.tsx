/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { RATING } from "../../../components/modal/rating";
import api from "../../../components/config/api";
import { Button, Popconfirm, Table } from "antd";
import { toast } from "react-toastify";

function ManageRating() {
  const [rating, setRating] = useState<RATING[]>();

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`ratings/${id}`);
      toast.success("Success deleted!!!");
      fetchRating();
    } catch (error) {
      console.log(error);
      toast.error("delete error");
    }
  };

  const columns = [
    {
      title: "No",
      key: "index",
      render: (_text: any, _record: any, index: number) => index + 1,
    },
    {
      title: "POD ID",
      dataIndex: "podId",
      key: "podId",
    },
    {
      title: "Rating Value",
      dataIndex: "ratingValue",
      key: "ratingValue",
      render: (value: any) => value || "N/A",
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
    },
    {
      title: "Customer ID",
      dataIndex: "customerId",
      key: "customerId",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id: string) => (
        <>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
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

  const fetchRating = async () => {
    try {
      const response = await api.get("ratings");
      console.log(response.data);
      setRating(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchRating();
  }, []);
  return (
    <div>
      <Table dataSource={rating} columns={columns} />
    </div>
  );
}

export default ManageRating;
