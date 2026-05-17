import Post from "../components/Post/Post";
import dummy from "../dummy_db.json";

function HomePage() {
  return (
    <>
      <div className="flex flex-col gap-20 items-center">
        {dummy.posts.map((p) => (
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
