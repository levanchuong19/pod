import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import Login from "../pages/login";
import "@testing-library/jest-dom";

describe("Login Component", () => {
  it("should render login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Add your assertions here
    expect(screen.getByText(/login/i)).toBeInTheDocument(); // Example assertion
  });
});
