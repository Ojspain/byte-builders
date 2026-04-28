import './Tags.css';
import { useState } from 'react';
import plus from "../../assets/plus.svg";
import minus from "../../assets/minus.svg";

function Tags({ location, tags }) {
    const tagCnt = tags.length;
    const [isOpen, setIsOpen] = useState(false);
    const [expImg, setExpImg] = useState(plus);

    const handleClick = () => {
        setIsOpen(!isOpen);
        if (isOpen) {
            setExpImg(plus);
        } else {
            setExpImg(minus);
        }
    }

    return (
        <>
            <div className='w-full'>
                <div className="pt-2 pb-1 w-full flex justify-between">
                    <div className="flex gap-1.5">
                        {location} &bull;

                        {tags.slice(0, 4).map((tag, i) => (
                            <div key={i} className="tag">{tag}</div>
                        ))}
                    </div >

                    {tagCnt > 4 &&
                        <button onClick={handleClick}>
                            <img src={expImg} alt="Expand" className='h-5' />
                        </button>
                    }
                </div>

                {tagCnt > 4 && isOpen &&
                    tags.slice(4).map((tag, i) => (
                        <div key={i} className="tag">{tag}</div>
                    ))
                }
            </div>
        </>
    )
}
export default Tags
