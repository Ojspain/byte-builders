import { render } from "@testing-library/react";
import StarRating from "./StarRating";

// Mock SVG assets
vi.mock("../../assets/filledStar.svg", () => ({ default: "mock-filled-star" }));
vi.mock("../../assets/hollowStar.svg", () => ({ default: "mock-hollow-star" }));

describe("StarRating Component", () => {
  it("renders the correct number of filled and hollow stars for a standard rating", () => {
    const { container } = render(<StarRating rating={3} />);

    // The component should always render exactly 5 images
    const stars = container.querySelectorAll("img");
    expect(stars).toHaveLength(5);

    // Filter using our mocked strings
    const filledStars = Array.from(stars).filter((img) =>
      img.src.includes("mock-filled-star"),
    );
    const hollowStars = Array.from(stars).filter((img) =>
      img.src.includes("mock-hollow-star"),
    );

    expect(filledStars).toHaveLength(3);
    expect(hollowStars).toHaveLength(2);
  });

  it("handles a 0 star rating correctly", () => {
    const { container } = render(<StarRating rating={0} />);
    const stars = container.querySelectorAll("img");

    const filledStars = Array.from(stars).filter((img) =>
      img.src.includes("mock-filled-star"),
    );
    const hollowStars = Array.from(stars).filter((img) =>
      img.src.includes("mock-hollow-star"),
    );

    expect(filledStars).toHaveLength(0);
    expect(hollowStars).toHaveLength(5);
  });

  it("handles a 5 star rating correctly", () => {
    const { container } = render(<StarRating rating={5} />);
    const stars = container.querySelectorAll("img");

    const filledStars = Array.from(stars).filter((img) =>
      img.src.includes("mock-filled-star"),
    );
    const hollowStars = Array.from(stars).filter((img) =>
      img.src.includes("mock-hollow-star"),
    );

    expect(filledStars).toHaveLength(5);
    expect(hollowStars).toHaveLength(0);
  });
});
