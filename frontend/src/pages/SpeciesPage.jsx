import SmallPost from "../components/SmallPost/SmallPost";
import { fetchApi } from "@/fetchApi";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function SpeciesPage() {
  const { speciesId } = useParams();
  const navigate = useNavigate();

  const selected = "!bg-[#6af39c]";

  const [activeTab, setActiveTab] = useState("new");
  const [speciesData, setSpeciesData] = useState(null);
  const [speciesPosts, setSpeciesPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const targetType = "speciesType";
  const [targetId, setTargetId] = useState("");

  const [myReaction, setMyReaction] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!speciesId) return;

    setLoading(true);
    fetchApi(`/api/species/name/${encodeURIComponent(speciesId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setSpeciesData(data);

        if (data) {
          // Fetch Posts based on speciesActual
          fetchApi(
            `/api/posts?speciesActual=${encodeURIComponent(data.speciesActual)}`,
          )
            .then((res) => (res ? res.json() : []))
            .then((posts) => setSpeciesPosts(posts || []))
            .catch((err) =>
              console.error("Failed to load species posts:", err),
            );

          // Set Target ID and fetch user's reaction
          const currentTargetId = encodeURIComponent(data._id);
          setTargetId(currentTargetId);

          const token = localStorage.getItem("token");
          if (token && targetType && currentTargetId) {
            console.log(
              `Sending to /api/reactions/${targetType}/${currentTargetId}/me`,
            );
            fetchApi(`/api/reactions/${targetType}/${currentTargetId}/me`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then(async (res) => {
                const reactionData = await res.json();
                if (!res.ok) {
                  throw new Error(
                    reactionData.message || "Failed to load reaction status.",
                  );
                }
                setMyReaction(reactionData?.data?.myReaction || null);
              })
              .catch(() => setMyReaction(null));
          } else {
            setMyReaction(null);
          }
        }
      })
      .catch((err) => console.error("Failed to load species:", err))
      .finally(() => setLoading(false));
  }, [speciesId]);

  const sortedPosts = [...speciesPosts].sort((a, b) => {
    if (activeTab === "new") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return b.likeCount - a.likeCount;
    }
  });

  if (loading)
    return <p className="text-center text-zinc-500 mt-20">Loading...</p>;

  const handleReaction = async (reactionType) => {
    if (!targetType || !targetId) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Log in to react.");
      return;
    }

    setError("");

    const isRemoving = myReaction === reactionType;

    try {
      console.log(`Sending to /api/reactions/${targetType}/${targetId}`);

      const response = await fetchApi(`/api/reactions/${targetType}/${targetId}`, {
        method: isRemoving ? "DELETE" : "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: isRemoving ? undefined : JSON.stringify({ reactionType }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update reaction.");
      }

      const payload = data?.data || {};
      setMyReaction(payload.myReaction ?? null);
    } catch (requestError) {
      setError(
        requestError.message || "Network error while updating reaction.",
      );
    }
  };

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
            <div className="bg-white rounded-3xl border border-zinc-200 xl:border-none xl:shadow-none shadow-sm overflow-hidden flex flex-col xl:flex-row">
              {/* Image */}
              <div className="xl:w-[45%] relative">
                <img
                  src={speciesData.imageUrl}
                  alt={speciesData.speciesCommon}
                  className="h-72 xl:h-full w-full object-cover xl:rounded-r-3xl"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent xl:hidden"></div>
                <h1 className="absolute bottom-4 left-6 text-white text-4xl font-extrabold xl:hidden tracking-wide drop-shadow-md">
                  {speciesData.speciesCommon}
                </h1>
              </div>

              <div className="p-8 xl:p-12 flex flex-col justify-center xl:justify-start w-full xl:w-[55%]">
                {/* Common Name */}
                <div className="hidden xl:block mb-3">
                  <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">
                    {speciesData.speciesCommon}
                  </h1>
                </div>
                {/* Actual Name */}
                <div className="mb-6 flex items-center gap-3">
                  <span className="px-3.5 py-1.5 bg-[#f9d7f9] text-[#5d0866] text-xs font-bold rounded-full uppercase tracking-widest border border-[#5d0866]">
                    {speciesData.speciesActual}
                  </span>
                </div>
                <section className="flex gap-2 mb-6">
                  {/* Like Button */}
                  <button
                    type="button"
                    onClick={() => handleReaction("like")}
                    className={`cursor-pointer flex w-30 shrink-0 items-center justify-center gap-2 rounded-full border border-[#b3b3b3] bg-[#edeeef] px-6 py-2.5 text-sm font-medium text-zinc-600transition hover:bg-[#e2e4e5] ${myReaction === "like" ? selected : ""}`}
                  >
                    Like
                    <span className="inline-flex h-3.5 w-3.5 items-center justify-center text-zinc-600">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.6667 13.3333H3.33333V4.66667L8 0L8.83333 0.833333C8.91111 0.911111 8.975 1.01667 9.025 1.15C9.075 1.28333 9.1 1.41111 9.1 1.53333V1.76667L8.36667 4.66667H12.6667C13.0222 4.66667 13.3333 4.8 13.6 5.06667C13.8667 5.33333 14 5.64444 14 6V7.33333C14 7.41111 13.9889 7.49444 13.9667 7.58333C13.9444 7.67222 13.9222 7.75556 13.9 7.83333L11.9 12.5333C11.8 12.7556 11.6333 12.9444 11.4 13.1C11.1667 13.2556 10.9222 13.3333 10.6667 13.3333ZM4.66667 12H10.6667L12.6667 7.33333V6H6.66667L7.56667 2.33333L4.66667 5.23333V12ZM4.66667 5.23333V6V7.33333V12V5.23333ZM3.33333 4.66667V6H1.33333V12H3.33333V13.3333H0V4.66667H3.33333Z"
                          fill="#191C1D"
                        />
                      </svg>
                    </span>
                  </button>

                  {/* Dislike Button */}
                  <button
                    type="button"
                    onClick={() => handleReaction("dislike")}
                    className={`cursor-pointer flex w-30 shrink-0 items-center justify-center gap-2 rounded-full border border-[#b3b3b3] bg-[#edeeef] px-6 py-2.5 text-sm font-medium text-zinc-600transition hover:bg-[#e2e4e5] ${myReaction === "dislike" ? selected : ""}`}
                  >
                    Dislike
                    <span className="inline-flex h-3.5 w-3.5 mt-1 items-center justify-center text-zinc-600">
                      <svg
                        width="14"
                        height="16"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.33333 0H10.6667V8.66667L6 13.3333L5.16667 12.5C5.08889 12.4222 5.025 12.3167 4.975 12.1833C4.925 12.05 4.9 11.9222 4.9 11.8V11.5667L5.63333 8.66667H1.33333C0.977778 8.66667 0.666667 8.53333 0.4 8.26667C0.133333 8 0 7.68889 0 7.33333V6C0 5.92222 0.0111111 5.83889 0.0333333 5.75C0.0555556 5.66111 0.0777778 5.57778 0.1 5.5L2.1 0.8C2.2 0.577778 2.36667 0.388889 2.6 0.233333C2.83333 0.0777778 3.07778 0 3.33333 0ZM9.33333 1.33333H3.33333L1.33333 6V7.33333H7.33333L6.43333 11L9.33333 8.1V1.33333ZM9.33333 8.1V7.33333V6V1.33333V8.1ZM10.6667 8.66667V7.33333H12.6667V1.33333H10.6667V0H14V8.66667H10.6667Z"
                          fill="#191C1D"
                        />
                      </svg>
                    </span>
                  </button>
                </section>

                {/* Divider */}
                <div className="h-px w-16 bg-zinc-200 mb-6"></div>

                {/* Description */}
                <div className="mb-12 xl:border xl:border-zinc-200 xl:rounded-lg xl:p-4 max-h-72 overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-300 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-400 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <p className="text-zinc-600 leading-relaxed text-md font-medium">
                    {speciesData.description || "---"}
                  </p>
                </div>

                {/* Log Observation Button */}
                <button
                  type="button"
                  onClick={() =>
                    navigate("/new-post", {
                      state: { prefilledSpecies: speciesData },
                    })
                  }
                  className="mt-auto flex items-center justify-center gap-2 rounded-full bg-[#006d37] font-medium px-6 py-3 sm:py-5 text-base text-white transition hover:bg-[#005a2e] tracking-wide cursor-pointer"
                >
                  <svg
                    width="16"
                    height="20"
                    viewBox="0 0 16 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 12H9V9H12V7H9V4H7V7H4V9H7V12ZM8 17.35C10.0333 15.4833 11.5417 13.7875 12.525 12.2625C13.5083 10.7375 14 9.38333 14 8.2C14 6.38333 13.4208 4.89583 12.2625 3.7375C11.1042 2.57917 9.68333 2 8 2C6.31667 2 4.89583 2.57917 3.7375 3.7375C2.57917 4.89583 2 6.38333 2 8.2C2 9.38333 2.49167 10.7375 3.475 12.2625C4.45833 13.7875 5.96667 15.4833 8 17.35ZM8 20C5.31667 17.7167 3.3125 15.5958 1.9875 13.6375C0.6625 11.6792 0 9.86667 0 8.2C0 5.7 0.804167 3.70833 2.4125 2.225C4.02083 0.741667 5.88333 0 8 0C10.1167 0 11.9792 0.741667 13.5875 2.225C15.1958 3.70833 16 5.7 16 8.2C16 9.86667 15.3375 11.6792 14.0125 13.6375C12.6875 15.5958 10.6833 17.7167 8 20Z"
                      fill="white"
                    />
                  </svg>
                  Log Observation
                </button>
              </div>
            </div>

            {/* Bottom Half: The Feeds */}
            <div className="mt-4 flex flex-col items-center">
              {/* Feed Controls (Tabs) */}
              <div className="w-full flex justify-between items-end border-b border-zinc-200 pb-4 mb-10">
                <h3 className="text-2xl font-bold text-zinc-900">Sightings</h3>

                <div className="flex gap-2 bg-zinc-100 p-1 rounded-lg cursor-pointer">
                  <button
                    onClick={() => setActiveTab("new")}
                    className={`cursor-pointer px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${activeTab === "new" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => setActiveTab("top")}
                    className={`cursor-pointer px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${activeTab === "top" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
                  >
                    Top
                  </button>
                </div>
              </div>

              {/* Render Sorted Posts */}
              <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {sortedPosts.length > 0 ? (
                  sortedPosts.map((p) => (
                    <SmallPost key={p._id} post={p} hasAuthor={true} />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-zinc-500 text-lg">
                      No bugs posted here yet! Be the first.
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SpeciesPage;
