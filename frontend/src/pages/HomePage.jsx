import { useState, useEffect } from "react";
import Post from "../components/Post/Post";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/post")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Failed to load posts:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-zinc-500 mt-20">Loading posts...</p>;
  if (!posts.length) return <p className="text-center text-zinc-500 mt-20">No posts yet. Be the first!</p>;

  return (
    <>
      <div className="flex flex-col gap-20 items-center">
        {posts.map((p) => (
          <Post
            key={p._id}
            _id={p._id}
            authorName={p.authorName}
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
          />
        ))}
      </div>
    </>
  );
}

export default HomePage;
