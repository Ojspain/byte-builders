import { Link } from "react-router-dom";
import arrowRight from "../../assets/arrowRight.svg";

function SpeciesSearchResult({ speciesData }) {
    if (!speciesData) return null;

    const { speciesActual, speciesCommon, imageUrl } = speciesData;

    return (
        <Link to={`/species/${speciesActual}`}>
            <div
                className="flex w-full h-25 border border-zinc-600 rounded-lg overflow-hidden items-center bg-no-repeat bg-cover bg-left max-w-250 m-auto"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(245, 245, 245, 0.5), rgba(245, 245, 245, 1) 60%), url(${imageUrl})`,
                    backgroundSize: 'cover',
                }}
            >
                <img src={imageUrl} className="object-cover w-20 h-20 ml-1 md:ml-0 rounded-full md:w-40 md:h-35 md:rounded-r-none md:rounded-l-lg mr-5 md:border-r border-zinc-600" />

                <div className="flex flex-col">
                    <div className="text-sm md:text-xl font-semibold mr-2">
                        {speciesCommon}
                    </div>
                    <div className="text-xs md:text-md">
                        ({speciesActual})
                    </div>
                </div>

                <img src={arrowRight} alt="-->" className="w-5 md:w-10 ml-auto mr-5" />
            </div>
        </Link>
    );
}

export default SpeciesSearchResult;
