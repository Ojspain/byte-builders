import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import SideBar from "./SideBar";
import { useAuth } from "../../context/AuthContext";

// Mock SVGs and sub-components
vi.mock("../../assets/bell.svg", () => ({ default: "bell.svg" }));
vi.mock("../../assets/settings.svg", () => ({ default: "settings.svg" }));
vi.mock("../../assets/bugLogo.svg", () => ({ default: "bugLogo.svg" }));
vi.mock("../../assets/cup.svg", () => ({ default: "cup.svg" }));
vi.mock("../../assets/ham.svg", () => ({ default: "ham.svg" }));

vi.mock("./NavItem", () => ({
  default: ({ text }) => <div data-testid="nav-item">{text}</div>,
}));
vi.mock("../NotificationItem/NotificationItem", () => ({
  default: () => <div data-testid="notification-item">Notif</div>,
}));

// Mock Auth Context
vi.mock("../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn() },
}));

const mockLogout = vi.fn();

describe("SideBar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      }),
    );
  });

  it("renders Log In and Sign Up buttons when user is NOT authenticated", async () => {
    useAuth.mockReturnValue({ user: null, logout: mockLogout });

    await act(async () => {
      render(
        <BrowserRouter>
          <SideBar />
        </BrowserRouter>,
      );
    });

    expect(screen.getByText("Log In")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.queryByText("Log Out")).toBeNull();
  });

  it("renders Log Out button and Notification Bell when user IS authenticated", async () => {
    useAuth.mockReturnValue({
      user: { username: "testuser" },
      logout: mockLogout,
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <SideBar />
        </BrowserRouter>,
      );
    });

    expect(screen.getByText("Log Out")).toBeInTheDocument();
    expect(screen.getByAltText("Notifications")).toBeInTheDocument();
    expect(screen.queryByText("Log In")).toBeNull();
  });

  it("calls logout function when Log Out is clicked", async () => {
    useAuth.mockReturnValue({
      user: { username: "testuser" },
      logout: mockLogout,
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <SideBar />
        </BrowserRouter>,
      );
    });

    const logoutBtn = screen.getByText("Log Out");

    await act(async () => {
      fireEvent.click(logoutBtn);
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("fetches and displays notification unread count on mount", async () => {
    useAuth.mockReturnValue({
      user: { username: "testuser" },
      logout: mockLogout,
    });

    // Mock the fetch to return 2 unread notifications
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { _id: "1", read: false },
            { _id: "2", read: false },
            { _id: "3", read: true },
          ]),
      }),
    );

    await act(async () => {
      render(
        <BrowserRouter>
          <SideBar />
        </BrowserRouter>,
      );
    });

    await waitFor(() => {
      // The badge should display '2'
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  it("toggles the notification sidebar when the bell is clicked", async () => {
    useAuth.mockReturnValue({
      user: { username: "testuser" },
      logout: mockLogout,
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <SideBar />
        </BrowserRouter>,
      );
    });

    // Sidebar should initially be hidden (by translating off-screen)
    const notifSidebar = screen.getByText("Notifications").closest("div.fixed");
    expect(notifSidebar).toHaveClass("translate-x-full");

    // Click the bell
    const bellIcon = screen.getByAltText("Notifications");

    await act(async () => {
      fireEvent.click(bellIcon);
    });

    // Sidebar should slide in
    expect(notifSidebar).toHaveClass("translate-x-0");
  });
});
