import SortBy from "../components/SortBy/SortBy";

function SearchPage() {
const options = {
    "Most Liked": "most_liked",
    "Most Sprayed": "most_sprayed",
    "Posted Today": "posted_today"
};

    return (
        <>
        <SortBy options={options} />
        </>
    )
}

export default SearchPage
