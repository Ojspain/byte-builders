import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserListModal from "./UserListModal";
import { fetchApi } from "@/fetchApi";

// Mock the custom fetchApi utility
vi.mock("@/fetchApi", () => ({
  fetchApi: vi.fn(),
}));

describe("UserListModal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and displays the user list when opened", async () => {
    // Simulate a successful API response for a list of followers
    const mockUsersResponse = {
      data: {
        items: [
          {
            _id: "item_1",
            user: {
              username: "BugLover99",
              bio: "I love beetles",
              profilePicUrl: "",
            },
          },
          {
            _id: "item_2",
            user: {
              username: "MothMan",
              bio: "Night flyer",
              profilePicUrl: "",
            },
          },
        ],
      },
    };

    fetchApi.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsersResponse,
    });

    const mockOnClose = vi.fn();

    render(
      <BrowserRouter>
        <UserListModal
          isOpen={true}
          onClose={mockOnClose}
          username="Entomology_Enthusiast"
          type="followers"
        />
      </BrowserRouter>,
    );

    // Verify the loading state appears initially
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for the asynchronous fetch to complete and UI to update
    await waitFor(() => {
      expect(screen.getByText("BugLover99")).toBeInTheDocument();
    });

    // Verify the rest of the mock data rendered correctly
    expect(screen.getByText("I love beetles")).toBeInTheDocument();
    expect(screen.getByText("MothMan")).toBeInTheDocument();
    expect(screen.getByText("Night flyer")).toBeInTheDocument();

    // Verify the API was called with the correct target endpoint based on props
    expect(fetchApi).toHaveBeenCalledWith(
      "/api/users/Entomology_Enthusiast/followers",
    );
  });
});
