import SideBar from '../components/SideBar/SideBar';
import dummy from '../dummy_db.json';
import { Link } from 'react-router-dom';
import StarRating from '../components/StarRating/StarRating';
import Interaction from '../components/Post/Interaction';

function SavedPage() {
    const posts = dummy.posts;

    return (
        <>
            <SideBar />
            {/* Keep at least these styles so the SideBar works */}
            <div className='ml-60 mt-16 p-10'>
                <h1 className='text-3xl font-bold mb-8'>Saved</h1>
                <div className='grid grid-cols-3 gap-6'>
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className='rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white'
                        >
                            {/* Post Image */}
                            <div className='relative h-48 overflow-hidden bg-gray-200'>
                                <img
                                    src={post.imageUrl}
                                    alt={post.speciesCommon}
                                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                                />
                                {/* Author Badge */}
                                <div className='absolute top-2 left-2 bg-stone-900/80 text-white px-2 py-1 rounded text-xs font-semibold'>
                                    {post.authorName}
                                </div>
                            </div>

                            {/* Post Info */}
                            <div className='p-4'>
                                <div className='flex gap-1.5 items-baseline mb-2'>
                                    <h3 className='font-bold text-sm'>{post.speciesCommon}</h3>
                                    <Link
                                        to={`/species/${post.speciesActual}`}
                                        className='text-gray-500 text-xs font-semibold hover:text-emerald-600 hover:underline transition-colors cursor-pointer'
                                    >
                                        ({post.speciesActual})
                                    </Link>
                                </div>
                                <p className='text-gray-700 text-sm mb-3 line-clamp-2 min-h-10'>
                                    {post.textContent}
                                </p>
                                <div className='mb-3'>
                                    <StarRating rating={post.rating} />
                                </div>

                                {/* Tags Preview */}
                                <div className='flex gap-1 flex-wrap mb-3'>
                                    {post.tags.slice(0, 2).map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className='bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded'
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {post.tags.length > 2 && (
                                        <span className='text-gray-500 text-xs px-2 py-1'>
                                            +{post.tags.length - 2} more
                                        </span>
                                    )}
                                </div>

                                {/* Engagement Stats */}
                                <div className='border-t pt-2'>
                                    <Interaction likeCount={post.likeCount} sprayCount={post.sprayCount} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default SavedPage
