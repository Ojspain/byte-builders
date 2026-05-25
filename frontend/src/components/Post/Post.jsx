import { useState, useEffect, useRef } from "react";
import Comment from "./Comment";
import StarRating from "../StarRating/StarRating";
import Interaction from "./Interaction";
import diagonalArrow from "../../assets/diagonalArrow.svg";
import sendArrow from "../../assets/sendArrow.svg";
import superHeart from "../../assets/superHeart.svg";
import Tags from "./Tags";
import { Link } from "react-router-dom";

function Post({
  _id,
  authorName,
  imageUrl,
  speciesCommon,
  speciesActual,
  textContent,
  location,
  tags,
  rating,
  heart,
  createdAt,
  likeCount,
  sprayCount,
}) {
  const [isScroll, setIsScroll] = useState(false);
  const [populatedComments, setPopulatedComments] = useState([]);
  const scrollRef = useRef(null);
  const date = new Date(createdAt);
  const postedHoursAgo = Math.floor((new Date() - date) / (1000 * 60 * 60));
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    if (!_id) return;
    fetch(`/api/posts/${_id}/comments`)
      .then((res) => res.json())
      .then((data) => setPopulatedComments(data))
      .catch(() => setPopulatedComments([]));
  }, [_id]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) setIsScroll(el.scrollHeight != el.clientHeight);
  }, [populatedComments]);

  return (
    <>
      <div
        key={_id}
        className=" flex flex-col xl:flex-row w-140 xl:w-280 h-280 xl:h-140 bg-white rounded-xl outline outline-zinc-200"
      >
        {/* Left Half */}
        <section className="h-[50%] xl:h-full xl:w-[50%] relative">
          {/* Post Photo */}
          <img
            className="h-full w-full object-cover rounded-t-xl xl:rounded-t-none xl:rounded-l-xl"
            src={imageUrl}
          />

          {/* Poster Info */}
          <section className="p-3 left-0 top-0 absolute">
            <div className="p-3 bg-stone-900/75 rounded-[5px] flex gap-3">
              {/* Profile Picture */}
              <img
                src="https://placehold.co/20x20"
                alt=""
                className="w-7.5 h-7.5 rounded-full"
              />

              {/* Name and Time */}
              <div className="min-w-20 max-w-80 flex flex-col overflow-hidden">
                <div className="text-white text-xs font-bold tracking-wide max-h-8 overflow-hidden">
                  {authorName}
                </div>
                <div className="text-stone-300 text-xs font-medium">
                  {postedHoursAgo < 24
                    ? `${postedHoursAgo} hours ago`
                    : postedHoursAgo < 8760
                      ? `${Math.floor(postedHoursAgo / 24)} days ago`
                      : `${Math.floor(postedHoursAgo / (24 * 365))} years ago`}
                </div>
              </div>
            </div>
          </section>
        </section>

        {/* Right Half */}
        <div className="h-[50%] xl:h-full xl:w-[50%] flex p-6 bg-white border-l border-zinc-200 flex-col">
          {/* Top Section */}
          <div className="self-stretch pb-6 flex flex-col justify-start items-start">
            <div className="self-stretch flex flex-col justify-start items-start gap-1">
              {/* Title */}
              <div className="flex gap-1.5 items-baseline">
                <div className="text-zinc-900 text-xl font-semibold leading-5">
                  {speciesCommon}
                </div>
                <Link
                  to={`/species/${speciesActual}`}
                  className="whitespace-nowrap flex gap-1 text-zinc-500 text-xs font-semibold hover:text-emerald-600 hover:underline transition-colors cursor-pointer"
                >
                  ({speciesActual})
                  <img src={diagonalArrow} className="w-2 h-3.5" />
                </Link>
              </div>

              {/* Tags */}
              <Tags location={location} tags={tags} />

              {/* Rating */}
              <div className="flex gap-2">
                <StarRating rating={rating} />
                {heart &&
                  <img src={superHeart} className="mt-2 size-3.5"></img>
                }
              </div>

              {/* Caption */}
              <div className="w-full pt-2.5 flex overflow-hidden">
                <div className="text-zinc-700 text-sm font-normal">
                  {textContent}
                </div>
              </div>
            </div>
          </div>

          {/* Date and Interaction */}
          <section className="self-stretch pb-3 border-b border-zinc-200 flex justify-between">
            {/* Date */}
            <div className="text-zinc-500 text-xs font-semibold">
              {formattedDate}
            </div>

            {/* Like and Spray Icons */}
            <Interaction likeCount={likeCount} sprayCount={sprayCount} />
          </section>

          {/* Comments Section */}
          <div
            ref={scrollRef}
            className={`h-full pt-5 px-1 flex flex-col gap-3 overflow-y-scroll scrollbar-none ${isScroll && "bg-linear-to-b from-80% to-zinc-100"}`}
          >
            {populatedComments.map((commentData) => (
              <Comment
                key={commentData._id}
                author={commentData.author}
                commentText={commentData.commentText}
                createdAt={commentData.createdAt}
              />
            ))}
          </div>

          {/* Add Comment */}
          {/* TODO: add usability */}
          <div className="border-t border-zinc-200 flex flex-col w-full pt-5 relative">
            <button className="absolute right-3 top-[50%]">
              <img src={sendArrow} alt="Post" />
            </button>
            <input
              type="text"
              placeholder="Leave a Comment"
              className="border border-zinc-200 rounded-full p-3"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Post;
