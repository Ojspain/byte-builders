import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SmallPost from "./SmallPost";

// Mock child components and SVGs
vi.mock("../StarRating/StarRating", () => ({
  default: ({ rating }) => (
    <div data-testid="star-rating">Rating: {rating}</div>
  ),
}));

vi.mock("../Post/Interaction", () => ({
  default: () => <div data-testid="interaction">Interaction Stats</div>,
}));

vi.mock("../../assets/diagonalArrow.svg", () => ({ default: "arrow.svg" }));
vi.mock("../../assets/superHeart.svg", () => ({ default: "heart.svg" }));

const mockPost = {
  _id: "post_123",
  imageUrl: "http://example.com/bug.jpg",
  speciesCommon: "Ladybug",
  speciesActual: "Coccinellidae",
  authorName: "Ladybug_larry",
  textContent: "10,000 more on the way!",
  rating: 5,
  heart: true,
  tags: ["Pretty", "Landed on me", "Flying"],
  likeCount: 12,
  sprayCount: 2,
};

describe("SmallPost Component", () => {
  it("renders post details accurately", () => {
    render(
      <BrowserRouter>
        <SmallPost post={mockPost} hasAuthor={false} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Ladybug")).toBeInTheDocument();
    expect(screen.getByText("(Coccinellidae)")).toBeInTheDocument();
    expect(screen.getByText("10,000 more on the way!")).toBeInTheDocument();

    const image = screen.getByAltText("Ladybug");
    expect(image).toHaveAttribute("src", "http://example.com/bug.jpg");
  });

  it("renders the author badge and link when hasAuthor is true", () => {
    render(
      <BrowserRouter>
        <SmallPost post={mockPost} hasAuthor={true} />
      </BrowserRouter>,
    );

    const authorLink = screen.getByText("Ladybug_larry");
    expect(authorLink).toBeInTheDocument();
    expect(authorLink).toHaveAttribute("href", "/profile/Ladybug_larry");
  });

  it("does not render the author badge when hasAuthor is false", () => {
    render(
      <BrowserRouter>
        <SmallPost post={mockPost} hasAuthor={false} />
      </BrowserRouter>,
    );

    expect(screen.queryByText("Ladybug_larry")).toBeNull();
  });

  it("renders up to two tags and a 'more' counter if needed", () => {
    render(
      <BrowserRouter>
        <SmallPost post={mockPost} hasAuthor={false} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Pretty")).toBeInTheDocument();
    expect(screen.getByText("Landed on me")).toBeInTheDocument();
    expect(screen.getByText("+1 more")).toBeInTheDocument();
    expect(screen.queryByText("Flying")).toBeNull();
  });

  it("shows the Delete button when canDelete is true and fires onDelete on click", () => {
    const mockOnDelete = vi.fn();

    render(
      <BrowserRouter>
        <SmallPost
          post={mockPost}
          hasAuthor={false}
          canDelete={true}
          onDelete={mockOnDelete}
        />
      </BrowserRouter>,
    );

    const deleteBtn = screen.getByRole("button", { name: "Delete" });
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith("post_123");
  });

  it("hides the Delete button when canDelete is false", () => {
    render(
      <BrowserRouter>
        <SmallPost post={mockPost} hasAuthor={false} canDelete={false} />
      </BrowserRouter>,
    );

    expect(screen.queryByRole("button", { name: "Delete" })).toBeNull();
  });
});
