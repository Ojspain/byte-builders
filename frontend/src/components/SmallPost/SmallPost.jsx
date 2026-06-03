import { Link, useNavigate } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import Interaction from '../Post/Interaction';
import diagonalArrow from "../../assets/diagonalArrow.svg";
import superHeart from "../../assets/superHeart.svg";

function SmallPost({ post, hasAuthor, canDelete = false, onDelete }) {
    const navigate = useNavigate();

    // Disambiguates whether the user meant to go to the post, the authors profile, or the species page after clicking
    const handleCardClick = (e) => {
        if (e.target.closest('a') || e.target.closest('button')) {
            return;
        }
        navigate(`/post/${post._id}`);
    };

    return (
        <div
            key={post._id}
            onClick={handleCardClick}
            className='cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white'
        >
            {/* Post Image */}
            <div className='relative h-48 overflow-hidden bg-zinc-200'>
                <img
                    src={post.imageUrl}
                    alt={post.speciesCommon}
                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                />
                {/* Author Badge */}
                {hasAuthor &&
                    <Link
                        to={`/profile/${post.authorName}`}
                        className='absolute top-2 left-2 bg-stone-900/80 text-white px-2 py-1 rounded text-xs font-semibold hover:underline'
                    >
                        {post.authorName}
                    </Link>
                }
            </div>

            {/* Post Info */}
            <div className='p-4 flex flex-col justify-between h-70'>
                <section className="h-fit">
                    <div className='flex flex-col xl:flex-row gap-1.5 items-baseline mb-2'>
                        <h3 className='font-bold text-sm'>{post.speciesCommon}</h3>
                        <Link
                            to={`/species/${post.speciesActual}`}
                            className='text-zinc-500 text-xs font-semibold hover:text-emerald-600 hover:underline transition-colors cursor-pointer whitespace-nowrap flex gap-1 mr-1'
                        >
                            ({post.speciesActual})
                            <img src={diagonalArrow} className="w-1.5 h-4" alt="arrow" />
                        </Link>
                    </div>
                    <p className='text-zinc-700 text-sm mb-3 line-clamp-2 min-h-10'>
                        {post.textContent}
                    </p>
                    <div className="mb-3 flex gap-2">
                        <StarRating rating={post.rating} />
                        {post.heart &&
                            <img src={superHeart} className="mt-2 size-3.5" alt="heart" />
                        }
                    </div>
                </section>

                <section>
                    {/* Tags Preview */}
                    <div className='flex gap-1 flex-wrap mb-2'>
                        {post.tags.slice(0, 2).map((tag, idx) => (
                            <span
                                key={idx}
                                className='bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded'
                            >
                                {tag}
                            </span>
                        ))}
                        {post.tags.length > 2 && (
                            <span className='text-zinc-500 text-xs px-2 py-1'>
                                +{post.tags.length - 2} more
                            </span>
                        )}
                    </div>

                    {/* Engagement Stats */}
                    <div className='border-t pt-2 flex items-center justify-between gap-2'>
                        <Interaction
                            targetType="post"
                            targetId={post._id}
                            likeCount={post.likeCount}
                            sprayCount={post.sprayCount}
                        />
                        {canDelete && (
                            <button
                                type="button"
                                className='text-xs font-semibold text-red-600 hover:text-red-700'
                                onClick={() => onDelete && onDelete(post._id)}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default SmallPost;