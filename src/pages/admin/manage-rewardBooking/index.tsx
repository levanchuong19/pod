/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../../../components/config/api";
import { Table, Input, Button, Modal } from "antd";
import { RewardPoints } from "../../../components/modal/rewardpoints";

function ManageRewardPoint() {
  const [point, setPoint] = useState<RewardPoints[]>();
  const [accountId, setAccountId] = useState<string>("");
  const [totalPoints, setTotalPoints] = useState<any>();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const columns = [
    {
      title: "No",
      key: "index",
      render: (_text: any, _record: any, index: number) => index + 1,
    },
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Account ID",
      dataIndex: "accountId",
      key: "accountId",
    },
    {
      title: "TransactionDate",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (text: string | number | Date) => new Date(text).toLocaleString(),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Transaction Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (text: string | number | Date) => new Date(text).toLocaleString(),
    },
  ];
  const fetchRewardPoint = async () => {
    try {
      const response = await api.get("rewardpoints");
      console.log(response.data);
      setPoint(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRewardPoint();
  }, []);

  const fetchTotalPoints = async (accountId: string) => {
    try {
      const response = await api.get(`rewardpoints/total/${accountId}`);
      console.log(response.data.data);
      setTotalPoints(response.data.data);
    } catch (error) {
      console.log("lỗi", error);
      setTotalPoints(null);
    }
  };

  const handleSearch = () => {
    fetchTotalPoints(accountId);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Input
          placeholder="Enter Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          style={{ width: "300px", marginRight: "10px" }}
        />
        <Button onClick={handleSearch} type="primary">
          Search
        </Button>
      </div>
      <Modal
        title="Account Reward Points"
        open={isModalVisible}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        okText="OK"
      >
        {totalPoints !== null ? (
          <p>
            Tổng điểm của account: <strong>{totalPoints?.accountName}</strong>{" "}
            là : {totalPoints?.value} điểm
          </p>
        ) : (
          <p>No points found for this Account ID.</p>
        )}
      </Modal>
      <Table dataSource={point} columns={columns} />
    </div>
  );
}

export default ManageRewardPoint;
