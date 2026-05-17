function Comment({ author, commentText, createdAt }) {
  // just in case
  if (!author) {
    return <div className="text-sm text-neutral-500">Unknown user</div>;
  }

  return (
    <div className="flex gap-3 items-start text-sm">
      <img
        src={author.profilePicUrl}
        alt={`${author.username} profile`}
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="w-min justify-center text-zinc-900 font-bold tracking-wide">
        {author.username}:
      </div>
      <div className="w-fit text-neutral-700">{commentText}</div>
    </div>
  );
}

export default Comment;
