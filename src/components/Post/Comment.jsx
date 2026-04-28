function Comment({ _id, authorId, commentText, createdAt }) {

    return (
        <>
            <div className="flex gap-3 items-start text-sm">
                <div className="w-min justify-center text-zinc-900 font-bold tracking-wide">AuthorName{authorId}:</div>
                <div className="w-fit text-neutral-700">{commentText}</div>
            </div>
        </>
    )
}

export default Comment

