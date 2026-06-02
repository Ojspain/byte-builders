import bell from "../../assets/bell.svg";
import settings from "../../assets/settings.svg";
import bugLogo from "../../assets/bugLogo.svg";
import cup from "../../assets/cup.svg";
import ham from "../../assets/ham.svg";
import NavItem from "./NavItem";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import NotificationItem from "../NotificationItem/NotificationItem";

function SideBar() {
  const [hamOpen, setHamOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const handleHam = () => {
    setHamOpen(!hamOpen);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/");
  };

  const handleNotifToggle = () => {
    setNotifOpen(!notifOpen);
  };

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
          // Calculate unread count from the fetched array
          setUnreadCount(data.filter((n) => !n.read).length);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [user, notifOpen]);

  const handleMarkAsRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/mark-all-read", {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      } else {
        console.error("Failed to mark all as read on the server");
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      await fetch("/api/notifications/clear-all", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };
  return (
    <>
      {/* Top Bar */}
      <div className="w-full h-16 px-10 bg-white border-b border-zinc-100 shadow-xs fixed flex justify-between top-0 left-0 z-99">
        <section className="flex gap-10">
          <button onClick={handleHam} className="lg:hidden">
            <img src={ham} alt="Navigation" className="h-10 cursor-pointer" />
          </button>

          <div className="w-0 hidden sm:flex sm:w-auto pb-5 px-2 relative">
            <div className="absolute w-12 mt-0.5 rotate-180 scale-y-90">
              <img src={cup} />
            </div>

            {/* Logo */}
            <div className="flex lg:hidden pt-4 pl-3 items-center gap-5">
              <img src={bugLogo} className="mt-4" />
              <div className="text-[#006D37] text-3xl font-bold uppercase tracking-wide">
                U<span className="text-xl">nder</span>T
                <span className="text-xl">he</span>C
                <span className="text-xl">up</span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end items-center gap-3">
          {/* Already logged in? Hide the Log In and Sign Up buttons */}
          {!user && (
            <>
              <Link
                to="/login"
                className="text-sm md:text-md rounded-full bg-[#6af39c] text-[#006D37] px-4 pt-1.5 pb-2 font-semibold"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="text-sm md:text-md rounded-full bg-zinc-200 px-4 pt-1.5 pb-2 font-semibold"
              >
                Sign Up
              </Link>
            </>
          )}
          {/* Show the Log Out button instead */}
          {user && (
            <>
              <button
                className="text-sm md:text-md rounded-full bg-zinc-200 px-4 pt-1.5 pb-2 font-semibold cursor-pointer"
                onClick={handleLogout}
              >
                Log Out
              </button>

              {/* Notification Bell */}
              <div
                className="relative ml-3 flex items-center cursor-pointer"
                onClick={handleNotifToggle}
              >
                <img src={bell} alt="Notifications" />

                {unreadCount > 0 && (
                  <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TODO: decide if we want to implement this
                    {/* <img src={settings} alt="Settings" className='cursor-pointer' /> */}
        </div>
      </div>

      {/* Side Bar */}
      <div
        className={`${hamOpen ? "flex" : "hidden lg:flex"} z-100 lg:w-60 h-full p-4 left-0 top-0 fixed bg-white shadow-sm border-r border-zinc-100 flex flex-col`}
      >
        {/* Logo */}
        {!hamOpen ? (
          <div className="pb-10 px-2 flex flex-col items-center relative">
            <div className="absolute w-12 rotate-180 scale-y-90">
              <img src={cup} />
            </div>

            <div className="pt-6 flex flex-col items-center">
              <img src={bugLogo} />
              <div className="text-[#006D37] text-3xl font-bold uppercase tracking-wide">
                U<span className="text-xl">nder</span>T
                <span className="text-xl">he</span>C
                <span className="text-xl">up</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-20 w-60 px-6 -my-1">
            <button onClick={handleHam}>
              <img src={ham} alt="Navigation" className="h-10" />
            </button>
          </div>
        )}

        {/* Search and Library */}
        <div className="flex-1 flex flex-col gap-1 text-xs font-bold tracking-wide">
          {/* Home */}
          <NavItem
            text="Home"
            route="/"
            svg={
              <svg
                width="16"
                height="18"
                viewBox="0 0 16 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 18V6L8 0L16 6V18H10V11H6V18H0Z" fill="#71717b" />
              </svg>
            }
          />
          {/* Search */}
          <NavItem
            text="Search"
            route="/search"
            svg={
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z"
                  fill="#71717b"
                />
              </svg>
            }
          />
          {/* Library */}
          <div className="w-full pt-6 pb-1 px-4">
            <div className="text-zinc-600 text-xs font-medium">LIBRARY</div>
          </div>
          {/* Saved */}
          <NavItem
            text="Saved"
            route="/saved"
            svg={
              <svg
                width="14"
                height="18"
                viewBox="0 0 14 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 18V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H12C12.55 0 13.0208 0.195833 13.4125 0.5875C13.8042 0.979167 14 1.45 14 2V18L7 15L0 18ZM2 14.95L7 12.8L12 14.95V2H2V14.95ZM2 2H12H7H2Z"
                  fill="#71717b"
                />
              </svg>
            }
          />
          {/* Profile */}
          <NavItem
            text="Profile"
            route="/profile"
            svg={
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
            }
          />
        </div>

        {/* Make a */}
        <NavLink
          to="/new-post"
          className="w-full pt-4 border-t border-zinc-200 flex flex-col justify-start items-start gap-4 cursor-pointer"
        >
          <div className="flex w-full h-12 bg-[#6af39c] rounded-full gap-3 items-center justify-center">
            <img src={bugLogo} className="h-6" />
            <div className="text-center justify-center text-[#006D37] text-md font-bold tracking-wide">
              Post New Bug
            </div>
          </div>
        </NavLink>
      </div>

      {/* Notification Overlay Backdrop */}
      {notifOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-99"
          onClick={() => setNotifOpen(false)}
        ></div>
      )}

      {/* Notification Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl border-l border-zinc-200 z-[100] transform transition-transform duration-300 ${notifOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-zinc-100">
          <h2 className="text-xl font-bold text-[#006D37]">Notifications</h2>
          <button
            onClick={() => setNotifOpen(false)}
            className="text-zinc-400 hover:text-zinc-600 font-bold text-2xl"
          >
            &times;
          </button>

          {/* Action Buttons */}
          {notifications.length > 0 && (
            <div className="flex gap-4 text-sm font-semibold">
              <button
                onClick={handleMarkAllAsRead}
                className="text-[#006D37] hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
              <button
                onClick={handleClearAll}
                className="text-red-500 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Notifications Container */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {notifications.length === 0 ? (
            <div className="text-sm text-zinc-500 text-center mt-4">
              No new notifications.
            </div>
          ) : (
            notifications.map((notif) => (
              <NotificationItem
                key={notif._id}
                notification={notif}
                closeMenu={() => setNotifOpen(false)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default SideBar;
