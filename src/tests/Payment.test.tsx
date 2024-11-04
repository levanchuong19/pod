import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmBooking from "../pages/confirmBooking";

test("should allow payment after booking pod", async () => {
  // Giả lập đã có booking thành công
  const bookingData = { podId: "123", bookingCode: "ABC123", status: "booked" };
  localStorage.setItem("bookingData", JSON.stringify(bookingData));

  render(<ConfirmBooking />);

  // Nhấn nút thanh toán
  fireEvent.click(screen.getByText("Thanh toán")); // Use "Thanh toán" instead of "Pay Now"

  // Kiểm tra xem có thực hiện thanh toán thành công không
  expect(screen.getByText("Payment Successful")).toBeInTheDocument();
});

test("should not allow payment without booking pod", async () => {
  // Không có thông tin booking
  localStorage.removeItem("bookingData");

  render(<ConfirmBooking />);

  // Thử thanh toán khi chưa đặt chỗ
  expect(screen.getByText("Thanh toán")).toBeInTheDocument(); // Use "Thanh toán" instead of "Pay Now"
  fireEvent.click(screen.getByText("Thanh toán")); // Use "Thanh toán" instead of "Pay Now"

  // Kiểm tra thông báo lỗi
  expect(screen.getByText("Please book a pod first")).toBeInTheDocument();
});
