import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Bookings from "../pages/booking";

test("should allow booking pod after login", async () => {
  // Giả lập đã đăng nhập thành công
  localStorage.setItem("accessToken", "validToken123");

  render(<Bookings />);

  // Kiểm tra xem người dùng có thể chọn pod
  const podButton = screen.getByText("Book Pod");
  fireEvent.click(podButton);

  // Kiểm tra xem booking có thành công
  expect(screen.getByText("Booking Successful")).toBeInTheDocument();
});

test("should not allow booking pod without login", async () => {
  // Giả lập chưa đăng nhập
  localStorage.removeItem("accessToken");

  render(<Bookings />);

  // Thử booking khi chưa đăng nhập
  const podButton = screen.getByText("Book Pod");
  fireEvent.click(podButton);

  // Kiểm tra xem có hiện thông báo yêu cầu đăng nhập không
  expect(screen.getByText("Please login to book pod")).toBeInTheDocument();
});
