import { useState } from "react";
import "./SortBy.css";
import SelectSpecies from "../SelectSpecies/SelectSpecies";

function SortBy({ options, sortBy, setSortBy, speciesQuery, setSpeciesQuery }) {
    const handleSortByChange = (option) => {
        setSortBy(option);
    };

    const getSortByClass = (option) => {
        return sortBy === option ? 'activeSort' : '';
    }

    return (
        <>
            <h3 className="flex justify-center font-bold text-lg pb-3">Sort By</h3>
            <ul>
                {
                    Object.keys(options).map((option) => {

                        const value = options[option];
                        return (
                            <li
                                key={value}
                                className={getSortByClass(value)}
                                onClick={() => handleSortByChange(value)}
                            >
                                {option}
                            </li>
                        );
                    })
                }
            </ul>

            <div className="selectSpecies">
                <p>Species:</p>
                <div>
                    <SelectSpecies isLabeled={false} speciesQuery={speciesQuery} setSpeciesQuery={setSpeciesQuery} />
                </div>
            </div>
        </>
    );
}

export default SortBy;
