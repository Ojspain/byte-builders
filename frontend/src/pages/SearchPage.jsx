import { useState, useEffect, useRef } from "react";
import SpeciesSearchResult from "../components/SpeciesSearchResult/SpeciesSearchResult";
import UserSearchResult from "../components/UserSearchResult/UserSearchResult";

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState("species");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    setResults([]);
  }, [searchMode]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const endpoint =
        searchMode === "species"
          ? `/api/species?search=${encodeURIComponent(q)}`
          : `/api/users/search?search=${encodeURIComponent(q)}`;

      fetch(endpoint)
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, searchMode]);

  return (
    <>
      <div className="flex flex-col max-w-[600px] mx-auto border-b border-zinc-800/50 mb-10 pb-5">
        <div className="flex gap-5 items-center mb-4">
          <p className="font-semibold tracking-wide">Search</p>
          <input
            type="text"
            placeholder={`Search ${searchMode}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg bg-zinc-50 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Radio Button Toggle */}
        <div className="flex gap-6 ml-[72px]">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-700">
            <input
              type="radio"
              name="searchMode"
              value="species"
              checked={searchMode === "species"}
              onChange={(e) => setSearchMode(e.target.value)}
              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
            />
            Species
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-zinc-700">
            <input
              type="radio"
              name="searchMode"
              value="users"
              checked={searchMode === "users"}
              onChange={(e) => setSearchMode(e.target.value)}
              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
            />
            Users
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {loading && <p className="text-center text-zinc-500">Searching...</p>}

        {!loading && searchQuery.trim() && results.length === 0 && (
          <p className="text-center text-zinc-500">
            No {searchMode} found for "{searchQuery}".
          </p>
        )}

        {/* Render based on search mode */}
        {results.map((item) =>
          searchMode === "species" ? (
            <SpeciesSearchResult key={item._id} speciesData={item} />
          ) : (
            <UserSearchResult key={item._id} userData={item} />
          ),
        )}
      </div>
    </>
  );
}

export default SearchPage;
