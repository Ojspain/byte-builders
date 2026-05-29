import { useState, useEffect, useRef } from "react";
import Comment from "./Comment";
import StarRating from "../StarRating/StarRating";
import Interaction from "./Interaction";
import diagonalArrow from "../../assets/diagonalArrow.svg";
import sendArrow from "../../assets/sendArrow.svg";
import superHeart from "../../assets/superHeart.svg";
import Tags from "./Tags";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Post({
  _id,
  authorId,
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
  onPostDeleted,
}) {
  const [isScroll, setIsScroll] = useState(false);
  const [populatedComments, setPopulatedComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentError, setCommentError] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const scrollRef = useRef(null);
  const { user } = useAuth();
  const isPostOwner = Boolean(user && String(authorId) === String(user._id));
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
    if (el) setIsScroll(el.scrollHeight !== el.clientHeight);
  }, [populatedComments]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  const handleCreateComment = async () => {
    const trimmedComment = commentInput.trim();
    if (!user) {
      setCommentError("Log in to post a comment.");
      return;
    }
    if (!trimmedComment) {
      return;
    }

    setIsSubmittingComment(true);
    setCommentError("");
    try {
      const response = await fetch(`/api/posts/${_id}/comments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ commentText: trimmedComment }),
      });
      const data = await response.json();

      if (!response.ok) {
        setCommentError(data.message || "Failed to post comment.");
        return;
      }

      setPopulatedComments((previous) => [...previous, data.comment]);
      setCommentInput("");
    } catch {
      setCommentError("Network error while posting comment.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleUpdateComment = async (commentId, commentText) => {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ commentText }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update comment.");
    }
    setPopulatedComments((previous) =>
      previous.map((comment) =>
        comment._id === commentId ? data.comment : comment,
      ),
    );
  };

  const handleDeleteComment = async (commentId) => {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete comment.");
    }
    setPopulatedComments((previous) =>
      previous.filter((comment) => comment._id !== commentId),
    );
  };

  const handleDeletePost = async () => {
    if (!isPostOwner || isDeletingPost) {
      return;
    }

    const shouldDelete = window.confirm(
      "Delete this post? This will also remove its comments.",
    );
    if (!shouldDelete) {
      return;
    }

    setDeleteError("");
    setIsDeletingPost(true);
    try {
      const response = await fetch(`/api/posts/${_id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        setDeleteError(data.message || "Failed to delete post.");
        return;
      }
      if (onPostDeleted) {
        onPostDeleted(_id);
      }
    } catch {
      setDeleteError("Network error while deleting post.");
    } finally {
      setIsDeletingPost(false);
    }
  };

  return (
    <>
      <div
        key={_id}
        className=" flex flex-col xl:flex-row w-80 md:w-140 xl:w-280 h-200 md:h-280 xl:h-140 bg-white rounded-xl outline outline-zinc-200"
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
                <Link
                  to={`/profile/${authorName}`}
                  className="text-white text-xs font-bold tracking-wide max-h-8 overflow-hidden hover:underline"
                >
                  {authorName}
                </Link>
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
        <div className="h-[50%] xl:h-full xl:w-[50%] flex p-6 bg-white border-l border-zinc-200 flex-col overflow-hidden">
          {/* Top Section */}
          <div className="self-stretch pb-6 flex flex-col justify-start items-start">
            <div className="self-stretch flex flex-col justify-start items-start gap-1">
              {/* Title */}
              <div className="flex flex-col sm:flex-row gap-1.5 items-baseline">
                <div className="text-zinc-900 text-xl font-semibold leading-5">
                  {speciesCommon}
                </div>
                <Link
                  to={`/species/${speciesActual}`}
                  className="whitespace-nowrap flex gap-1 text-zinc-500 text-xs font-semibold hover:text-emerald-600 hover:underline transition-colors cursor-pointer text-ellipsis"
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
          <section className="self-stretch pb-3 border-b border-zinc-200 flex justify-between items-center gap-3">
            {/* Date */}
            <div className="text-zinc-500 text-xs font-semibold">
              {formattedDate}
            </div>

            {/* Like and Spray Icons */}
            <div className="flex items-center gap-2">
              <Interaction likeCount={likeCount} sprayCount={sprayCount} />
              {isPostOwner &&
                <button
                  type="button"
                  className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                  onClick={handleDeletePost}
                  disabled={isDeletingPost}
                >
                  {isDeletingPost ? "Deleting..." : "Delete post"}
                </button>
              }
            </div>
          </section>
          {deleteError && <p className="pt-2 text-xs text-red-600">{deleteError}</p>}

          {/* Comments Section */}
          <div
            ref={scrollRef}
            className={`h-full pt-5 px-1 flex flex-col gap-3 overflow-y-scroll scrollbar-none ${isScroll && "bg-linear-to-b from-80% to-zinc-100"}`}
          >
            {populatedComments.map((commentData) => (
              <Comment
                key={commentData._id}
                commentId={commentData._id}
                authorId={commentData.authorId}
                author={commentData.author}
                commentText={commentData.commentText}
                createdAt={commentData.createdAt}
                isOwner={Boolean(
                  user && String(commentData.authorId) === String(user._id),
                )}
                onUpdate={handleUpdateComment}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>

          {/* Add Comment */}
          <div className="border-t border-zinc-200 flex flex-col w-full pt-5 relative">
            <button
              className="absolute right-3 top-[50%] disabled:opacity-50"
              disabled={isSubmittingComment || !commentInput.trim()}
              onClick={handleCreateComment}
            >
              <img src={sendArrow} alt="Post" />
            </button>
            <input
              type="text"
              placeholder={user ? "Leave a Comment" : "Log in to leave a comment"}
              className="border border-zinc-200 rounded-full p-3"
              value={commentInput}
              onChange={(event) => setCommentInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleCreateComment();
                }
              }}
              maxLength={1000}
            />
            {commentError &&
              <p className="pt-2 text-xs text-red-600">{commentError}</p>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Post;
