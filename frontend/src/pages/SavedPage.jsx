import { Link } from "react-router-dom";
import { fetchApi } from "@/fetchApi";
import { useState, useEffect } from "react";
import SmallPost from "../components/SmallPost/SmallPost";
import SortBy from "../components/SortBy/SortBy";
import { useAuth } from "../context/AuthContext";

function SavedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const options = {
    Saved: "saved",
    Liked: "liked",
    Sprayed: "sprayed",
  };

  const [sortBy, setSortBy] = useState("saved");
  const [speciesQuery, setSpeciesQuery] = useState("");
  const updateSortBy = (value) => {
    if (value === sortBy) {
      return;
    }
    setLoading(true);
    setSortBy(value);
  };
  const updateSpeciesQuery = (value) => {
    if (value === speciesQuery) {
      return;
    }
    setLoading(true);
    setSpeciesQuery(value);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    const token = localStorage.getItem("token");
    const params = new URLSearchParams();
    if (sortBy === "liked") params.set("reactionType", "like");
    if (sortBy === "sprayed") params.set("reactionType", "spray");
    if (speciesQuery.trim()) params.set("speciesQuery", speciesQuery.trim());

    const queryString = params.toString();
    const url = queryString
      ? `/api/posts/saved?${queryString}`
      : "/api/posts/saved";

    fetchApi(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to load saved posts:", err);
        setPosts([]);
      })
      .finally(() => setLoading(false));
  }, [user, sortBy, speciesQuery]);

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center mt-20 gap-4">
        <p className="text-zinc-600 text-lg">Log in to see your saved posts.</p>
        <Link to="/login" className="text-emerald-700 font-semibold underline">
          Log in
        </Link>
      </div>
    );

  return (
    <>
      <SortBy
        options={options}
        sortBy={sortBy}
        setSortBy={updateSortBy}
        speciesQuery={speciesQuery}
        setSpeciesQuery={updateSpeciesQuery}
      />

      {loading ? (
        <p className="text-center text-zinc-500 mt-10">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-zinc-500 mt-10">No saved posts yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <SmallPost key={post._id} post={post} hasAuthor={true} />
          ))}
        </div>
      )}
    </>
  );
}

export default SavedPage;
