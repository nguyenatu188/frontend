import React, { useState, useEffect, useRef } from 'react';

const CommentItem = ({ comment, onReply, allNames }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReacted, setUserReacted] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const replyInputRef = useRef(null);

  useEffect(() => {
    if (showReply && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [showReply]);

  const handleReply = () => {
    if (replyContent.trim()) {
      const replyingTo = comment.name || 'Unknown User';
      onReply(`@${replyingTo} ${replyContent}`, comment.id);
      setReplyContent('');
      setShowReply(false);
    }
  };

  const renderContent = (content) => {
    const words = content.split(/(\s+)/);
    return words.map((word, i) => {
      if (word.startsWith("@")) {
        const nameOnly = word.slice(1);
        if (allNames.includes(nameOnly)) {
          return (
            <span key={i} className="text-blue-600 font-semibold">
              {word}
            </span>
          );
        }
      }
      return word;
    });
  };

  return (
    <div className="ml-5 mt-4">
      <div className="flex items-start gap-3">
        <img
          src={`https://i.pravatar.cc/40?u=${comment.name || 'Unknown'}`}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold text-blue-600">{comment.name}</div>
          <div className="text-xs text-gray-500">{comment.time}</div>
          <p className="mt-1">{renderContent(comment.content)}</p>
          <div className="flex gap-3 text-sm mt-2">
            <button
              onClick={() => {
                if (userReacted === 'like') return;
                if (userReacted === 'dislike') setDislikes(dislikes - 1);
                setLikes(likes + 1);
                setUserReacted('like');
              }}
              className="hover:underline"
            >
              👍 {likes}
            </button>
            <button
              onClick={() => {
                if (userReacted === 'dislike') return;
                if (userReacted === 'like') setLikes(likes - 1);
                setDislikes(dislikes + 1);
                setUserReacted('dislike');
              }}
              className="hover:underline"
            >
              👎 {dislikes}
            </button>
            <button onClick={() => setShowReply(true)} className="hover:underline">
              💬 Trả lời
            </button>
          </div>

          {showReply && (
            <div className="mt-2">
              <div className="text-sm mb-1">
                Trả lời <span className="text-blue-600 font-semibold">{comment.name}</span>:
              </div>
              <div className="flex gap-2">
                <input
                  ref={replyInputRef}
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                  placeholder="Nhập phản hồi..."
                  className="w-2/3 px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring focus:border-blue-400"
                />
                <button
                  onClick={handleReply}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                >
                  Gửi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="border-l border-gray-300 pl-3 mt-4">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              allNames={allNames}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
