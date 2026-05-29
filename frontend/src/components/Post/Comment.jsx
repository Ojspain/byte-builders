import { useState } from "react";
import { Link } from "react-router-dom";

function Comment({
  commentId,
  author,
  commentText,
  createdAt,
  isOwner,
  onUpdate,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(commentText);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // just in case
  if (!author) {
    return <div className="text-sm text-zinc-500">Unknown user</div>;
  }

  const timestamp = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";

  const handleSave = async () => {
    const trimmed = draftText.trim();
    if (!trimmed) {
      setError("Comment cannot be empty.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await onUpdate(commentId, trimmed);
      setIsEditing(false);
    } catch (saveError) {
      setError(saveError.message || "Could not save comment.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setError("");
    try {
      await onDelete(commentId);
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete comment.");
    }
  };

  return (
    <div className="flex gap-3 items-start text-sm">
      <img
        src={author.profilePicUrl}
        alt={`${author.username} profile`}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="w-full">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-2 items-baseline">
            <Link
              to={`/profile/${author.username}`}
              className="w-min justify-center text-zinc-900 font-bold tracking-wide hover:underline"
            >
              {author.username}:
            </Link>
            {timestamp &&
              <div className="text-[10px] font-medium text-zinc-500">{timestamp}</div>
            }
          </div>
          {isOwner &&
            <div className="flex gap-2 text-[11px] font-semibold">
              {isEditing
                ? (
                  <button
                    type="button"
                    className="text-zinc-500 hover:text-zinc-700"
                    onClick={() => {
                      setIsEditing(false);
                      setDraftText(commentText);
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                )
                : (
                  <button
                    type="button"
                    className="text-zinc-500 hover:text-zinc-700"
                    onClick={() => {
                      setDraftText(commentText);
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </button>
                )}
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          }
        </div>

        {isEditing
          ? (
            <div className="pt-1 flex flex-col gap-1">
              <input
                value={draftText}
                onChange={(event) => setDraftText(event.target.value)}
                className="border border-zinc-200 rounded-md px-2 py-1 text-zinc-700"
                maxLength={1000}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 disabled:opacity-50"
                  disabled={isSaving}
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          )
          : <div className="w-fit text-zinc-700">{commentText}</div>}

        {error && <div className="pt-1 text-xs text-red-600">{error}</div>}
      </div>
    </div>
  );
}

export default Comment;
