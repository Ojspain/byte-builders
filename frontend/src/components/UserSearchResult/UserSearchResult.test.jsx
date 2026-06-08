import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserSearchResult from "./UserSearchResult";

describe("UserSearchResult Component", () => {
  it("returns null and renders nothing when userData is not provided", () => {
    const { container } = render(
      <BrowserRouter>
        <UserSearchResult userData={null} />
      </BrowserRouter>,
    );

    // The component should return null, leaving the DOM empty
    expect(container).toBeEmptyDOMElement();
  });

  it("renders user information correctly when full data is provided", () => {
    const mockUserData = {
      username: "Entomology_Enthusiast",
      profilePicUrl: "https://example.com/pfp.jpg",
      bio: "Just a bug lover!",
    };

    render(
      <BrowserRouter>
        <UserSearchResult userData={mockUserData} />
      </BrowserRouter>,
    );

    // Verify text content
    expect(screen.getByText("Entomology_Enthusiast")).toBeInTheDocument();
    expect(screen.getByText("Just a bug lover!")).toBeInTheDocument();

    // Verify the avatar image is rendering the correct custom URL
    const avatar = screen.getByAltText("Entomology_Enthusiast's avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "https://example.com/pfp.jpg");

    // Verify the Link wraps the component and points to the correct route
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/profile/Entomology_Enthusiast");
  });

  it("renders default fallback values when profilePicUrl and bio are missing", () => {
    const mockUserData = {
      username: "Mystery_User",
      // Purposely leaving bio and profilePicUrl undefined
    };

    render(
      <BrowserRouter>
        <UserSearchResult userData={mockUserData} />
      </BrowserRouter>,
    );

    // Verify the username renders, along with the fallback bio text
    expect(screen.getByText("Mystery_User")).toBeInTheDocument();
    expect(screen.getByText("No bio available")).toBeInTheDocument();

    // Verify the avatar still renders (it will use the imported defaultPfp string)
    const avatar = screen.getByAltText("Mystery_User's avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar.getAttribute("src")).toBeTruthy();
  });
});
