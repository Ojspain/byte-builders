import './StarRating.css';
import filledStar from "../../assets/filledStar.svg";
import hollowStar from "../../assets/hollowStar.svg";

function StarRating({ rating }) {
    const element = [];
    for (let i = 0; i < rating; i++) {
        element.push(<img key={i} src={filledStar} />);
    }
    for (let i = rating; i < 5; i++) {
        element.push(<img key={i} src={hollowStar} />);
    }

    return (
        <>
            <div className="pt-1.5 flex gap-1.5">
                {element}
            </div>
        </>
    )
}
export default StarRating