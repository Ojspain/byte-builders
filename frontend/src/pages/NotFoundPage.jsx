import { Link } from "react-router-dom";
import bugLogo from "../assets/bugLogo.svg";
import cup from "../assets/cup.svg"

function SearchPage() {

    return (
        <>
            <section className="w-screen min-h-screen z-200 bg-white absolute top-0 left-0 flex justify-center items-center pb-20 ">
                {/* Logo */}
                <div className="flex flex-col items-center gap-7 shadow-xl rounded-full w-125 h-125 p-20 justify-center">
                    <div className="flex relative">
                        <img src={cup} className="absolute left-[-60%] w-18 max-w-none mt-0.5 rotate-180 scale-y-90" />
                        <img src={bugLogo} className="pt-10 w-8" />
                    </div>
                    <p className="text-2xl">Uh oh! This page doesn't exist.</p>
                    <Link to="/" className="p-3 w-60 text-center bg-emerald-700 text-lg text-white hover:bg-emerald-400 hover:text-black hover:-translate-y-1 transition-all rounded-xl">Go back Home</Link>
                </div>
            </section>
        </>
    )
}

export default SearchPage
