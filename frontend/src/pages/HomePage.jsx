import { useState, useEffect } from "react";
import Post from "../components/Post/Post";
import SortBy from "../components/SortBy/SortBy";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");

  const options = {
    "Most Liked": "most_liked",
    "Most Sprayed": "most_sprayed",
    "Recently Posted": "recent",
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts((previous) =>
      previous.filter((post) => post._id !== deletedPostId),
    );
  };

  useEffect(() => {
    fetch(`/api/posts?sort=${sortBy}`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Failed to load posts:", err))
      .finally(() => setLoading(false));
  }, [sortBy]);

  if (loading)
    return <p className="text-center text-zinc-500 mt-20">Loading posts...</p>;

  return (
    <>
      <div className="mb-10">
        {/* Pass down the sorting props. Omit the speciesQuery props if your SortBy component allows it */}
        <SortBy options={options} sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      {!posts.length && !loading ? (
        <p className="text-center text-zinc-500 mt-20">
          No posts yet. Be the first!
        </p>
      ) : (
        <div className="flex flex-col gap-20 items-center">
          {posts.map((p) => (
            <Post
              key={p._id}
              _id={p._id}
              authorId={p.authorId}
              authorName={p.authorName}
              authorProfilePicUrl={p.authorProfilePicUrl}
              imageUrl={p.imageUrl}
              speciesCommon={p.speciesCommon}
              speciesActual={p.speciesActual}
              textContent={p.textContent}
              location={p.location}
              tags={p.tags}
              rating={p.rating}
              heart={p.heart}
              createdAt={p.createdAt}
              likeCount={p.likeCount}
              sprayCount={p.sprayCount}
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default HomePage;
