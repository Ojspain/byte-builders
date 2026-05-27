import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import SmallPost from "../components/SmallPost/SmallPost";
import SortBy from "../components/SortBy/SortBy";
import { useAuth } from "../context/AuthContext";

function SavedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const options = {
    Liked: "liked",
    Sprayed: "sprayed",
  };

  const [sortBy, setSortBy] = useState("");
  const [speciesQuery, setSpeciesQuery] = useState("");

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Failed to load posts:", err))
      .finally(() => setLoading(false));
  }, []);

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
        setSortBy={setSortBy}
        speciesQuery={speciesQuery}
        setSpeciesQuery={setSpeciesQuery}
      />

      {loading ? (
        <p className="text-center text-zinc-500 mt-10">Loading...</p>
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
