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
                <img src={imageUrl} className="h-35 rounded-l-lg mr-5 border-r border-zinc-600" />

                <div className="flex flex-col">
                    <div className="text-xl font-semibold mr-2">
                        {speciesCommon}
                    </div>
                    ({speciesActual})
                </div>

                <img src={arrowRight} alt="-->" className="w-10 ml-auto mr-5" />
            </div>
        </Link>
    );
}

export default SpeciesSearchResult;
