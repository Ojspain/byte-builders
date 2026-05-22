import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import arrowRight from "../../assets/arrowRight.svg";

function SpeciesSearchResult({ species }) {
    const [info, setInfo] = useState(null);

    useEffect(() => {
        if (!species) {
            setInfo(null);
            return;
        }
        const searchTerm = species.split("(")[0].trim();
        if (!searchTerm) return;

        fetch(`/api/species?search=${encodeURIComponent(searchTerm)}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.length > 0) {
                    setInfo({
                        actual: data[0].speciesActual,
                        common: data[0].speciesCommon,
                        image: data[0].imageUrl,
                    });
                } else {
                    setInfo(null);
                }
            })
            .catch(() => setInfo(null));
    }, [species]);

    return (
        <>
            {species && info && (
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

export default SpeciesSearchResult;
