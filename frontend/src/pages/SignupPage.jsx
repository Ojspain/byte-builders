import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import bugLogo from "../assets/bugLogo.svg";
import beetle from "../assets/beetle.jpg";
import arrowRight from "../assets/arrowRight.svg";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!username || username.trim().length < 4) {
      return "Username must be at least 4 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return "Invalid email format.";
    }

    if (!password || password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    //   - Password must be typed correctly both times.
    if (!confirmPassword || password !== confirmPassword) {
      return "Passwords must match.";
    }

    // Everything passes
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      // const data = await response.json();

      if (!response.ok) {
        const message = data.error || "Signup failed.";
        setError(message);
        toast.error(error);
        return;
      }

      localStorage.setItem("User", JSON.stringify(data.user));
      toast.success("Account successfully created. Welcome!");
      navigate("/profile");
    } catch (err) {
      console.error("Network error", err);
      setError("Network error. Check the server is running.");
      toast.error(error);
    }
  };

  return (
    <>
      <section className="w-screen h-screen z-200 bg-white absolute top-0 left-0">
        <Link
          to="/"
          className="flex absolute gap-2 m-3 w-fit rounded-full bg-zinc-200 px-4 pt-1.5 pb-2 font-semibold z-1 shadow-md border border-zinc-300"
        >
          <img
            src={arrowRight}
            alt="<--"
            className="rotate-180 size-5 mt-0.5"
          />
          Back to Home
        </Link>

        <div className="absolute size-96 opacity-30 mix-blend-multiply bg-green-500/50 rounded-full blur-[32px]" />
        <div className="absolute right-0 top-[50%] size-80 opacity-30 mix-blend-multiply bg-fuchsia-400/35 rounded-full blur-[32px]" />
        <div className="absolute bottom-0 left-[20%] size-96 opacity-20 mix-blend-multiply bg-blue-400/50 rounded-full blur-[32px]" />

        <div className="flex justify-center gap-10 items-center h-full">
          {/* Image Card */}
          <div className="hidden lg:flex h-96 relative z-1">
            {/* Image */}
            <img
              className="size-96 max-w-96 relative origin-top-left rotate-3 rounded-4xl shadow-xl border-4 border-white"
              src={beetle}
            />
            {/* Tag */}
            <div className="size- px-6 py-3 left-[50%] absolute bg-white rounded-full outline outline-zinc-200 flex gap-2">
              <img src={bugLogo} className="size-4" />
              <div className="justify-center text-zinc-900 text-xs font-semibold tracking-wide whitespace-nowrap">
                Start Exploring
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="w-full max-w-96 lg:max-w-120 px-10 py-8 bg-white rounded-xl shadow-xl outline outline-zinc-200 flex flex-col gap-10 z-1">
            {/* Text Header */}
            <div className="flex flex-col gap-2 items-center">
              <div className="size-16 py-3.5 bg-green-500/20 rounded-full flex justify-center items-center">
                <svg
                  width="26"
                  height="25"
                  viewBox="0 0 26 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5 25C10.7708 25 9.14583 24.6719 7.625 24.0156C6.10417 23.3594 4.78125 22.4688 3.65625 21.3438C2.53125 20.2188 1.64062 18.8958 0.984375 17.375C0.328125 15.8542 0 14.2292 0 12.5C0 10.7708 0.328125 9.14583 0.984375 7.625C1.64062 6.10417 2.53125 4.78125 3.65625 3.65625C4.78125 2.53125 6.10417 1.64062 7.625 0.984375C9.14583 0.328125 10.7708 0 12.5 0C15.5417 0 18.2031 0.953125 20.4844 2.85938C22.7656 4.76562 24.1875 7.15625 24.75 10.0312H22.1875C21.7917 8.51042 21.0781 7.15104 20.0469 5.95312C19.0156 4.75521 17.75 3.85417 16.25 3.25V3.75C16.25 4.4375 16.0052 5.02604 15.5156 5.51562C15.026 6.00521 14.4375 6.25 13.75 6.25H11.25V8.75C11.25 9.10417 11.1302 9.40104 10.8906 9.64062C10.651 9.88021 10.3542 10 10 10H7.5V12.5H10V16.25H8.75L2.75 10.25C2.6875 10.625 2.63021 11 2.57812 11.375C2.52604 11.75 2.5 12.125 2.5 12.5C2.5 15.2292 3.45833 17.5729 5.375 19.5312C7.29167 21.4896 9.66667 22.4792 12.5 22.5V25ZM23.875 24.375L19.875 20.375C19.4375 20.625 18.9688 20.8333 18.4688 21C17.9688 21.1667 17.4375 21.25 16.875 21.25C15.3125 21.25 13.9844 20.7031 12.8906 19.6094C11.7969 18.5156 11.25 17.1875 11.25 15.625C11.25 14.0625 11.7969 12.7344 12.8906 11.6406C13.9844 10.5469 15.3125 10 16.875 10C18.4375 10 19.7656 10.5469 20.8594 11.6406C21.9531 12.7344 22.5 14.0625 22.5 15.625C22.5 16.1875 22.4167 16.7188 22.25 17.2188C22.0833 17.7188 21.875 18.1875 21.625 18.625L25.625 22.625L23.875 24.375ZM16.875 18.75C17.75 18.75 18.4896 18.4479 19.0938 17.8438C19.6979 17.2396 20 16.5 20 15.625C20 14.75 19.6979 14.0104 19.0938 13.4062C18.4896 12.8021 17.75 12.5 16.875 12.5C16 12.5 15.2604 12.8021 14.6562 13.4062C14.0521 14.0104 13.75 14.75 13.75 15.625C13.75 16.5 14.0521 17.2396 14.6562 17.8438C15.2604 18.4479 16 18.75 16.875 18.75Z"
                    fill="#006D37"
                  />
                </svg>
              </div>

              <div className="pt-1 w-72 h-10 text-center text-zinc-900 text-3xl font-bold">
                Join the Expedition
              </div>
              <div className="w-80 h-5 text-center text-zinc-700 text-sm font-normal">
                Create your account to start tracking species.
              </div>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-6">
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {/* Name */}
                <div className="flex flex-col gap-1 relative">
                  <label
                    htmlFor="username"
                    className="text-xs font-bold tracking-wide"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="BugHunter47"
                    id="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="pl-10 bg-zinc-100 rounded-full h-12"
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
                <div className="flex flex-col gap-1 relative">
                  <label
                    htmlFor="email"
                    className="text-xs font-bold tracking-wide"
                  >
                    Email Address
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

                {/* Password */}
                <div className="flex flex-col gap-1 relative">
                  <label
                    htmlFor="password"
                    className="text-xs font-bold tracking-wide"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="pl-10 bg-zinc-100 rounded-full h-12"
                  />
                  {/* svg */}
                  <div className="h-12 pl-4 absolute top-9">
                    <svg
                      width="16"
                      height="21"
                      viewBox="0 0 16 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 21C1.45 21 0.979167 20.8042 0.5875 20.4125C0.195833 20.0208 0 19.55 0 19V9C0 8.45 0.195833 7.97917 0.5875 7.5875C0.979167 7.19583 1.45 7 2 7H3V5C3 3.61667 3.4875 2.4375 4.4625 1.4625C5.4375 0.4875 6.61667 0 8 0C9.38333 0 10.5625 0.4875 11.5375 1.4625C12.5125 2.4375 13 3.61667 13 5V7H14C14.55 7 15.0208 7.19583 15.4125 7.5875C15.8042 7.97917 16 8.45 16 9V19C16 19.55 15.8042 20.0208 15.4125 20.4125C15.0208 20.8042 14.55 21 14 21H2ZM2 19H14V9H2V19ZM8 16C8.55 16 9.02083 15.8042 9.4125 15.4125C9.80417 15.0208 10 14.55 10 14C10 13.45 9.80417 12.9792 9.4125 12.5875C9.02083 12.1958 8.55 12 8 12C7.45 12 6.97917 12.1958 6.5875 12.5875C6.19583 12.9792 6 13.45 6 14C6 14.55 6.19583 15.0208 6.5875 15.4125C6.97917 15.8042 7.45 16 8 16ZM5 7H11V5C11 4.16667 10.7083 3.45833 10.125 2.875C9.54167 2.29167 8.83333 2 8 2C7.16667 2 6.45833 2.29167 5.875 2.875C5.29167 3.45833 5 4.16667 5 5V7ZM2 19V9V19Z"
                        fill="#71717b"
                      />
                    </svg>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1 relative">
                  <label
                    htmlFor="confirmPassword"
                    className="text-xs font-bold tracking-wide"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="pl-10 bg-zinc-100 rounded-full h-12"
                  />
                  {/* svg */}
                  <div className="h-12 pl-4 absolute top-9">
                    <svg
                      width="16"
                      height="21"
                      viewBox="0 0 16 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 21C1.45 21 0.979167 20.8042 0.5875 20.4125C0.195833 20.0208 0 19.55 0 19V9C0 8.45 0.195833 7.97917 0.5875 7.5875C0.979167 7.19583 1.45 7 2 7H3V5C3 3.61667 3.4875 2.4375 4.4625 1.4625C5.4375 0.4875 6.61667 0 8 0C9.38333 0 10.5625 0.4875 11.5375 1.4625C12.5125 2.4375 13 3.61667 13 5V7H14C14.55 7 15.0208 7.19583 15.4125 7.5875C15.8042 7.97917 16 8.45 16 9V19C16 19.55 15.8042 20.0208 15.4125 20.4125C15.0208 20.8042 14.55 21 14 21H2ZM2 19H14V9H2V19ZM8 16C8.55 16 9.02083 15.8042 9.4125 15.4125C9.80417 15.0208 10 14.55 10 14C10 13.45 9.80417 12.9792 9.4125 12.5875C9.02083 12.1958 8.55 12 8 12C7.45 12 6.97917 12.1958 6.5875 12.5875C6.19583 12.9792 6 13.45 6 14C6 14.55 6.19583 15.0208 6.5875 15.4125C6.97917 15.8042 7.45 16 8 16ZM5 7H11V5C11 4.16667 10.7083 3.45833 10.125 2.875C9.54167 2.29167 8.83333 2 8 2C7.16667 2 6.45833 2.29167 5.875 2.875C5.29167 3.45833 5 4.16667 5 5V7ZM2 19V9V19Z"
                        fill="#71717b"
                      />
                    </svg>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="mt-5 h-12 bg-emerald-800 rounded-full flex justify-center items-center gap-3 cursor-pointer"
                >
                  <div className="text-white text-sm font-bold tracking-wide">
                    Create Account
                  </div>
                  <svg
                    width="19"
                    height="14"
                    viewBox="0 0 19 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.1667 8.33333V5.83333H11.6667V4.16667H14.1667V1.66667H15.8333V4.16667H18.3333V5.83333H15.8333V8.33333H14.1667ZM6.66667 6.66667C5.75 6.66667 4.96528 6.34028 4.3125 5.6875C3.65972 5.03472 3.33333 4.25 3.33333 3.33333C3.33333 2.41667 3.65972 1.63194 4.3125 0.979167C4.96528 0.326389 5.75 0 6.66667 0C7.58333 0 8.36806 0.326389 9.02083 0.979167C9.67361 1.63194 10 2.41667 10 3.33333C10 4.25 9.67361 5.03472 9.02083 5.6875C8.36806 6.34028 7.58333 6.66667 6.66667 6.66667ZM0 13.3333V11C0 10.5278 0.121528 10.0938 0.364583 9.69792C0.607639 9.30208 0.930556 9 1.33333 8.79167C2.19444 8.36111 3.06944 8.03819 3.95833 7.82292C4.84722 7.60764 5.75 7.5 6.66667 7.5C7.58333 7.5 8.48611 7.60764 9.375 7.82292C10.2639 8.03819 11.1389 8.36111 12 8.79167C12.4028 9 12.7257 9.30208 12.9688 9.69792C13.2118 10.0938 13.3333 10.5278 13.3333 11V13.3333H0ZM1.66667 11.6667H11.6667V11C11.6667 10.8472 11.6285 10.7083 11.5521 10.5833C11.4757 10.4583 11.375 10.3611 11.25 10.2917C10.5 9.91667 9.74306 9.63542 8.97917 9.44792C8.21528 9.26042 7.44444 9.16667 6.66667 9.16667C5.88889 9.16667 5.11806 9.26042 4.35417 9.44792C3.59028 9.63542 2.83333 9.91667 2.08333 10.2917C1.95833 10.3611 1.85764 10.4583 1.78125 10.5833C1.70486 10.7083 1.66667 10.8472 1.66667 11V11.6667ZM6.66667 5C7.125 5 7.51736 4.83681 7.84375 4.51042C8.17014 4.18403 8.33333 3.79167 8.33333 3.33333C8.33333 2.875 8.17014 2.48264 7.84375 2.15625C7.51736 1.82986 7.125 1.66667 6.66667 1.66667C6.20833 1.66667 5.81597 1.82986 5.48958 2.15625C5.16319 2.48264 5 2.875 5 3.33333C5 3.79167 5.16319 4.18403 5.48958 4.51042C5.81597 4.83681 6.20833 5 6.66667 5Z"
                      fill="white"
                    />
                  </svg>
                </button>

                {error && <p className="Form-error">{error}</p>}
              </form>
            </div>

            {/* Link to Login page */}
            <div className="flex justify-center items-center gap-1">
              <div className="text-sm font-normal">
                Already part of the expedition?{" "}
              </div>
              <Link
                to="/login"
                className="text-purple-800 text-xs font-bold underline tracking-wide cursor-pointer"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SignupPage;
