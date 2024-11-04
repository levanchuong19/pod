/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card, Input, Button, List, Avatar, Rate } from "antd";
import api from "../../components/config/api";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { RATING } from "../modal/rating";

const { TextArea } = Input;

interface JwtPayload {
  userId: string;
}

const Ratings: React.FC<{ podId: string }> = ({ podId }) => {
  const [showRating, setShowRating] = useState<RATING[]>([]);
  const [comment, setComment] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [value, setValue] = useState(0);
  const desc = ["terrible", "bad", "normal", "good", "wonderful"];

  const fetchRating = async () => {
    try {
      const response = await api.get("ratings");
      const filteredRatings = response.data.filter(
        (rating: RATING) => rating.podId === podId
      );
      console.log(filteredRatings);
      setShowRating(filteredRatings);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRating();

    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken: JwtPayload = jwtDecode(token);
        const userId = decodedToken.userId;
        setCustomerId(userId);
        console.log("Customer ID:", userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    console.log("Pod ID:", podId);
  }, [podId]);

  const handleAddComment = async () => {
    if (comment && customerId && podId && value) {
      const newComment = {
        podId: podId,
        customerName: "You",
        ratingValue: value,
        comments: comment,
        customerId: customerId,
        id: "",
        podName: "",
        creationDate: new Date(),
      };
      console.log("Submitting data:", newComment);
      try {
        await api.post("ratings", newComment);
        setShowRating([...showRating, newComment]);
        console.log("Rating added successfully:", newComment);
      } catch (error) {
        console.error("Error adding comment:", error);
      }

      setComment("");
      setValue(3);
    } else {
      console.log("Missing data:", { comment, customerId, podId, value });
    }
  };

  const handleRatingClick = (rating: RATING) => {
    setValue(rating.ratingValue);
    setComment(rating.comments);
  };

  return (
    <Card title="Đánh giá chất lượng và dịch vụ !" style={{ width: 550 }}>
      <Rate
        tooltips={desc}
        onChange={(value) => setValue(value)}
        value={value}
      />
      <br></br>
      <br></br>
      <TextArea
        rows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Viết đánh giá của bạn ở đây..."
      />
      <Button
        type="primary"
        onClick={handleAddComment}
        style={{ marginTop: 10 }}
      >
        Submit
      </Button>
      <List
        itemLayout="horizontal"
        dataSource={showRating}
        renderItem={(item) => (
          <List.Item key={item.id} onClick={() => handleRatingClick(item)}>
            <List.Item.Meta
              avatar={
                <Avatar src="https://cdn-icons-png.freepik.com/512/8742/8742495.png" />
              }
              title={<a>{item.customerName}</a>}
              description={`${item.comments} - ${moment(
                item.creationDate
              ).format("YYYY-MM-DD")}`}
            />
            <Rate disabled value={item.ratingValue} />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Ratings;
