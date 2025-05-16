import React, { useState, useEffect } from 'react';
import useComments from '../hooks/useComments';
import CommentItem from './CommentItem';
import { useAuthContext } from '../context/AuthContext';

const Comments = () => {
  const { comments, loading, addComment } = useComments(3);
  const [newComment, setNewComment] = useState('');
  const { authUser } = useAuthContext();

  const userFullName = authUser?.full_name || 'Unknown User';

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(newComment, null, userFullName); // name truyền để reply dùng
      setNewComment('');
    }
  };

  const getAllNames = (list) => {
    let names = [];
    list.forEach(item => {
      names.push(item.name);
      if (item.replies && item.replies.length > 0) {
        names = names.concat(getAllNames(item.replies));
      }
    });
    return names;
  };

  const allNames = getAllNames(comments);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-5 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        <img
          src={`https://i.pravatar.cc/40?u=${userFullName}`}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <input
          type="text"
          placeholder="Viết bình luận..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
          className="flex-1 px-4 py-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          Gửi
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Đang tải bình luận...</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-500">Chưa có bình luận nào.</p>
      ) : (
        comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={(content, parentId) => addComment(content, parentId, userFullName)}
            allNames={allNames}
          />
        ))
      )}
    </div>
  );
};

export default Comments;
