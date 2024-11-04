/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  Checkbox,
  CheckboxProps,
  InputNumber,
  InputNumberProps,
} from "antd";
import { Service } from "../modal/service";
import "./index.scss";
import formatVND from "../../utils/currency";
import { useState } from "react";

interface ServiceCardProps {
  service: Service;
  onSelect: (service: any, quantity: any, isChecked: any) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  const [showInputNumber, setShowInputNumber] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const onCheckboxChange: CheckboxProps["onChange"] = (e) => {
    const isChecked = e.target.checked;
    setShowInputNumber(isChecked);
    onSelect(service.id, quantity, isChecked);
  };

  const onQuantityChange: InputNumberProps["onChange"] = (value) => {
    const newQuantity = value as number;
    setQuantity(newQuantity);
    onSelect(service?.id, newQuantity || 1, true);
  };

  return (
    <div className="service-card">
      <Card
        className="service-card-inner"
        hoverable
        style={{ width: 340, height: 450 }}
        cover={
          <img
            style={{ width: "340px", height: 200 }}
            alt={service?.name}
            src={service?.imageUrl}
          />
        }
      >
        <div className="service-card-content">
          <div className="desc">
            <strong>{service?.name}</strong>
            <p>{service?.description}</p>
            <h4 style={{ color: "darkcyan" }}>
              {formatVND(service.unitPrice)}
            </h4>
          </div>

          <Checkbox
            style={{ marginTop: "15px", marginRight: "20px" }}
            onChange={onCheckboxChange}
          >
            Thêm
          </Checkbox>

          {showInputNumber && (
            <InputNumber
              min={1}
              max={10}
              defaultValue={1}
              placeholder="Số lượng"
              onChange={onQuantityChange}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default ServiceCard;
