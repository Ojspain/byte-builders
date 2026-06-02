import { render, screen, fireEvent } from "@testing-library/react";
import Tags from "./Tags";

describe("Tags Component", () => {
  const mockTags = ["Joke", "Scared me!", "Landed on me", "Pesky", "cool"];
  const mockLocation = "Garden";

  beforeEach(() => {
    // Mock the window width to be a desktop screen
    global.innerWidth = 1024;
    global.dispatchEvent(new Event("resize"));
  });

  it("renders the location and truncated tags by default", () => {
    // Because the width is > 768, the component should slice the array to show 4 tags
    render(<Tags location={mockLocation} tags={mockTags} />);

    expect(screen.getByText("Garden")).toBeInTheDocument();
    expect(screen.getByText("Joke")).toBeInTheDocument();
    expect(screen.getByText("Scared me!")).toBeInTheDocument();
    expect(screen.getByText("Landed on me")).toBeInTheDocument();
    expect(screen.getByText("Pesky")).toBeInTheDocument();

    // The 5th tag ("cool") should not be in the document yet
    expect(screen.queryByText("cool")).toBeNull();
  });

  it("expands to show all tags when the expand button is clicked", () => {
    render(<Tags location={mockLocation} tags={mockTags} />);

    // The expand button only renders if tagCnt > shown
    const expandBtn = screen.getByRole("button");
    fireEvent.click(expandBtn);

    expect(screen.getByText("cool")).toBeInTheDocument();
  });
});
