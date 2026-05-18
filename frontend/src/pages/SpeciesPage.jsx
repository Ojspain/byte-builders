import Post from "../components/Post/Post";
import { useParams } from "react-router-dom";
import { useState } from "react";
import dummy from "../dummy_db.json";

function SpeciesPage() {
  const { speciesId } = useParams();

  // State to track which feed is active: 'new' or 'top'
  const [activeTab, setActiveTab] = useState("new");

  const speciesData = dummy.species.find(
    (s) =>
      s.speciesCommon.toLowerCase() === speciesId?.toLowerCase() ||
      s.speciesActual.toLowerCase() === speciesId?.toLowerCase(),
  );

  // 1. Filter posts to only include ones about this specific species
  const speciesPosts = dummy.posts.filter(
    (p) =>
      p.speciesCommon.toLowerCase() ===
      speciesData?.speciesCommon.toLowerCase() ||
      p.speciesActual.toLowerCase() ===
      speciesData?.speciesActual.toLowerCase(),
  );

  // 2. Sort the filtered posts based on the active tab
  const sortedPosts = [...speciesPosts].sort((a, b) => {
    if (activeTab === "new") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.likeCount - a.likeCount;
    }
  });

  return (
    <>
      <div className="flex justify-center pb-20">
        {!speciesData ? (
          <div className="text-center mt-20">
            <h1 className="text-3xl font-bold text-zinc-400">
              Species "{speciesId}" not found.
            </h1>
            <p className="text-zinc-500 mt-2">
              Try searching for a different bug.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10 w-full max-w-5xl">
            {/* Top Half: Species Image and Info */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col xl:flex-row">
              <div className="xl:w-[45%] relative">
                <img
                  src={speciesData.imageUrl}
                  alt={speciesData.speciesCommon}
                  className="h-72 xl:h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent xl:hidden"></div>
                <h1 className="absolute bottom-4 left-6 text-white text-4xl font-extrabold xl:hidden tracking-wide drop-shadow-md">
                  {speciesData.speciesCommon}
                </h1>
              </div>

              <div className="p-8 xl:p-12 flex flex-col justify-center w-full xl:w-[55%]">
                <div className="hidden xl:block mb-3">
                  <h1 className="text-5xl font-extrabold text-zinc-900 tracking-tight">
                    {speciesData.speciesCommon}
                  </h1>
                </div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-widest border border-emerald-200">
                    {speciesData.speciesActual}
                  </span>
                </div>
                <div className="h-px w-16 bg-zinc-200 mb-6"></div>
                <p className="text-zinc-600 leading-relaxed text-lg font-medium">
                  {speciesData.description}
                </p>
              </div>
            </div>

            {/* Bottom Half: The Feeds */}
            <div className="mt-4 flex flex-col items-center">
              {/* Feed Controls (Tabs) */}
              <div className="w-full flex justify-between items-end border-b border-zinc-200 pb-4 mb-10">
                <h3 className="text-2xl font-bold text-zinc-900">Sightings</h3>

                <div className="flex gap-2 bg-zinc-100 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab("new")}
                    className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${activeTab === "new" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => setActiveTab("top")}
                    className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${activeTab === "top" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
                  >
                    Top
                  </button>
                </div>
              </div>

              {/* Render Sorted Posts */}
              <div className="flex flex-col gap-10 w-full items-center">
                {sortedPosts.length > 0 ? (
                  sortedPosts.map((p) => (
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
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-zinc-500 text-lg">
                      No bugs posted here yet! Be the first.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SpeciesPage;
