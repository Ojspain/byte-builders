import { useState, useEffect, useRef } from "react";
import SortBy from "../components/SortBy/SortBy";
import SpeciesSearchResult from "../components/SpeciesSearchResult/SpeciesSearchResult";

function SearchPage() {
    const options = {
        "Most Liked": "most_liked",
        "Most Sprayed": "most_sprayed",
        "Recently Posted": "recent"
    };
    const [sortBy, setSortBy] = useState("");
    const [speciesQuery, setSpeciesQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef(null);

    useEffect(() => {
        const q = speciesQuery.trim();
        if (!q) {
            setResults([]);
            return;
        }

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setLoading(true);
            fetch(`/api/species?search=${encodeURIComponent(q)}`)
                .then((res) => res.json())
                .then((data) => setResults(data))
                .catch(() => setResults([]))
                .finally(() => setLoading(false));
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [speciesQuery]);

    return (
        <>
            <SortBy options={options} sortBy={sortBy} setSortBy={setSortBy} speciesQuery={speciesQuery} setSpeciesQuery={setSpeciesQuery} />

            <div className="flex flex-col gap-3 mt-4">
                {loading && <p className="text-center text-zinc-500">Searching...</p>}
                {!loading && speciesQuery.trim() && results.length === 0 && (
                    <p className="text-center text-zinc-500">No species found for "{speciesQuery}".</p>
                )}
                {results.map((s) => (
                    <SpeciesSearchResult key={s._id} speciesData={s} />
                ))}
            </div>
        </>
    );
}

export default SearchPage;
