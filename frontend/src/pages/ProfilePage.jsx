import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import bugLogo from "../assets/bugLogo.svg";
import BugPreference from "../components/BugPreference/BugPreference";
import SmallPost from "../components/SmallPost/SmallPost";
import { useAuth } from "../context/AuthContext";
import defaultPfp from "../assets/defaultPfp.png";
import UserListModal from "../components/UserListModal/UserListModal";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

function ProfilePage() {
  const { username: usernameParam } = useParams();
  const { user, updateUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [deleteError, setDeleteError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followError, setFollowError] = useState("");
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null });

  const viewingOwnProfile = !usernameParam || usernameParam === user?.username;
  const targetUsername = usernameParam || user?.username;
  const shouldLoadProfile = Boolean(targetUsername);

  const openModal = (type) => {
    setModalConfig({ isOpen: true, type });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: null });
  };

  useEffect(() => {
    if (!shouldLoadProfile) {
      return;
    }

    let isActive = true;
    const loadProfile = async () => {
      setIsLoadingProfile(true);
      setProfileError("");
      try {
        const res = await fetch(`/api/users/${targetUsername}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to load profile.");
        }
        if (!isActive) return;
        setProfileUser(data);
      } catch (err) {
        if (!isActive) return;
        setProfileUser(null);
        setProfileError(err.message || "Failed to load profile.");
      } finally {
        if (isActive) {
          setIsLoadingProfile(false);
        }
      }
    };

    loadProfile();
    return () => {
      isActive = false;
    };
  }, [shouldLoadProfile, targetUsername]);

  useEffect(() => {
    if (!profileUser?._id) {
      return;
    }

    fetch(`/api/posts?authorId=${profileUser._id}`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Failed to load posts:", err));
  }, [profileUser?._id]);

  useEffect(() => {
    if (viewingOwnProfile || !usernameParam || !user) {
      return;
    }

    fetch(`/api/users/${usernameParam}/follow-status`, {
      headers: getAuthHeaders(),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to load follow status.");
        }
        setIsFollowing(Boolean(data?.data?.isFollowing));
      })
      .catch(() => setIsFollowing(false));
  }, [usernameParam, viewingOwnProfile, user]);

  const handleDeletePost = async (postId) => {
    const shouldDelete = window.confirm(
      "Delete this post? This will also remove its comments.",
    );
    if (!shouldDelete) {
      return;
    }

    setDeleteError("");
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        setDeleteError(data.message || "Failed to delete post.");
        return;
      }

      setPosts((previous) => previous.filter((post) => post._id !== postId));
    } catch {
      setDeleteError("Network error while deleting post.");
    }
  };

  const handleFollowToggle = async () => {
    if (!usernameParam || !user || isUpdatingFollow || viewingOwnProfile) {
      return;
    }

    setIsUpdatingFollow(true);
    setFollowError("");
    try {
      const response = await fetch(`/api/users/${usernameParam}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        setFollowError(data.message || "Failed to update follow status.");
        return;
      }

      const nextIsFollowing = !isFollowing;
      setIsFollowing(nextIsFollowing);
      setProfileUser((previous) => {
        if (!previous) return previous;
        const fromApi = data?.data?.targetFollowerCount;
        if (typeof fromApi === "number") {
          return { ...previous, followerCount: fromApi };
        }
        const previousCount = Number(previous.followerCount) || 0;
        return {
          ...previous,
          followerCount: nextIsFollowing
            ? previousCount + 1
            : Math.max(0, previousCount - 1),
        };
      });

      const viewerFollowingCount = data?.data?.viewerFollowingCount;
      if (typeof viewerFollowingCount === "number" && user && updateUser) {
        updateUser({ ...user, followingCount: viewerFollowingCount });
      }
    } catch {
      setFollowError("Network error while updating follow status.");
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  const date = profileUser?.createdAt ? new Date(profileUser.createdAt) : null;
  const formattedDate = date
    ? date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  if (!user && !usernameParam) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 gap-4">
        <p className="text-zinc-600 text-lg">You are not logged in.</p>
        <Link to="/login" className="text-emerald-700 font-semibold underline">
          Log in
        </Link>
      </div>
    );
  }

  if (shouldLoadProfile && isLoadingProfile) {
    return (
      <p className="text-center text-zinc-500 mt-20">Loading profile...</p>
    );
  }

  if (profileError || !profileUser) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 gap-4">
        <p className="text-zinc-600 text-lg">
          {profileError || "User not found."}
        </p>
        <Link to="/" className="text-emerald-700 font-semibold underline">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="flex flex-col">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col sm:flex-row gap-6 mb-6">
          <img
            className="size-32 max-w-248 relative rounded-full border-4 border-zinc-100 object-cover"
            src={profileUser.profilePicUrl || defaultPfp}
          />

          <div className="flex flex-col w-full">
            <div className="text-[#191C1D] text-3xl font-bold">
              {profileUser.username}
            </div>

            <div className="text-zinc-700 text-base font-normal">
              {profileUser.bio}
            </div>

            <BugPreference profileUser={profileUser} />
          </div>

          {viewingOwnProfile ? (
            <Link
              to="/edit-account"
              className="flex gap-2 w-fit whitespace-nowrap h-8 py-2 px-3 relative bg-zinc-100 rounded-full"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 12H2.56875L9.9 4.66875L8.83125 3.6L1.5 10.9312V12ZM0 13.5V10.3125L9.9 0.43125C10.05 0.29375 10.2156 0.1875 10.3969 0.1125C10.5781 0.0375 10.7688 0 10.9688 0C11.1687 0 11.3625 0.0375 11.55 0.1125C11.7375 0.1875 11.9 0.3 12.0375 0.45L13.0688 1.5C13.2188 1.6375 13.3281 1.8 13.3969 1.9875C13.4656 2.175 13.5 2.3625 13.5 2.55C13.5 2.75 13.4656 2.94062 13.3969 3.12188C13.3281 3.30313 13.2188 3.46875 13.0688 3.61875L3.1875 13.5H0ZM12 2.55L10.95 1.5L12 2.55ZM9.35625 4.14375L8.83125 3.6L9.9 4.66875L9.35625 4.14375Z"
                  fill="#191C1D"
                />
              </svg>

              <div className="text-center whitespace-nowrap text-[#191C1D] text-xs font-semibold tracking-wide">
                Edit Profile
              </div>
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleFollowToggle}
              disabled={!user || isUpdatingFollow}
              className="flex gap-2 w-fit whitespace-nowrap h-8 py-2 px-3 relative rounded-full bg-zinc-100 text-[#191C1D] text-xs font-semibold tracking-wide disabled:opacity-60"
            >
              {isUpdatingFollow
                ? "Updating..."
                : isFollowing
                  ? "Following"
                  : "Follow"}
            </button>
          )}
        </div>
        {followError && (
          <p className="mb-4 text-sm text-red-600">{followError}</p>
        )}

        <section className="flex flex-col lg:flex-row gap-6">
          <section className="flex lg:flex-2 justify-center gap-2 sm:gap-6">
            {/* Followers Button */}
            <button
              onClick={() => openModal("followers")}
              className="px-6 py-3 bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col sm:flex-row gap-1 sm:gap-3 w-full justify-center items-center hover:bg-zinc-50 transition-colors"
            >
              <div className="text-[#191C1D] text-md font-bold">Followers:</div>
              <div className="text-zinc-700 text-md font-normal">
                {profileUser.followerCount ?? "---"}
              </div>
            </button>

            {/* Following Button */}
            <button
              onClick={() => openModal("following")}
              className="px-6 py-3 bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col sm:flex-row gap-1 sm:gap-3 w-full justify-center items-center hover:bg-zinc-50 transition-colors"
            >
              <div className="text-[#191C1D] text-md font-bold">Following:</div>
              <div className="text-zinc-700 text-md font-normal">
                {profileUser.followingCount ?? "---"}
              </div>
            </button>
          </section>

          <div className="lg:flex-1 px-6 py-3 bg-white rounded-xl shadow-sm border border-zinc-200 flex flex-col w-full text-center">
            <div className="text-[#191C1D] text-md font-bold">Member Since</div>
            <div className="text-zinc-700 text-md font-normal">
              {formattedDate}
            </div>
          </div>
        </section>
      </section>

      <div className="flex gap-3 mt-16 mb-8">
        <img src={bugLogo} className="h-7 mt-1" />

        <h1 className="text-3xl font-bold">Discoveries</h1>
      </div>
      {deleteError && (
        <p className="mb-4 text-sm text-red-600">{deleteError}</p>
      )}

      <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <SmallPost
            key={post._id}
            post={post}
            hasAuthor={!viewingOwnProfile}
            canDelete={viewingOwnProfile}
            onDelete={handleDeletePost}
          />
        ))}
      </section>

      <UserListModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        username={profileUser.username}
        type={modalConfig.type}
      />
    </>
  );
}

export default ProfilePage;
