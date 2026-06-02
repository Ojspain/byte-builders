import './Tags.css';
import { useState, useEffect } from 'react';
import plus from "../../assets/plus.svg";
import minus from "../../assets/minus.svg";

function Tags({ location, tags }) {
    const tagCnt = tags.length;
    const [isOpen, setIsOpen] = useState(false);
    const [expImg, setExpImg] = useState(plus);
    const [width, setWidth] = useState(window.innerWidth);
    let shown = 4;

    // 768 is md screen width
    width < 768 ? shown = 2 : shown = 4;

    // Handle screen resizing
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };

        width < 768 ? shown = 2 : shown = 4;
    }, []);


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
                    <div className="flex flex-wrap gap-1.5">
                        {location}
                        
                        {tags.length != 0 && <span>&bull;</span>}

                        {tags.slice(0, shown).map((tag, i) => (
                            <div key={i} className="tag">{tag}</div>
                        ))}
                    </div >

                    {tagCnt > shown &&
                        <button onClick={handleClick}>
                            <img src={expImg} alt="Expand" className='h-5' />
                        </button>
                    }
                </div>

                <div className='flex gap-1.5'>
                    {tagCnt > shown && isOpen &&
                        tags.slice(shown).map((tag, i) => (
                            <div key={i} className="tag">{tag}</div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}
export default Tags
