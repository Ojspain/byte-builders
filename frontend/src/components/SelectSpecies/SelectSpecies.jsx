import { useState, useEffect, useRef } from "react";

function SelectSpecies({ isLabeled, speciesQuery, setSpeciesQuery }) {
    const [speciesCandidates, setSpeciesCandidates] = useState([]);
    const debounceRef = useRef(null);

    useEffect(() => {
        const q = speciesQuery.trim();
        if (!q) {
            setSpeciesCandidates([]);
            return;
        }

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetch(`/api/species?search=${encodeURIComponent(q)}`)
                .then((res) => res.json())
                .then((data) => setSpeciesCandidates(data))
                .catch(() => setSpeciesCandidates([]));
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [speciesQuery]);

    return (
        <>
            <div className="flex flex-col gap-1">
                {isLabeled &&
                    <label className="pl-1 text-xs font-bold uppercase tracking-[0.6px] text-zinc-600">
                        Species
                    </label>
                }
                <div className="relative">
                    {isLabeled &&
                        <svg className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="#71717b" />
                        </svg>
                    }
                    <input
                        type="text"
                        value={speciesQuery}
                        onChange={(e) => setSpeciesQuery(e.target.value)}
                        list="species-suggestions"
                        placeholder="Drosophila melanogaster"
                        className={`${isLabeled ? "pl-12" : "pl-5"} w-full rounded-full border border-[#e1e3e4] bg-[#f8f9fa] py-3.5 pr-4 text-sm text-zinc-600 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none placeholder:text-zinc-400 focus:border-zinc-400`}
                    />
                    <datalist id="species-suggestions">
                        {speciesCandidates.map((s) => (
                            <option
                                key={s._id}
                                value={`${s.speciesActual} (${s.speciesCommon})`}
                            />
                        ))}
                    </datalist>
                </div>
            </div>
        </>
    );
}

export default SelectSpecies;
