import { render, screen, fireEvent } from "@testing-library/react";
import SortBy from "./SortBy";

describe("SortBy Component", () => {
  const mockOptions = {
    Newest: "date_desc",
    Oldest: "date_asc",
    "Highest Rated": "rating_desc",
  };

  const mockSetSortBy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all provided sort options", () => {
    render(
      <SortBy
        options={mockOptions}
        sortBy="date_desc"
        setSortBy={mockSetSortBy}
      />,
    );

    // Verify all keys from the options object are rendered as text
    expect(screen.getByText("Newest")).toBeInTheDocument();
    expect(screen.getByText("Oldest")).toBeInTheDocument();
    expect(screen.getByText("Highest Rated")).toBeInTheDocument();

    // Verify we have 4 list items (3 options + 1 reset button)
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(4);
  });

  it("applies the 'activeSort' class to the currently selected option", () => {
    render(
      <SortBy
        options={mockOptions}
        sortBy="date_asc" // "Oldest" is the active sort
        setSortBy={mockSetSortBy}
      />,
    );

    const activeItem = screen.getByText("Oldest");
    const inactiveItem = screen.getByText("Newest");

    // Check that the class is applied accurately based on the sortBy prop
    expect(activeItem).toHaveClass("activeSort");
    expect(inactiveItem).not.toHaveClass("activeSort");
  });

  it("calls setSortBy with the mapped value when an option is clicked", () => {
    render(
      <SortBy
        options={mockOptions}
        sortBy="date_desc"
        setSortBy={mockSetSortBy}
      />,
    );

    const highestRatedOption = screen.getByText("Highest Rated");
    fireEvent.click(highestRatedOption);

    // It should pass the value ("rating_desc") rather than the key ("Highest Rated")
    expect(mockSetSortBy).toHaveBeenCalledWith("rating_desc");
    expect(mockSetSortBy).toHaveBeenCalledTimes(1);
  });

  it("calls setSortBy with 'reset' when the reset icon is clicked", () => {
    const { container } = render(
      <SortBy
        options={mockOptions}
        sortBy="date_desc"
        setSortBy={mockSetSortBy}
      />,
    );

    // Since the reset item has no text, we can target it by its unique class
    const resetItem = container.querySelector(".reset");
    fireEvent.click(resetItem);

    expect(mockSetSortBy).toHaveBeenCalledWith("reset");
    expect(mockSetSortBy).toHaveBeenCalledTimes(1);
  });
});
