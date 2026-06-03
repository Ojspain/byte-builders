import { Link } from "react-router-dom";
import bugLogo from "../../assets/bugLogo.svg";

function NotificationItem({ notification, closeMenu, onMarkAsRead }) {
  const { actorId, type, read, postId, commentId } = notification;

  const profilePic = actorId?.profilePicUrl || bugLogo;
  const username = actorId?.username || "System";

  // Extract and truncate the comment text
  const rawText = commentId?.commentText || "";
  const previewText =
    rawText.length > 30 ? `${rawText.substring(0, 30)}...` : rawText;

  // Follow notifications route to the user's profile, others to the post
  const destinationLink = type === "follow" ? `/profile/${username}` : `/post/${postId}`;

  return (
    <Link
      to={destinationLink}
      onClick={() => {
        if (!read) onMarkAsRead(notification._id);
        closeMenu();
      }}
      className={`flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-100 transition-colors border-b border-zinc-100 ${!read ? "bg-zinc-50" : ""}`}
    >
      <img
        src={profilePic}
        alt={username}
        className="w-10 h-10 rounded-full object-cover border border-zinc-200"
      />

      <div className="flex-1 text-sm text-zinc-700 leading-tight">
        <span className="font-bold text-[#006D37]">{username}</span>

        {type === "comment" && (
          <span> commented on your post: "{previewText}"</span>
        )}
        {type === "like" && (
          <span> liked your post.</span>
        )}
        {type === "spray" && (
          <span> sprayed your post.</span>
        )}
        {type === "follow" && (
          <span> started following you.</span>
        )}
      </div>

      {!read && (
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></div>
      )}
    </Link>
  );
}

export default NotificationItem;