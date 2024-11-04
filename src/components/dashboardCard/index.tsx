import React from "react";
import { Card, Button } from "antd";
import "./index.scss";

interface CardProps {
  title: string;
  color: string;
  onClick: () => void;
}

const CardComponent: React.FC<CardProps> = ({ title, color, onClick }) => {
  return (
    <Card
      style={{
        backgroundColor: color,
        color: "white",
        margin: "10px",
        width: "400px",
        height: "100px",
      }}
    >
      <div className="card">
        <div className="card-title">{title}</div>
        <div
          style={{ width: "265px", marginLeft: "-32px" }}
          className="line"
        ></div>
        <div className="card-action">
          <Button type="link" onClick={onClick} style={{ color: "white" }}>
            Chi tiết
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CardComponent;
