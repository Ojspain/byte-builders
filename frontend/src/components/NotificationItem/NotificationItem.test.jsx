import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NotificationItem from "./NotificationItem";

// Mock the SVG import to prevent test runner errors
vi.mock("../../assets/bugLogo.svg", () => ({
  default: "mocked-bug-logo.svg",
}));

const mockCloseMenu = vi.fn();
const mockOnMarkAsRead = vi.fn();

const baseNotification = {
  _id: "notif_123",
  actorId: {
    username: "beetle_fanatic",
    profilePicUrl: "http://example.com/pic.jpg",
  },
  type: "comment",
  read: false,
  postId: "post_456",
  commentId: {
    commentText: "What a fascinating species!",
  },
};

describe("NotificationItem Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the actor username, comment text, and profile picture", () => {
    render(
      <BrowserRouter>
        <NotificationItem
          notification={baseNotification}
          closeMenu={mockCloseMenu}
          onMarkAsRead={mockOnMarkAsRead}
        />
      </BrowserRouter>,
    );

    expect(screen.getByText("beetle_fanatic")).toBeInTheDocument();
    expect(
      screen.getByText(/What a fascinating species!/i),
    ).toBeInTheDocument();

    const profileImage = screen.getByRole("img", { name: "beetle_fanatic" });
    expect(profileImage).toHaveAttribute("src", "http://example.com/pic.jpg");

    // Verify the link wraps the component and points to the right post
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/post/post_456");
  });

  it("truncates comment text that exceeds 30 characters", () => {
    const longNotification = {
      ...baseNotification,
      commentId: {
        commentText:
          "This comment is definitely way longer than thirty characters",
      },
    };

    render(
      <BrowserRouter>
        <NotificationItem
          notification={longNotification}
          closeMenu={mockCloseMenu}
          onMarkAsRead={mockOnMarkAsRead}
        />
      </BrowserRouter>,
    );

    // The first 30 characters: "This comment is definitely way" + "..."
    expect(
      screen.getByText(/This comment is definitely way\.\.\./i),
    ).toBeInTheDocument();
  });

  it("calls onMarkAsRead and closeMenu when an unread notification is clicked", () => {
    render(
      <BrowserRouter>
        <NotificationItem
          notification={{ ...baseNotification, read: false }}
          closeMenu={mockCloseMenu}
          onMarkAsRead={mockOnMarkAsRead}
        />
      </BrowserRouter>,
    );

    const link = screen.getByRole("link");
    fireEvent.click(link);

    expect(mockOnMarkAsRead).toHaveBeenCalledTimes(1);
    expect(mockOnMarkAsRead).toHaveBeenCalledWith("notif_123");
    expect(mockCloseMenu).toHaveBeenCalledTimes(1);
  });

  it("only calls closeMenu when a read notification is clicked", () => {
    render(
      <BrowserRouter>
        <NotificationItem
          notification={{ ...baseNotification, read: true }}
          closeMenu={mockCloseMenu}
          onMarkAsRead={mockOnMarkAsRead}
        />
      </BrowserRouter>,
    );

    const link = screen.getByRole("link");
    fireEvent.click(link);

    expect(mockOnMarkAsRead).not.toHaveBeenCalled();
    expect(mockCloseMenu).toHaveBeenCalledTimes(1);
  });

  it("falls back to default 'System' username if actorId is missing", () => {
    const noActorNotification = { ...baseNotification, actorId: null };
    render(
      <BrowserRouter>
        <NotificationItem
          notification={noActorNotification}
          closeMenu={mockCloseMenu}
          onMarkAsRead={mockOnMarkAsRead}
        />
      </BrowserRouter>,
    );

    expect(screen.getByText("System")).toBeInTheDocument();
  });
});
