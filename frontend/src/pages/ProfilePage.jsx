import bugLogo from "../assets/bugLogo.svg";
import dummy from '../dummy_db.json';
import SmallPost from "../components/SmallPost/SmallPost";

function ProfilePage() {

    // temporary stand-in
    // copied form dummy_db, but I felt it would be a different call than sorting all users
    const user = {
        "_id": "1",
        "username": "CicadaSpotter891",
        "email": "cicadaspotter891@example.com",
        "passwordHash": "hashed_pass_3347",
        "bio": "Ad sed ut ut elit.",
        "profilePicUrl": "https://csciprojects.us/342/Lessons/L6/user%20%284%29.jpg",
        "followerCount": 1,
        "followingCount": 2,
        "createdAt": "2025-12-30T11:57:07.644Z"
    }

    const date = new Date(user.createdAt);
    const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const posts = dummy.posts;

    return (
        <>
            <section className="flex flex-col gap-6">
                <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200 flex gap-6 mb-6">
                    <img className="size-32 max-w-248 relative rounded-full border-4 border-gray-100" src={user.profilePicUrl} />

                    <div className="flex flex-col w-full">
                        <div className="text-[#191C1D] text-3xl font-bold">{user.username}</div>

                        <div className="text-slate-700 text-base font-normal">
                            {user.bio}
                        </div>

                        <div className="flex gap-2 mt-5 items-baseline xl:max-w-125">
                            <div className="px-3 py-1 bg-[rgb(249,215,249)] rounded-2xl flex gap-1">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.6667 13.3333H3.33333V4.66667L8 0L8.83333 0.833333C8.91111 0.911111 8.975 1.01667 9.025 1.15C9.075 1.28333 9.1 1.41111 9.1 1.53333V1.76667L8.36667 4.66667H12.6667C13.0222 4.66667 13.3333 4.8 13.6 5.06667C13.8667 5.33333 14 5.64444 14 6V7.33333C14 7.41111 13.9889 7.49444 13.9667 7.58333C13.9444 7.67222 13.9222 7.75556 13.9 7.83333L11.9 12.5333C11.8 12.7556 11.6333 12.9444 11.4 13.1C11.1667 13.2556 10.9222 13.3333 10.6667 13.3333ZM4.66667 12H10.6667L12.6667 7.33333V6H6.66667L7.56667 2.33333L4.66667 5.23333V12ZM4.66667 5.23333V6V7.33333V12V5.23333ZM3.33333 4.66667V6H1.33333V12H3.33333V13.3333H0V4.66667H3.33333Z" fill="#5d0866" />
                                </svg>
                                <div className="text-[rgb(93,8,102)] text-xs font-medium overflow-hidden max-w-30 xl:max-w-full max-h-8 text-ellipsis line-clamp-2">Likes: Rhinoceros Beetles,  Wasps, Tarantula, Lobster</div>
                            </div>

                            <div className="px-3 py-1 bg-zinc-100 rounded-2xl flex gap-1">
                                <svg width="14" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.33333 0H10.6667V8.66667L6 13.3333L5.16667 12.5C5.08889 12.4222 5.025 12.3167 4.975 12.1833C4.925 12.05 4.9 11.9222 4.9 11.8V11.5667L5.63333 8.66667H1.33333C0.977778 8.66667 0.666667 8.53333 0.4 8.26667C0.133333 8 0 7.68889 0 7.33333V6C0 5.92222 0.0111111 5.83889 0.0333333 5.75C0.0555556 5.66111 0.0777778 5.57778 0.1 5.5L2.1 0.8C2.2 0.577778 2.36667 0.388889 2.6 0.233333C2.83333 0.0777778 3.07778 0 3.33333 0ZM9.33333 1.33333H3.33333L1.33333 6V7.33333H7.33333L6.43333 11L9.33333 8.1V1.33333ZM9.33333 8.1V7.33333V6V1.33333V8.1ZM10.6667 8.66667V7.33333H12.6667V1.33333H10.6667V0H14V8.66667H10.6667Z" fill="#191C1D" />
                                </svg>
                                <div className="text-[#191C1D] text-xs font-medium overflow-hidden max-w-30 xl:max-w-full max-h-8 text-ellipsis line-clamp-2">Dislikes: Ants, Bees</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 w-45 h-8 py-2 px-3 relative bg-zinc-100 rounded-full cursor-pointer">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.5 12H2.56875L9.9 4.66875L8.83125 3.6L1.5 10.9312V12ZM0 13.5V10.3125L9.9 0.43125C10.05 0.29375 10.2156 0.1875 10.3969 0.1125C10.5781 0.0375 10.7688 0 10.9688 0C11.1687 0 11.3625 0.0375 11.55 0.1125C11.7375 0.1875 11.9 0.3 12.0375 0.45L13.0688 1.5C13.2188 1.6375 13.3281 1.8 13.3969 1.9875C13.4656 2.175 13.5 2.3625 13.5 2.55C13.5 2.75 13.4656 2.94062 13.3969 3.12188C13.3281 3.30313 13.2188 3.46875 13.0688 3.61875L3.1875 13.5H0ZM12 2.55L10.95 1.5L12 2.55ZM9.35625 4.14375L8.83125 3.6L9.9 4.66875L9.35625 4.14375Z" fill="#191C1D" />
                        </svg>

                        <div className="text-center whitespace-nowrap text-[#191C1D] text-xs font-semibold tracking-wide">Edit Profile</div>
                    </div>
                </div>

                <section className="flex flex-col lg:flex-row gap-6">
                    <section className="flex lg:flex-2 justify-center gap-6">
                        <div className="px-6 py-4 bg-white rounded-full shadow-md border border-gray-200 flex gap-3 w-full justify-center items-center">
                            <div className="text-[#191C1D] text-lg font-bold">Followers:</div>
                            <div className="text-slate-700 text-lg font-normal">
                                {user.followerCount}
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-white rounded-full shadow-md border border-gray-200 flex gap-3 w-full justify-center items-center">
                            <div className="text-[#191C1D] text-lg font-bold">Following:</div>
                            <div className="text-slate-700 text-lg font-normal">
                                {user.followingCount}
                            </div>
                        </div>
                    </section>

                    <div className="lg:flex-1 p-6 bg-white rounded-full shadow-md border border-gray-200 flex flex-col w-full text-center">
                        <div className="text-[#191C1D] text-lg font-bold">Member Since</div>
                        <div className="text-slate-700 text-md font-normal">
                            {formattedDate}
                        </div>
                    </div>
                </section>
            </section>

            <div className="flex gap-3 mt-16 mb-8">
                <img src={bugLogo} className="h-7 mt-1" />

                <h1 className='text-3xl font-bold'>Discoveries</h1>
            </div>

            <section className="grid grid-cols-3 gap-6">
                {posts.map((post) => (
                    <SmallPost post={post} hasAuthor={false} />
                ))}
            </section>

        </>
    )
}

export default ProfilePage
