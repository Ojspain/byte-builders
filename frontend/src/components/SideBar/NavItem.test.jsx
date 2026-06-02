import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NavItem from "./NavItem";

describe("NavItem Component", () => {
  it("renders the navigation text and SVG correctly", () => {
    const mockSvg = <svg data-testid="mock-svg"></svg>;

    render(
      <BrowserRouter>
        <NavItem text="Dashboard" route="/dashboard" svg={mockSvg} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("mock-svg")).toBeInTheDocument();
  });

  it("contains a link pointing to the correct route", () => {
    render(
      <BrowserRouter>
        <NavItem text="Profile" route="/user-profile" svg={<svg />} />
      </BrowserRouter>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/user-profile");
  });
});
