import { useEffect, useState } from "react";

import { useAuthenContext } from "../globalContext/globalContext";

interface Comment {
  _id: string;
  username: string;
  userProfileImg?: string;
  content: string;
  createdAt: string;
}

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { loggedIn } = useAuthenContext();


  useEffect(() => {
    console.log("postId ", postId)
  },[])
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <h3 className="text-2xl font-bold mb-6">
        Comments ({comments.length})
      </h3>

      {loggedIn ? (
        <form className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-600">Please log in to comment</p>
        </div>
      )}

     
    </div>
  );
};

export default Comments;