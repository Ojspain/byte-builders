import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Post from "../components/Post/Post";

function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [authorPfpUrl, setAuthorPfpUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`);
        if (!response.ok) {
          throw new Error("Post not found");
        }
        const data = await response.json();
        setPost(data);

        // Specifically gets the pfp Url of the post author
        const response_2 = await fetch(`/api/users/${data.authorName}`);
        if (!response_2.ok) {
          throw new Error("Author not found ");
        }
        const data_2 = await response_2.json();
        setAuthorPfpUrl(data_2.profilePicUrl);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handlePostDeleted = () => {
    // send to home if the post is deleted
    navigate("/");
  };

  if (loading) {
    return (
      <div className="w-full pt-20 text-center text-zinc-500">
        Loading post...
      </div>
    );
  }

  if (error) {
    return <div className="w-full pt-20 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="w-full h-full justify-center content-center px-4">
      {post && <Post {...post} authorProfilePicUrl={authorPfpUrl} onPostDeleted={handlePostDeleted} />}
    </div>
  );
}

export default PostPage;
