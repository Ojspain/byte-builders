import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar/SideBar";
import dummy from "../dummy_db.json";
import filledStar from "../assets/filledStar.svg";
import hollowStar from "../assets/hollowStar.svg";

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
] as const;

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

type SpeciesRow = (typeof dummy.species)[number];

function NewPostPage() {
  const navigate = useNavigate();

  const [speciesQuery, setSpeciesQuery] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    () => new Set([])
  );
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const speciesCandidates = useMemo(() => {
    const q = speciesQuery.trim().toLowerCase();
    if (!q) return dummy.species as SpeciesRow[];
    return (dummy.species as SpeciesRow[]).filter(
      (s) =>
        s.speciesCommon.toLowerCase().includes(q) ||
        s.speciesActual.toLowerCase().includes(q)
    );
  }, [speciesQuery]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else if (next.size < 5) next.add(tag);
      return next;
    });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Stub: wire to API when available
    navigate("/");
  };

  return (
    <>
      <SideBar />
      <div
        className="ml-60 mt-16 min-h-[calc(100vh-4rem)] bg-slate-50 px-8 pb-16 pt-8 font-[family-name:var(--font-body)] sm:px-16"
        style={
          {
            "--font-body": "'Be Vietnam Pro', sans-serif",
            "--font-display": "'Plus Jakarta Sans', sans-serif",
          } as React.CSSProperties
        }
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 pt-6 pb-16">
          <header className="flex flex-col gap-1 text-center">
            <h1
              className="text-[32px] font-bold leading-[1.2] text-[#191c1d]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              You Found a Bug!
            </h1>
            <p className="text-sm leading-[21px] text-[#6c7b6d]">
              Let&apos;s add it to your collection.
            </p>
          </header>

          <div className="rounded-xl border border-[#edeeef] bg-white p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] sm:p-10">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Image upload */}
              <div>
                <label
                  htmlFor="bug-image-upload"
                  className="relative flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#bbcbbb] bg-[#f8f9fa] p-2 transition hover:bg-[#f1f3f4]"
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
                        className="mb-2 h-11 w-11 text-[#6c7b6d]"
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
                      <span className="text-center text-xs font-bold uppercase tracking-[0.6px] text-[#6c7b6d]">
                        Upload from your Device
                      </span>
                    </>
                  )}
                </label>
              </div>

              {/* Species & Location */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="pl-1 text-xs font-bold uppercase tracking-[0.6px] text-[#3d4a3e]">
                    Species
                  </label>
                  <div className="relative">
                    <svg
                      className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#6c7b6d]"
                      viewBox="0 0 18 18"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.417 8.575 12.65 7.925 12.883 7.233 13 6.5 13 4.683 13 3.146 12.371 1.888 11.112 0.63 9.854 0 8.317 0 6.5 0 4.683 0.63 3.146 1.888 1.888 3.146 0.63 4.683 0 6.5 0 8.317 0.63 9.854 1.888 11.112 3.146 12.371 4.683 13 6.5 13 7.233 12.883 7.925 12.65 8.575 12.417 9.225 12.1 9.8 11.7 10.3L18 16.6 16.6 18ZM6.5 11C7.75 11 8.813 10.563 9.688 9.688 10.563 8.813 11 7.75 11 6.5 11 5.25 10.563 4.188 9.688 3.313 8.813 2.437 7.75 2 6.5 2 5.25 2 4.188 2.437 3.313 3.313 2.437 4.188 2 5.25 2 6.5 2 7.75 2.437 8.813 3.313 9.688 4.188 10.563 5.25 11 6.5 11Z" />
                    </svg>
                    <input
                      type="text"
                      value={speciesQuery}
                      onChange={(e) => setSpeciesQuery(e.target.value)}
                      list="species-suggestions"
                      placeholder="Drosophila melanogaster"
                      className="w-full rounded-full border border-[#e1e3e4] bg-[#f8f9fa] py-3.5 pl-12 pr-4 text-sm text-[#3d4a3e] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#bbcbbb] focus:border-[#bbcbbb]"
                    />
                    <datalist id="species-suggestions">
                      {speciesCandidates.map((s) => (
                        <option
                          key={s._id}
                          value={`${s.speciesActual} (${s.speciesCommon})`}
                        />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="pl-1 text-xs font-bold uppercase tracking-[0.6px] text-[#3d4a3e]">
                    Location
                  </label>
                  <div className="relative">
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full appearance-none rounded-full border border-[#e1e3e4] bg-[#f8f9fa] py-3.5 pl-[17px] pr-10 text-sm text-[#3d4a3e] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] outline-none focus:border-[#bbcbbb]"
                    >
                      <option value="" disabled className="text-[#bbcbbb]">
                        Select One
                      </option>
                      {LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 h-[21px] w-[21px] -translate-y-1/2 text-[#3d4a3e]"
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

              {/* Rating */}
              <div className="flex max-w-md flex-col gap-1">
                <label className="pl-1 text-xs font-bold uppercase tracking-[0.6px] text-[#3d4a3e]">
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

              {/* Tags */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-baseline gap-2 pl-1">
                  <span className="text-xs font-bold uppercase tracking-[0.6px] text-[#3d4a3e]">
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
                        className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                          on
                            ? "bg-[#de8ffd] text-[#661a86] shadow-[0px_2px_2px_rgba(0,0,0,0.05)]"
                            : "bg-[#edeeef] text-[#3d4a3e] hover:opacity-90"
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
                <label className="pl-1 text-xs font-bold uppercase tracking-[0.6px] text-[#3d4a3e]">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write an Interesting Caption!"
                  rows={4}
                  className="w-full resize-y rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] px-[17px] pb-14 pt-3 text-sm text-[#3d4a3e] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none placeholder:text-[#bbcbbb] focus:border-[#bbcbbb]"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#006d37] px-6 py-2.5 text-base font-semibold text-white shadow-[0px_4px_6px_rgba(46,204,113,0.2)] transition hover:bg-[#005a2e]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Log Observation
                  <span className="inline-flex h-[14px] w-[14px] items-center justify-center rounded-full border border-white/80 bg-white/20">
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
                  className="flex w-full shrink-0 items-center justify-center gap-2 rounded-full border border-[#b3b3b3] bg-[#edeeef] px-6 py-2.5 text-sm font-semibold text-[#3d4a3e] shadow-[0px_4px_6px_rgba(25,28,29,0.1)] transition hover:bg-[#e2e4e5] sm:w-[200px]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Cancel
                  <span className="inline-flex h-[13px] w-[13px] items-center justify-center text-[#3d4a3e]">
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
