import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SelectSpecies from "../components/SelectSpecies/SelectSpecies";
import filledStar from "../assets/filledStar.svg";
import hollowStar from "../assets/hollowStar.svg";
import superHeart from "../assets/superHeart.svg";
import unlikedHeart from "../assets/unlikedHeart.svg";

const TAG_OPTIONS = [
  "Serious",
  "Joke",
  "Scared me!",
  "Crawler",
  "Flying",
  "Landed on me",
  "Got in my face",
  "Stationary",
  "Pesky",
  "Fast",
  "Ugly",
  "Pretty",
  "Shiny",
  "Tiny",
  "Small",
  "Large",
  "Massive beast",
  "Loud",
  "Quiet",
];

const LOCATIONS = [
  "Outside",
  "Kitchen",
  "Bedroom",
  "Garden",
  "Bathroom",
  "Garage",
  "Office",
  "Other",
];

function NewPostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [speciesQuery, setSpeciesQuery] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSuperLiked, setIsSuperLiked] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else if (next.size < 5) next.add(tag);
      return next;
    });
  };

  const handleSuperLike = () => {
    setIsSuperLiked(!isSuperLiked);
  }

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to post.");
      console.error("You must be logged in to post.");
      return;
    }

    const fileInput = document.getElementById("bug-image-upload");
    const file = fileInput.files?.[0];

    if (!file) {
      console.error("Please upload an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("location", location);
    formData.append("rating", rating);
    formData.append("heart", isSuperLiked);
    formData.append("caption", caption);
    formData.append("tags", JSON.stringify(Array.from(selectedTags)));

    // Append the user data and species info
    formData.append("authorId", user._id);
    formData.append("authorName", user.username);
    formData.append("speciesActual", speciesQuery);

    // Retrieve the token for the Authorization header
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        navigate("/");
      } else {
        const errorData = await response.json();
        console.error("Failed to create post:", errorData.message);
      }
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 gap-4">
        <p className="text-zinc-600 text-lg">Log in to create a new post.</p>
        <Link to="/login" className="text-emerald-700 font-semibold underline">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <>
      <div
        className="min-h-[calc(100vh-4rem)] md:px-8 pb-16 pt-8 font-(family-name:--font-body) sm:px-16"
        style={{
          "--font-body": "'Be Vietnam Pro', sans-serif",
          "--font-display": "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 pt-6 pb-16">
          <header className="flex flex-col gap-1 text-center">
            <h1
              className="text-[32px] font-bold leading-[1.2] text-[#191c1d]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              You Found a Bug!
            </h1>
            <p className="text-sm leading-5.25 text-zinc-500">
              Let&apos;s add it to your collection.
            </p>
          </header>

          <div className="rounded-xl border border-[#edeeef] bg-white p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] sm:p-10">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Image upload */}
              <div>
                <label
                  htmlFor="bug-image-upload"
                  className="relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-400 bg-[#f8f9fa] p-2 transition hover:bg-[#f1f3f4]"
                >
                  <input
                    id="bug-image-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={onFileChange}
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-40 max-w-full rounded-md object-contain"
                    />
                  ) : (
                    <>
                      <svg
                        className="mb-2 h-11 w-11 text-zinc-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-center text-xs font-bold uppercase tracking-[0.6px] text-zinc-500">
                        Upload from your Device
                      </span>
                    </>
                  )}
                </label>
              </div>

              {/* Species & Location */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <SelectSpecies
                  isLabeled={true}
                  speciesQuery={speciesQuery}
                  setSpeciesQuery={setSpeciesQuery}
                />
                <div className="flex flex-col gap-1">
                  <label className="pl-1 text-xs font-bold uppercase tracking-[0.6px] text-zinc-600">
                    Location
                  </label>
                  <div className="relative">
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full appearance-none rounded-full border border-[#e1e3e4] bg-[#f8f9fa] py-3.5 pl-4.25 pr-10 text-sm text-zinc-600 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] outline-none focus:border-zinc-400"
                    >
                      <option value="" disabled className="text-zinc-400">
                        Select One
                      </option>
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 h-5.25 w-5.25 -translate-y-1/2 text-zinc-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex gap-5">
                {/* Rating */}
                <div className="flex max-w-md flex-col gap-1">
                  <label className="pl-1 text-xs font-bold uppercase tracking-[0.6px] text-zinc-600">
                    Rating
                  </label>
                  <div className="flex items-center gap-1 px-2 py-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(n)}
                        className="rounded p-0.5 transition hover:opacity-80"
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      >
                        <img
                          src={n <= rating ? filledStar : hollowStar}
                          alt=""
                          className="h-6 w-6"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Super Heart */}
                <div className="flex max-w-md flex-col gap-1">
                  <label className="pl-1 text-xs font-bold uppercase tracking-[0.6px] text-zinc-600 whitespace-nowrap">
                    Super like
                  </label>
                  <div className="flex items-center gap-1 px-2 py-2">
                    <button type="button" onClick={handleSuperLike}>
                      <img
                        src={isSuperLiked ? superHeart : unlikedHeart}
                        className={`${!isSuperLiked && "brightness-160"} h-6 w-6 mt-0.5`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline gap-2 pl-1">
                  <span className="text-xs font-bold uppercase tracking-[0.6px] text-zinc-600">
                    Tags
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#828282]">
                    (Select up to 5 tags)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 py-3">
                  {TAG_OPTIONS.map((tag) => {
                    const on = selectedTags.has(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`rounded-full px-3 py-1 text-sm sm:text-xs font-medium transition ${on
                          ? "bg-[#f9d7f9] text-[#5d0866] shadow-[0px_2px_2px_rgba(0,0,0,0.05)]"
                          : "bg-[#edeeef] text-zinc-600 hover:opacity-90"
                          }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <p className="pl-1 text-xs font-bold uppercase tracking-[0.6px] text-[#828282]">
                  {selectedTags.size}/5
                </p>
              </div>

              {/* Caption */}
              <div className="flex flex-col gap-1">
                <label className="pl-1 text-xs font-bold uppercase tracking-[0.6px] text-zinc-600">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write an Interesting Caption!"
                  rows={4}
                  className="w-full resize-y rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] px-4.25 pb-14 pt-3 text-sm text-zinc-600 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none placeholder:text-zinc-400 focus:border-zinc-400"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#006d37] font-medium px-6 py-2.5 text-base text-white transition hover:bg-[#005a2e] tracking-wide whitespace-nowrap"
                >
                  Log Observation
                  <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-white/80">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-[#b3b3b3] bg-[#edeeef] px-6 py-2.5 text-sm font-medium text-zinc-600transition hover:bg-[#e2e4e5] sm:w-50"
                >
                  Cancel
                  <span className="inline-flex h-3.25 w-3.25 items-center justify-center text-zinc-600">
                    <svg viewBox="0 0 14 14" fill="none" aria-hidden>
                      <circle
                        cx="7"
                        cy="7"
                        r="6"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <path
                        d="M4.5 4.5l5 5M9.5 4.5l-5 5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewPostPage;
