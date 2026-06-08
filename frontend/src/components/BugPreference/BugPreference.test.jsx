import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import BugPreference from "./BugPreference";
import { fetchApi } from "@/fetchApi";

// Mock the custom fetchApi utility
vi.mock("@/fetchApi", () => ({
  fetchApi: vi.fn(),
}));

// Mock AuthContext in case any upstream provider logic expects it
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { _id: "user_test", username: "test_user" },
  }),
}));

const mockProfileUser = {
  username: "Entomology_Enthusiast",
};

describe("BugPreference Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and correctly renders the user's liked and disliked bugs", async () => {
    // Simulate a successful API response with mock data
    fetchApi.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          likes: [
            { _id: "bug_1", speciesCommon: "Ladybug" },
            { _id: "bug_2", speciesCommon: "Bumblebee" },
          ],
          dislikes: [{ _id: "bug_3", speciesCommon: "Mosquito" }],
        },
      }),
    });

    render(
      <BrowserRouter>
        <BugPreference profileUser={mockProfileUser} />
      </BrowserRouter>,
    );

    // Verify initial loading state ("...") is displayed for both Likes and Dislikes
    const loadingElements = screen.getAllByText("...");
    expect(loadingElements).toHaveLength(2);

    // Wait for the asynchronous fetch to complete and UI to update
    await waitFor(() => {
      expect(screen.getByText(/Ladybug/)).toBeInTheDocument();
    });

    // Verify the rest of the mock data rendered correctly
    expect(screen.getByText(/Bumblebee/)).toBeInTheDocument();
    expect(screen.getByText(/Mosquito/)).toBeInTheDocument();

    // Verify the API was called with the correct target user's endpoint
    expect(fetchApi).toHaveBeenCalledWith(
      "/api/users/Entomology_Enthusiast/preferences",
    );
  });
});
