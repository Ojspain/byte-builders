import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import beetle from "../assets/beetle.jpg";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function EditAccountPage() {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [profilePicUrl, setProfilePicUrl] = useState(user?.profilePicUrl ?? "");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`/api/users/${user.username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username, email, bio, profilePicUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.message || "Failed to update profile.";
        setError(message);
        toast.error(message);
        return;
      }

      updateUser(data);
      toast.success("Profile updated successfully.");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      const message = "Network error. Is the server running?";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <>
      <section className="w-screen h-screen z-200 bg-white absolute top-0 left-0 flex">
        <img
          src={beetle}
          className="hidden xl:inline h-full w-[40%] object-cover"
        />

        <div
          className="w-full min-h-[calc(100vh-4rem)] px-8 pb-16 pt-8 font-(family-name:--font-body) sm:px-16"
          style={{
            "--font-body": "'Be Vietnam Pro', sans-serif",
            "--font-display": "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 pt-6 pb-16">
            <header className="flex flex-col gap-1">
              <h1
                className="text-[32px] font-bold leading-[1.2] text-[#191c1d]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Edit Account
              </h1>
              <p className="text-sm leading-5.25 text-zinc-500">
                Just bee yourself!
              </p>
            </header>

            <div className="rounded-xl border border-[#edeeef] bg-white p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.04)] sm:p-10">
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                {/* Upper section */}
                <section className="flex flex-col md:flex-row gap-5">
                  {/* Profile image URL */}
                  <div className="flex flex-col gap-2 m-auto">
                    <label className="pl-1 text-xs font-bold uppercase tracking-[0.6px] text-zinc-600">
                      Profile Image
                    </label>
                    <div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-[#f8f9fa] overflow-hidden">
                      {profilePicUrl ? (
                        <img
                          src={profilePicUrl}
                          alt="Preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <svg
                          className="h-11 w-11 text-zinc-400"
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
                      )}
                    </div>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={profilePicUrl}
                      onChange={(e) => setProfilePicUrl(e.target.value)}
                      className="w-48 rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] px-3 py-2 text-xs text-zinc-600 outline-none placeholder:text-zinc-400 focus:border-zinc-400"
                    />
                  </div>

                  {/* Right section */}
                  <section className="w-full flex flex-col gap-6 justify-center">
                    {/* Username */}
                    <div className="w-full mt-3 flex flex-col gap-1 relative">
                      <label className="pl-1 text-xs font-bold uppercase tracking-[0.6px] text-zinc-600">
                        Username
                      </label>
                      <input
                        type="text"
                        placeholder="BugHunter47"
                        id="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className="pl-10 bg-zinc-100 rounded-full h-12 border border-zinc-200"
                      />
                      {/* svg */}
                      <div className="h-12 pl-4 absolute top-9">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6Z"
                            fill="#71717b"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="w-full mt-1.25 flex flex-col gap-1 relative">
                      <label className="pl-1 text-xs font-bold uppercase tracking-[0.6px] text-zinc-600">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="explorer@beetlefarm.com"
                        id="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="pl-10 bg-zinc-100 rounded-full h-12"
                      />
                      {/* svg */}
                      <div className="h-12 pl-4 absolute top-9">
                        <svg
                          width="20"
                          height="16"
                          viewBox="0 0 20 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2ZM10 9L2 4V14H18V4L10 9ZM10 7L18 2H2L10 7ZM2 4V2V4V14V4Z"
                            fill="#71717b"
                          />
                        </svg>
                      </div>
                    </div>
                  </section>
                </section>

                {/* Bio */}
                <div className="flex flex-col gap-1">
                  <label className="pl-1 text-xs font-bold uppercase tracking-[0.6px] text-zinc-600">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Let others know what brings you under the cup."
                    rows={4}
                    className="w-full resize-y rounded-lg border border-[#e1e3e4] bg-[#f8f9fa] px-4.25 pb-14 pt-3 text-sm text-zinc-600 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none placeholder:text-zinc-400 focus:border-zinc-400"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#006d37] font-medium px-6 py-2.5 text-base text-white transition hover:bg-[#005a2e] tracking-wide"
                  >
                    Save Changes
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
                  {error && <p className="text-red-500 text-sm">{error}</p>}
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
      </section>
    </>
  );
}

export default EditAccountPage;
