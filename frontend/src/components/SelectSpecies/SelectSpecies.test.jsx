import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SelectSpecies from "./SelectSpecies";
import { fetchApi } from "@/fetchApi";

// Mock the custom fetchApi utility
vi.mock("@/fetchApi", () => ({
  fetchApi: vi.fn(),
}));

describe("SelectSpecies Component", () => {
  const mockSetSpeciesQuery = vi.fn();
  const mockSetSelectedSpecies = vi.fn();
  const mockSetReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the label and required indicator conditionally", () => {
    render(
      <SelectSpecies
        isLabeled={true}
        isRequired={true}
        speciesQuery=""
        setSpeciesQuery={mockSetSpeciesQuery}
      />,
    );

    expect(screen.getByText(/Species/i)).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("fetches species suggestions after the debounce period", async () => {
    fetchApi.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          _id: "1",
          speciesActual: "Apis mellifera",
          speciesCommon: "Honey Bee",
        },
      ],
    });

    render(
      <SelectSpecies
        speciesQuery="Apis"
        setSpeciesQuery={mockSetSpeciesQuery}
      />,
    );

    // waitFor naturally waits up to 1000ms for the assertion to pass,
    // comfortably clearing the 300ms debounce without freezing the test.
    await waitFor(() => {
      expect(fetchApi).toHaveBeenCalledWith("/api/species?search=Apis");
    });

    expect(fetchApi).toHaveBeenCalledTimes(1);
  });

  it("calls setSpeciesQuery on input change and matches species from candidates", async () => {
    const mockCandidates = [
      {
        _id: "2",
        speciesActual: "Danaus plexippus",
        speciesCommon: "Monarch Butterfly",
      },
    ];

    fetchApi.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCandidates,
    });

    render(
      <SelectSpecies
        speciesQuery="Danaus"
        setSpeciesQuery={mockSetSpeciesQuery}
        setSelectedSpecies={mockSetSelectedSpecies}
      />,
    );

    // Wait for the real-time debounced fetch to complete and populate candidates
    await waitFor(() => {
      expect(fetchApi).toHaveBeenCalled();
    });

    const input = screen.getByPlaceholderText("Drosophila melanogaster");

    // Simulate the user selecting the option from the datalist format "Actual (Common)"
    fireEvent.change(input, {
      target: { value: "Danaus plexippus (Monarch Butterfly)" },
    });

    // It should immediately update the text query prop
    expect(mockSetSpeciesQuery).toHaveBeenCalledWith(
      "Danaus plexippus (Monarch Butterfly)",
    );

    // It should extract the actual name and set the matched species object
    expect(mockSetSelectedSpecies).toHaveBeenCalledWith(mockCandidates[0]);
  });

  it("clears the input state and calls setReset when the reset prop is triggered", () => {
    render(
      <SelectSpecies
        speciesQuery="Some Bug"
        setSpeciesQuery={mockSetSpeciesQuery}
        reset={true}
        setReset={mockSetReset}
      />,
    );

    // The useEffect listening for `reset` should fire immediately
    expect(mockSetSpeciesQuery).toHaveBeenCalledWith("");
    expect(mockSetReset).toHaveBeenCalledWith(false);
  });
});
