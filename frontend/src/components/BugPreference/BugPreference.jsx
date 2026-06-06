import { Link } from "react-router-dom";
import { fetchApi } from "@/fetchApi";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function BugPreference({ profileUser }) {
  const [liked, setLiked] = useState([]);
  const [disliked, setDisliked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profileUser?.username) return;

    setLoading(true);

    fetchApi(`/api/users/${profileUser.username}/preferences`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch preferences");
        return res.json();
      })
      .then((payload) => {
        setLiked(payload.data?.likes || []);
        setDisliked(payload.data?.dislikes || []);
      })
      .catch((err) => {
        console.error("Failed to load bug preferences:", err);
        setLiked([]);
        setDisliked([]);
      })
      .finally(() => setLoading(false));
  }, [profileUser?.username]);

  return (
    <div className="flex flex-col md:flex-row gap-2 mt-5 items-baseline xl:max-w-125">
      {/* Liked Bugs */}
      <div className="px-3 py-1 bg-[rgb(249,215,249)] rounded-2xl flex gap-1 w-full md:w-fit ">
        <svg
          width="14"
          height="16"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.6667 13.3333H3.33333V4.66667L8 0L8.83333 0.833333C8.91111 0.911111 8.975 1.01667 9.025 1.15C9.075 1.28333 9.1 1.41111 9.1 1.53333V1.76667L8.36667 4.66667H12.6667C13.0222 4.66667 13.3333 4.8 13.6 5.06667C13.8667 5.33333 14 5.64444 14 6V7.33333C14 7.41111 13.9889 7.49444 13.9667 7.58333C13.9444 7.67222 13.9222 7.75556 13.9 7.83333L11.9 12.5333C11.8 12.7556 11.6333 12.9444 11.4 13.1C11.1667 13.2556 10.9222 13.3333 10.6667 13.3333ZM4.66667 12H10.6667L12.6667 7.33333V6H6.66667L7.56667 2.33333L4.66667 5.23333V12ZM4.66667 5.23333V6V7.33333V12V5.23333ZM3.33333 4.66667V6H1.33333V12H3.33333V13.3333H0V4.66667H3.33333Z"
            fill="#5d0866"
          />
        </svg>
        <div className="w-fit text-[rgb(93,8,102)] text-xs font-medium overflow-hidden max-h-8 text-ellipsis line-clamp-2">
          Likes:&nbsp;
          {loading ? (
            <span>...</span>
          ) : liked.length === 0 ? (
            <span>---</span>
          ) : (
            <span>
              {liked.map((bug, index) => (
                <span key={bug._id}>
                    {(index != liked.length - 1) &&
                        <span>{bug.speciesCommon}, </span>
                    }
                </span>
              ))}
              {liked[liked.length - 1].speciesCommon}
            </span>
          )}
        </div>
      </div>

      {/* Disliked Bugs */}
      <div className="px-3 py-1 bg-zinc-100 rounded-2xl flex gap-1 w-full md:w-fit ">
        <svg
          width="14"
          height="16"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.33333 0H10.6667V8.66667L6 13.3333L5.16667 12.5C5.08889 12.4222 5.025 12.3167 4.975 12.1833C4.925 12.05 4.9 11.9222 4.9 11.8V11.5667L5.63333 8.66667H1.33333C0.977778 8.66667 0.666667 8.53333 0.4 8.26667C0.133333 8 0 7.68889 0 7.33333V6C0 5.92222 0.0111111 5.83889 0.0333333 5.75C0.0555556 5.66111 0.0777778 5.57778 0.1 5.5L2.1 0.8C2.2 0.577778 2.36667 0.388889 2.6 0.233333C2.83333 0.0777778 3.07778 0 3.33333 0ZM9.33333 1.33333H3.33333L1.33333 6V7.33333H7.33333L6.43333 11L9.33333 8.1V1.33333ZM9.33333 8.1V7.33333V6V1.33333V8.1ZM10.6667 8.66667V7.33333H12.6667V1.33333H10.6667V0H14V8.66667H10.6667Z"
            fill="#191C1D"
          />
        </svg>
        <div className="w-fit text-[#191C1D] text-xs font-medium overflow-hidden max-h-8 text-ellipsis line-clamp-2">
          Dislikes:&nbsp;
          {loading ? (
            <span>...</span>
          ) : disliked.length === 0 ? (
            <span>---</span>
          ) : (
            <span>
              {disliked.map((bug, index) => (
                <span key={bug._id}>
                    {(index != disliked.length - 1) &&
                        <span>{bug.speciesCommon}, </span>
                    }
                </span>
              ))}
              {disliked[disliked.length - 1].speciesCommon}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default BugPreference;
