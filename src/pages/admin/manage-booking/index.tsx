/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Booking } from "../../../components/modal/booking";
import api from "../../../components/config/api";
import { Button, DatePicker, Table } from "antd";
import formatVND from "../../../utils/currency";
import moment from "moment";

function ManageBooking() {
  const [booking, setBooking] = useState<Booking[]>();
  const [filteredBooking, setFilteredBooking] = useState<Booking[] | undefined>(
    []
  );
  const [startTime, setStartTime] = useState<string | null>(null);
  const columns = [
    {
      title: "No",
      key: "index",
      render: (_text: any, _record: any, index: number) => index + 1,
    },
    {
      title: "Account ID",
      dataIndex: "accountId",
      key: "accountId",
    },
    {
      title: "Account Name",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "Pod ID",
      dataIndex: "podId",
      key: "podId",
    },
    {
      title: "Pod Name",
      dataIndex: "podName",
      key: "podName",
    },
    {
      title: "Price/Hour",
      dataIndex: "pricePerHour",
      key: "pricePerHour",
      render: (text: any) => formatVND(text),
    },
    {
      title: "Address",
      dataIndex: "locationAddress",
      key: "locationAddress",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (text: string | number | Date) => new Date(text).toLocaleString(),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (text: string | number | Date) => new Date(text).toLocaleString(),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (text: any) => formatVND(text),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (text: any) => {
        const paymentMethods: { [key: string]: string } = {
          MoMo: "MoMo",
          VnPay: "VnPay",
        };

        return paymentMethods[text] || "Unknown";
      },
    },
    {
      title: "Booking Services",
      dataIndex: "bookingServices",
      key: "bookingServices",
      render: (services: any[]) =>
        services.map((service) => (
          <div key={service.serviceId}>
            <p>Service ID: {service.serviceId}</p>
            <p>Quantity: {service.quantity}</p>
          </div>
        )),
    },
  ];

  const fetchBooking = async () => {
    try {
      const response = await api.get("bookings?PaymentMethod=0");
      console.log(response.data);
      setBooking(response.data);
      setFilteredBooking(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  const handleSearch = () => {
    const filtered = booking?.filter((b) => {
      if (startTime) {
        const bookingStartTime = moment(b.startTime).format("YYYY-MM-DD HH:mm");
        return bookingStartTime === startTime;
      }
      return true; // If no startTime is provided, show all bookings
    });
    setFilteredBooking(filtered);
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <DatePicker
          showTime
          placeholder="Select Start Time"
          format="YYYY-MM-DD HH"
          onChange={(value) =>
            setStartTime(value ? value.format("YYYY-MM-DD HH:mm") : null)
          }
          style={{ marginRight: "10px" }}
        />
        <Button onClick={handleSearch} type="primary">
          Search
        </Button>
      </div>
      <Table dataSource={filteredBooking} columns={columns} />
    </div>
  );
}

export default ManageBooking;
