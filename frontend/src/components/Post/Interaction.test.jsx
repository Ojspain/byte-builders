import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Interaction from "./Interaction";

global.fetch = vi.fn();

describe("Interaction Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Mock the initial mount fetch that checks if the user already reacted
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: { myReaction: null } }),
    });
  });

  it("shows an error if a logged-out user tries to react", async () => {
    render(
      <Interaction
        targetType="post"
        targetId="post_123"
        likeCount={5}
        sprayCount={2}
      />,
    );

    // The component renders two buttons: Like and Spray
    const likeButton = screen.getAllByRole("button")[0];
    fireEvent.click(likeButton);

    expect(await screen.findByText("Log in to react.")).toBeInTheDocument();
  });

  it("updates the like count immediatly when clicked before api response", async () => {
    localStorage.setItem("token", "fake-jwt-token");

    // First response is for the mount, second is for the PUT request
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { myReaction: null } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: { myReaction: "like", likeCount: 6, sprayCount: 2 },
        }),
      });

    render(
      <Interaction
        targetType="post"
        targetId="post_123"
        likeCount={5}
        sprayCount={2}
      />,
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const likeButton = screen.getAllByRole("button")[0];
    fireEvent.click(likeButton);

    expect(screen.getByText("6")).toBeInTheDocument();

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  });
});
