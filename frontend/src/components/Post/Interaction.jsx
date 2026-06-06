import { useEffect, useState } from "react";
import { fetchApi } from "@/fetchApi";
import likedHeart from "../../assets/likedHeart.svg";
import unlikedHeart from "../../assets/unlikedHeart.svg";
import sprayed from "../../assets/sprayed.svg";
import unsprayed from "../../assets/unsprayed.svg";

function Interaction({
  targetType,
  targetId,
  likeCount: initialLikeCount,
  sprayCount: initialSprayCount,
}) {
  const [myReaction, setMyReaction] = useState(null);
  const [isLoadingReaction, setIsLoadingReaction] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount ?? 0);
  const [sprayCount, setSprayCount] = useState(initialSprayCount ?? 0);
  const [error, setError] = useState("");

  useEffect(() => {
    setLikeCount(initialLikeCount ?? 0);
  }, [initialLikeCount]);

  useEffect(() => {
    setSprayCount(initialSprayCount ?? 0);
  }, [initialSprayCount]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !targetType || !targetId) {
      setMyReaction(null);
      return;
    }

    fetchApi(`/api/reactions/${targetType}/${targetId}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to load reaction status.");
        }
        setMyReaction(data?.data?.myReaction || null);
      })
      .catch(() => setMyReaction(null));
  }, [targetType, targetId]);

  const handleReaction = async (reactionType) => {
    if (!targetType || !targetId || isLoadingReaction) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Log in to react.");
      return;
    }

    setError("");
    setIsLoadingReaction(true);

    const previous = {
      myReaction,
      likeCount,
      sprayCount,
    };

    const isRemoving = myReaction === reactionType;
    let nextReaction = myReaction;
    let nextLikeCount = likeCount;
    let nextSprayCount = sprayCount;

    if (isRemoving) {
      nextReaction = null;
      if (reactionType === "like") nextLikeCount = Math.max(0, likeCount - 1);
      if (reactionType === "spray") nextSprayCount = Math.max(0, sprayCount - 1);
    } else if (reactionType === "like") {
      nextReaction = "like";
      nextLikeCount = likeCount + 1;
      if (myReaction === "spray") nextSprayCount = Math.max(0, sprayCount - 1);
    } else if (reactionType === "spray") {
      nextReaction = "spray";
      nextSprayCount = sprayCount + 1;
      if (myReaction === "like") nextLikeCount = Math.max(0, likeCount - 1);
    }

    setMyReaction(nextReaction);
    setLikeCount(nextLikeCount);
    setSprayCount(nextSprayCount);

    try {
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
      setLikeCount(payload.likeCount ?? nextLikeCount);
      setSprayCount(payload.sprayCount ?? nextSprayCount);
    } catch (requestError) {
      setMyReaction(previous.myReaction);
      setLikeCount(previous.likeCount);
      setSprayCount(previous.sprayCount);
      setError(requestError.message || "Network error while updating reaction.");
    } finally {
      setIsLoadingReaction(false);
    }
  };

  return (
    <>
      <div className="flex gap-3.5 h-5">
        {/* Like */}
        <button
          className="flex gap-1 disabled:opacity-60 cursor-pointer"
          onClick={() => handleReaction("like")}
          disabled={isLoadingReaction}
        >
          <img src={myReaction === "like" ? likedHeart : unlikedHeart} alt="Like" />
          <div
            className={`${myReaction === "like" ? "text-emerald-800" : "text-zinc-500"} text-center text-sm font-bold tracking-wide`}
          >
            {likeCount}
          </div>
        </button>

        {/* Spray */}
        <button
          className="flex gap-1 disabled:opacity-60 cursor-pointer"
          onClick={() => handleReaction("spray")}
          disabled={isLoadingReaction}
        >
          <img src={myReaction === "spray" ? sprayed : unsprayed} alt="Spray" />
          <div
            className={` ${myReaction === "spray" ? "text-[#880808]" : "text-zinc-500"} text-center text-sm font-bold tracking-wide`}
          >
            {sprayCount}
          </div>
        </button>
      </div>
      {error && <div className="pt-1 text-[10px] text-red-600">{error}</div>}
    </>
  );
}

export default Interaction;
