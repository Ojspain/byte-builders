import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Post from "./Post";

// Mock the AuthContext to simulate a logged-in user
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { _id: "user_Ladybug_Larry", username: "Ladybug_Larry" },
  }),
}));

global.fetch = vi.fn();

const mockPostProps = {
  _id: "post_001",
  authorId: "user_Ladybug_Larry",
  authorName: "Ladybug_Larry",
  imageUrl: "ladybug.jpg",
  speciesCommon: "Ladybug",
  speciesActual: "Coccinellidae",
  textContent: "Always love finding them in my garden <3",
  location: "Garden",
  tags: ["Landed on me", "Pretty"],
  rating: 5,
  heart: true,
  createdAt: "2026-06-01T12:00:00Z",
  likeCount: 10,
  sprayCount: 1,
  onPostDeleted: vi.fn(),
};

describe("Post Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // On mount, Post fetches comments from /api/posts/${_id}/comments
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  it("renders post details correctly", async () => {
    render(
      <BrowserRouter>
        <Post {...mockPostProps} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Ladybug")).toBeInTheDocument();
    expect(screen.getByText("Coccinellidae")).toBeInTheDocument();
    expect(
      screen.getByText("Always love finding them in my garden <3"),
    ).toBeInTheDocument();

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  });

  it("shows the delete button only for the post owner", async () => {
    render(
      <BrowserRouter>
        <Post {...mockPostProps} />
      </BrowserRouter>,
    );

    const deleteBtn = screen.getByRole("button", { name: "Delete post" });
    expect(deleteBtn).toBeInTheDocument();

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  });
});
