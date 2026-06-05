import { Link } from "react-router-dom";
import defaultPfp from "../../assets/defaultPfp.png";
import arrowRight from "../../assets/arrowRight.svg";

function UserSearchResult({ userData }) {
  if (!userData) return null;

  const { username, profilePicUrl, bio } = userData;

  return (
    <Link to={`/profile/${username}`}>
      <div className="flex w-full items-center max-w-[600px] mx-auto p-3 bg-zinc-100 border border-zinc-600 rounded-lg transition-colors hover:bg-zinc-200">
        <img
          src={profilePicUrl || defaultPfp}
          alt={`${username}'s avatar`}
          className="object-cover w-12 h-12 md:w-14 md:h-14 rounded-full mr-4 border border-zinc-300 bg-zinc-200"
        />

        <div className="flex flex-col overflow-hidden">
          <div className="text-base md:text-lg font-semibold text-zinc-900 truncate">
            {username}
          </div>
          <div className="text-sm md:text-base text-zinc-500 truncate">
            {bio || "No bio available"}
          </div>
        </div>

        <img src={arrowRight} alt="-->" className="w-5 md:w-10 ml-auto mr-5" />
      </div>
    </Link>
  );
}

export default UserSearchResult;
