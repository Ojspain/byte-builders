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
                <li
                    key="reset"
                    className="reset"
                    onClick={() => handleSortByChange("reset")}
                >
                    <svg fill="#000000" width="12px" height="12px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M960 0v213.333c411.627 0 746.667 334.934 746.667 746.667S1371.627 1706.667 960 1706.667 213.333 1371.733 213.333 960c0-197.013 78.4-382.507 213.334-520.747v254.08H640V106.667H53.333V320h191.04C88.64 494.08 0 720.96 0 960c0 529.28 430.613 960 960 960s960-430.72 960-960S1489.387 0 960 0" fillRule="evenodd"></path> </g></svg>
                </li>
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
