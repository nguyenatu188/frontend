import { useState, useEffect, useRef } from 'react'
import { FaTrash } from "react-icons/fa"
import { FaEdit } from "react-icons/fa"
import { useAuthContext } from '../context/AuthContext'

const CommentItem = ({ comment, onReply, allNames, onDelete, onUpdate, updatingLoading }) => {
  const [showReply, setShowReply] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const replyInputRef = useRef(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  const { authUser } = useAuthContext()

  useEffect(() => {
    if (showReply && replyInputRef.current) {
      replyInputRef.current.focus()
    }
  }, [showReply])

  const handleReply = () => {
    if (replyContent.trim()) {
      const replyingTo = comment.name || 'Unknown User'
      onReply(`@${replyingTo} ${replyContent}`, comment.id)
      setReplyContent('')
      setShowReply(false)
    }
  }

  const renderContent = (content) => {
    const words = content.split(/(\s+)/)
    return words.map((word, i) => {
      if (word.startsWith("@")) {
        const nameOnly = word.slice(1)
        if (allNames.includes(nameOnly)) {
          return (
            <span key={i} className="text-gray-700 font-semibold">
              {word}
            </span>
          )
        }
      }
      return word
    })
  }

  const handleConfirmEdit = async () => {
    if (!editedContent.trim()) return;
    try {
      await onUpdate(comment.id, editedContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
    }
  };

  return (
    <div className="ml-5 mt-4">
      <div className="flex items-start gap-3">
        <img
          src={`http://127.0.0.1:8000/storage/avatars/${comment.avatar || 'default-avatar.png'}`}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex flex-row items-center justify-between gap-2">
            <div>
              <span className='font-semibold text-lg text-blue-600'>{comment.username}</span>
              <span className="font-semibold text-sm text-blue-600"> ({comment.name})</span>
              <div className="text-xs text-gray-700">{comment.time}</div>
              {isEditing ? (
                <div className="mt-2">
                  <input
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-gray-700"
                    onKeyDown={(e) => e.key === 'Enter' && handleConfirmEdit()}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 bg-gray-500 rounded-md hover:bg-gray-600"
                      disabled={updatingLoading}
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleConfirmEdit}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                      disabled={updatingLoading}
                    >
                      {updatingLoading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-gray-700">{renderContent(comment.content)}</p>
              )}
              <div className="flex gap-3 text-sm text-gray-700 mt-2">
                <button onClick={() => setShowReply(true)} className="hover:underline text-gray-700">
                  💬 Trả lời
                </button>
              </div>
            </div>
            <div className="flex gap-3">
              {authUser?.username === comment.username && (
                <button 
                  className="btn btn-sm btn-outline btn-primary"
                  onClick={() => {
                    setIsEditing(true);
                    setEditedContent(comment.content);
                  }}
                  disabled={isEditing}
                >
                  <FaEdit />
                </button>
              )}
              {(authUser?.username === comment.username || authUser.role_id === 1) && (
                <button
                  className="btn btn-sm btn-outline btn-error"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isEditing}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          </div>

          <div className={`modal ${showDeleteModal ? 'modal-open' : ''}`}>
            <div className="modal-box">
              <h3 className="font-bold text-lg">Xóa bình luận</h3>
              <p className="py-4">Bạn có chắc chắn muốn xóa bình luận này không?</p>
              <div className="modal-action">
                <button 
                  className="btn"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Hủy
                </button>
                <button 
                  className="btn btn-error"
                  onClick={() => {
                    onDelete(comment.id)
                    setShowDeleteModal(false)
                  }}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>

          {showReply && (
            <div className="mt-2">
              <div className="text-sm mb-1 text-gray-700">
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
                  className="w-2/3 px-3 py-1 text-sm border rounded-md text-gray-700 focus:outline-none focus:ring focus:border-blue-400"
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
  )
}

export default CommentItem
