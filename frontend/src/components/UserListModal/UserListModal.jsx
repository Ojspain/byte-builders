import { useState, useEffect } from "react";
import { fetchApi } from "@/fetchApi";
import { Link } from "react-router-dom";
import defaultPfp from "../../assets/defaultPfp.png";

function UserListModal({ isOpen, onClose, username, type }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Clear the state immediately when the modal closes
    if (!isOpen) {
      setUsers([]);
      setError("");
      return;
    }

    if (!username) return;

    const fetchUsers = async () => {
      setIsLoading(true);
      setError("");
      // Extra clear before fetching new data
      setUsers([]);

      try {
        const res = await fetchApi(`/api/users/${username}/${type}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || `Failed to load ${type}`);

        setUsers(data.data.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen, username, type]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-200">
          <h2 className="text-xl font-bold text-[#191C1D] capitalize">
            {type}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-800 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {isLoading && <p className="text-center text-zinc-500">Loading...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}

          {!isLoading && !error && users.length === 0 && (
            <p className="text-center text-zinc-500">No {type} yet.</p>
          )}

          <div className="flex flex-col gap-4">
            {users.map((item) => (
              <Link
                key={item._id}
                to={`/profile/${item.user.username}`}
                onClick={onClose}
                className="flex items-center gap-3 hover:bg-zinc-50 p-2 rounded-lg transition-colors"
              >
                <img
                  src={item.user.profilePicUrl || defaultPfp}
                  alt={item.user.username}
                  className="size-12 rounded-full border border-zinc-200 object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-[#191C1D]">
                    {item.user.username}
                  </span>
                  <span className="text-sm text-zinc-500 line-clamp-1">
                    {item.user.bio || "No bio"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserListModal;
