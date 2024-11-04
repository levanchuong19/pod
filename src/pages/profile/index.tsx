/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Modal, Spin, Table } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../components/config/api";
import { jwtDecode } from "jwt-decode";
import { User } from "../../components/modal/user";
import "./index.scss";
import dayjs from "dayjs";
import { RewardPoints } from "../../components/modal/rewardpoints";

interface JwtPayload {
  userId: any;
}
function Profile() {
  const [profile, setProfile] = useState<User>();
  const [isPoint, setIsPoint] = useState<RewardPoints[]>();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const columns = [
    {
      title: "No",
      key: "index",
      render: (_text: any, _record: any, index: number) => index + 1,
    },
    {
      title: "Transaction Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (transactionDate: any) => {
        return dayjs(transactionDate).format("DD/MM/YYYY");
      },
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  const handleOnclick = () => {
    setShowModal(true);
    console.log("point", isPoint);
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken: JwtPayload = jwtDecode(token);
        const userId = decodedToken.userId;
        const [response, point] = await Promise.all([
          api.get(`accounts/${userId}`),
          api.get(`rewardpoints?AccountId=${userId}`),
        ]);
        setProfile(response.data.data);
        setIsPoint(point.data);
        console.log(point.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch user data.");
        setLoading(false);
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  function handleUpdateClick() {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken: JwtPayload = jwtDecode(token);
      const userId = decodedToken.userId;
      navigate(`/userProfile/${userId}`);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    toast.success("Đăng xuất tài khoản thành công");
    navigate("/");
  };
  return (
    <div>
      <div className="show-profile-container">
        <h1>User Profile Details</h1>
        {loading ? (
          <Spin tip="Loading..." />
        ) : (
          profile && (
            <div className="profile-card">
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>First Name:</strong> {profile.firstName}
              </p>
              <p>
                <strong>Last Name:</strong> {profile.lastName}
              </p>
              <p>
                <strong>User Name: </strong>
                {profile.firstName + " " + profile.lastName}
              </p>
              <p>
                <strong>Phone Number:</strong> {profile.phoneNumber}
              </p>
              <p>
                <strong>Address:</strong> {profile.address}
              </p>

              <div
                style={{ display: "flex", gap: "20px", alignItems: "center" }}
              >
                <Button type="primary" onClick={handleUpdateClick}>
                  Update Profile
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={handleLogout}
                  className="logout-button"
                >
                  Logout
                </Button>
                <span
                  style={{ cursor: "pointer", alignItems: "center" }}
                  onClick={handleOnclick}
                >
                  Lịch sử điểm thưởng !
                </span>
              </div>
            </div>
          )
        )}

        <div style={{ width: 900, padding: "0px 800px" }}>
          <Modal
            style={{ width: 900 }}
            open={showModal}
            onOk={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
          >
            <Table
              style={{ width: "900px" }}
              columns={columns}
              dataSource={isPoint}
              rowKey="id"
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default Profile;
