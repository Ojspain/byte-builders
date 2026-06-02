import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Comment from "./Comment";

const mockAuthor = {
  username: "beetle_fanatic",
  profilePicUrl: "",
};

const mockCommentProps = {
  commentId: "comment_123",
  author: mockAuthor,
  commentText: "What a fascinating species!",
  createdAt: "2026-06-01T12:00:00Z",
  likeCount: 5,
  sprayCount: 0,
  isOwner: false,
  onUpdate: vi.fn(),
  onDelete: vi.fn(),
};

describe("Comment Component", () => {
  it("renders the author username and comment text", () => {
    render(
      <BrowserRouter>
        <Comment {...mockCommentProps} />
      </BrowserRouter>,
    );

    const commentText = screen.getByText(/What a fascinating species!/i);
    const usernameText = screen.getByText(/beetle_fanatic/i);

    expect(commentText).toBeInTheDocument();
    expect(usernameText).toBeInTheDocument();
  });
});

it("hides Edit and Delete buttons when the user is NOT the owner", () => {
  render(
    <BrowserRouter>
      <Comment {...mockCommentProps} isOwner={false} />
    </BrowserRouter>,
  );

  expect(screen.queryByText("Edit")).toBeNull();
  expect(screen.queryByText("Delete")).toBeNull();
});

it("shows Edit and Delete buttons when the user IS the owner", () => {
  render(
    <BrowserRouter>
      <Comment {...mockCommentProps} isOwner={true} />
    </BrowserRouter>,
  );

  expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
});

it("switches to edit mode when the Edit button is clicked", () => {
  render(
    <BrowserRouter>
      <Comment {...mockCommentProps} isOwner={true} />
    </BrowserRouter>,
  );

  // click edit button
  const editButton = screen.getByRole("button", { name: "Edit" });
  fireEvent.click(editButton);

  // check for save button and input field
  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  const inputField = screen.getByDisplayValue("What a fascinating species!");
  expect(inputField).toBeInTheDocument();
});
