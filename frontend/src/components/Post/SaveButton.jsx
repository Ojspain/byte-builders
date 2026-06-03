import { useState, useEffect } from "react";
import bookmarkOutline from "../../assets/bookmarkOutline.svg";
import bookmarkFilled from "../../assets/bookmarkFilled.svg";

function SaveButton({ postId }) {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !postId) return;

    fetch(`/api/posts/${postId}/save/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setIsSaved(data.saved))
      .catch(() => setIsSaved(false));
  }, [postId]);

  const handleToggleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Log in to save posts.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/save`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setIsSaved(data.saved);
      }
    } catch (err) {
      console.error("Failed to toggle save", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={loading}
      className="flex items-center justify-center cursor-pointer disabled:opacity-60 transition-transform active:scale-95"
      title={isSaved ? "Unsave Post" : "Save Post"}
    >
      <img
        src={isSaved ? bookmarkFilled : bookmarkOutline}
        alt="Save Button"
        className="w-5 h-5"
      />
    </button>
  );
}

export default SaveButton;
