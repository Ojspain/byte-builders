import dummy from '../dummy_db.json';
import { Link } from 'react-router-dom';
import { useState } from "react";
import SmallPost from "../components/SmallPost/SmallPost";
import SortBy from "../components/SortBy/SortBy";

function SavedPage() {
    const posts = dummy.posts;
    const options = {
        "Liked": "liked",
        "Sprayed": "sprayed",
    };

    const [sortBy, setSortBy] = useState("");
    const [speciesQuery, setSpeciesQuery] = useState("");

    return (
        <>
            {/* <h1 className='text-3xl font-bold mb-8'>Saved</h1> */}
            <SortBy options={options} sortBy={sortBy} setSortBy={setSortBy} speciesQuery={speciesQuery} setSpeciesQuery={setSpeciesQuery} />

            <div className='grid grid-cols-3 gap-6'>
                {posts.map((post) => (
                    <SmallPost post={post} hasAuthor={true} />
                ))}
            </div>
        </>
    )
}

export default SavedPage
