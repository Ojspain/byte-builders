import { useState } from "react";
import SortBy from "../components/SortBy/SortBy";
import SpeciesSearchResult from "../components/SpeciesSearchResult/SpeciesSearchResult";

function SearchPage() {
    const options = {
        "Most Liked": "most_liked",
        "Most Sprayed": "most_sprayed",
        "Posted Today": "posted_today"
    };
    const [sortBy, setSortBy] = useState("");
    const [speciesQuery, setSpeciesQuery] = useState("");

    return (
        <>
            <SortBy options={options} sortBy={sortBy} setSortBy={setSortBy} speciesQuery={speciesQuery} setSpeciesQuery={setSpeciesQuery} />
            <SpeciesSearchResult species={speciesQuery} />
        </>
    )
}

export default SearchPage
