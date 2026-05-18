import { useState } from "react";
import likedHeart from "../../assets/likedHeart.svg";
import unlikedHeart from "../../assets/unlikedHeart.svg";
import sprayed from "../../assets/sprayed.svg";
import unsprayed from "../../assets/unsprayed.svg";

function Interaction({
  likeCount: initialLikeCount,
  sprayCount: initialSprayCount,
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSprayed, setIsSprayed] = useState(false);
  const [likeImg, setLikeImg] = useState(unlikedHeart);
  const [sprayImg, setSprayImg] = useState(unsprayed);

  // set likes/sprays to zero if undefined
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
  const [sprayCount, setSprayCount] = useState(initialSprayCount || 0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isLiked) {
      setLikeCount(likeCount - 1);
      setLikeImg(unlikedHeart);
    } else {
      setLikeCount(likeCount + 1);
      setLikeImg(likedHeart);

      if (isSprayed) {
        setIsSprayed(false);
        setSprayImg(unsprayed);
        setSprayCount(sprayCount - 1);
      }
    }
  };

  const handleSpray = () => {
    setIsSprayed(!isSprayed);
    if (isSprayed) {
      setSprayCount(sprayCount - 1);
      setSprayImg(unsprayed);
    } else {
      setSprayCount(sprayCount + 1);
      setSprayImg(sprayed);

      if (isLiked) {
        setIsLiked(false);
        setLikeImg(unlikedHeart);
        setLikeCount(likeCount - 1);
      }
    }
  };

  return (
    <>
      <div className="flex gap-3.5 h-5">
        {/* Like */}
        <button className="flex gap-1" onClick={handleLike}>
          <img src={likeImg} alt="Like" />
          <div
            className={`${isLiked ? "text-emerald-800" : "text-zinc-500"} text-center text-sm font-bold tracking-wide`}
          >
            {likeCount}
          </div>
        </button>

        {/* Spray */}
        <button className="flex gap-1" onClick={handleSpray}>
          <img src={sprayImg} alt="Spray" />
          <div
            className={` ${isSprayed ? "text-[#880808]" : "text-zinc-500"} text-center text-sm font-bold tracking-wide`}
          >
            {sprayCount}
          </div>
        </button>
      </div>
    </>
  );
}

export default Interaction;
