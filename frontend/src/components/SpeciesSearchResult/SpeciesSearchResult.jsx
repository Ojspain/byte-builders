import { Link } from "react-router-dom";
import dummy from "../../dummy_db.json";
import arrowRight from "../../assets/arrowRight.svg";

function SpeciesSearchResult({ species }) {
    const options = {
        "Most Liked": "most_liked",
        "Most Sprayed": "most_sprayed",
        "Posted Today": "posted_today"
    };

    const speciesInfo = () => {
        if (!species) return "";

        // Search content before parenthesees
        let searchTerm = species.split("(")[0].trim().toLowerCase();
        let result = dummy.species.filter((s) =>
            s.speciesCommon.toLowerCase().includes(searchTerm) ||
            s.speciesActual.toLowerCase().includes(searchTerm)
        );

        // Search content ignoring parenthesees
        if (result.length == 0) {
            searchTerm = species.replace(/[()]/g, '').trim().toLowerCase();

            result = dummy.species.filter((s) =>
                s.speciesCommon.toLowerCase().includes(searchTerm) ||
                s.speciesActual.toLowerCase().includes(searchTerm)
            );
        }

        return result.length > 0 ?
            {
                actual: result[0].speciesActual,
                common: result[0].speciesCommon,
                image: result[0].imageUrl
            }
            :
            "";
    };

    const info = speciesInfo();

    return (
        <>
            {species && (info != "") && (
                <Link to={`/species/${info.actual}`} >
                    <div className="flex w-full h-25 border border-zinc-600 rounded-lg overflow-hidden items-center bg-no-repeat bg-cover bg-left max-w-250 m-auto"
                        style={{
                            backgroundImage: `linear-gradient(to right, rgba(245, 245, 245, 0.5), rgba(245, 245, 245, 1) 60%), url(${info.image})`,
                            backgroundSize: 'cover',
                        }}
                    >

                        <img src={info.image} className="h-35 rounded-l-lg mr-5 border-r border-zinc-600" />

                        <div className="flex flex-col">
                            <div className="text-xl font-semibold mr-2">
                                {info.common}
                            </div>
                            ({info.actual})
                        </div>

                        <img src={arrowRight} alt="-->" className="w-10 ml-auto mr-5" />

                    </div>
                </Link>
            )}
        </>
    );

}




export default SpeciesSearchResult
