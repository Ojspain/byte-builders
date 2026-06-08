import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SpeciesSearchResult from "./SpeciesSearchResult";

// Mock the SVG asset to avoid import issues in the test environment
vi.mock("../../assets/arrowRight.svg", () => ({ default: "mock-arrow-right" }));

describe("SpeciesSearchResult Component", () => {
  it("returns null and renders nothing when speciesData is not provided", () => {
    const { container } = render(
      <BrowserRouter>
        <SpeciesSearchResult speciesData={null} />
      </BrowserRouter>,
    );

    // The component should return null if the prop is missing
    expect(container).toBeEmptyDOMElement();
  });

  it("renders species information and correctly formats the link", () => {
    const mockSpeciesData = {
      speciesActual: "Coccinellidae",
      speciesCommon: "Ladybug",
      imageUrl: "https://example.com/ladybug.jpg",
    };

    render(
      <BrowserRouter>
        <SpeciesSearchResult speciesData={mockSpeciesData} />
      </BrowserRouter>,
    );

    // Verify text content renders correctly
    expect(screen.getByText("Ladybug")).toBeInTheDocument();
    expect(screen.getByText("(Coccinellidae)")).toBeInTheDocument();

    // Verify the Link wraps the component and points to the correct route
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/species/Coccinellidae");

    // Verify the images render with the correct sources
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2); // The species image and the arrow icon

    // The first image is the species photo
    expect(images[0]).toHaveAttribute("src", "https://example.com/ladybug.jpg");

    // The second image is the arrow right icon
    expect(images[1]).toHaveAttribute("alt", "-->");
    expect(images[1]).toHaveAttribute("src", "mock-arrow-right");
  });
});
