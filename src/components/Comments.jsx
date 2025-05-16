import React, { useState, useRef, useEffect } from 'react'
import { cmtList } from '../data/data.js'

const Comment = ({ comment, onReply, allNames }) => {
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [userReacted, setUserReacted] = useState(null)
  const [showReply, setShowReply] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const replyInputRef = useRef(null)

  useEffect(() => {
    if (showReply && replyInputRef.current) {
      replyInputRef.current.focus()
    }
  }, [showReply])

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, {
        id: Date.now(),
        name: "Người dùng",
        content: `@${comment.name} ${replyContent}`,
        time: "Vừa xong",
        replies: []
      })
      setReplyContent('')
      setShowReply(false)
    }
  }

  const renderContent = (content) => {
    const words = content.split(/(\s+)/) // Giữ khoảng trắng
    return words.map((word, i) => {
      if (word.startsWith("@")) {
        const nameOnly = word.slice(1)
        if (allNames.includes(nameOnly)) {
          return (
            <span key={i} style={{ color: '#007bff', fontWeight: 'bold' }}>
              {word}
            </span>
          )
        }
      }
      return word
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleReply()
    }
  }

  return (
    <div style={{ marginLeft: '20px', marginTop: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
          src={`https://i.pravatar.cc/40?u=${comment.name}`}
          alt="avatar"
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
        <div>
          <strong style={{ color: "#007bff" }}>{comment.name}</strong>{' '}
          <span style={{ color: '#999' }}>{comment.time}</span>
          <p>{renderContent(comment.content)}</p>
          <div style={{ display: 'flex', gap: '10px', fontSize: '14px' }}>
            <button
              onClick={() => {
                if (userReacted === 'like') return
                if (userReacted === 'dislike') setDislikes(dislikes - 1)
                setLikes(likes + 1)
                setUserReacted('like')
              }}
            >
              👍 {likes}
            </button>
            <button
              onClick={() => {
                if (userReacted === 'dislike') return
                if (userReacted === 'like') setLikes(likes - 1)
                setDislikes(dislikes + 1)
                setUserReacted('dislike')
              }}
            >
              👎 {dislikes}
            </button>
            <button onClick={() => setShowReply(true)}>💬 Trả lời</button>
          </div>

          {showReply && (
            <div style={{ marginTop: '5px' }}>
              <div style={{ fontSize: '14px', marginBottom: '3px' }}>
                Trả lời <span style={{ color: '#007bff', fontWeight: 'bold' }}>{comment.name}</span>:
              </div>
              <input
                ref={replyInputRef}
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập phản hồi..."
                style={{ width: '60%' }}
              />
              <button onClick={handleReply}>Gửi</button>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div style={{ borderLeft: '1px solid #ccc', paddingLeft: '10px', marginTop: '10px' }}>
          {comment.replies.map(reply => (
            <Comment
              key={reply.id}
              comment={{ ...reply, replies: reply.replies || [] }}
              onReply={onReply}
              allNames={allNames}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const Comments = () => {
  const [comments, setComments] = useState(cmtList)

  const handleReply = (parentId, newReply) => {
    const addReply = (list) =>
      list.map(item => {
        if (item.id === parentId) {
          return { ...item, replies: [...item.replies, newReply] }
        }
        return { ...item, replies: addReply(item.replies || []) }
      })

    setComments(prev => addReply(prev))
  }

  const getAllNames = (list) => {
    let names = []
    list.forEach(item => {
      names.push(item.name)
      if (item.replies && item.replies.length > 0) {
        names = names.concat(getAllNames(item.replies))
      }
    })
    return names
  }

  const allNames = getAllNames(comments)

  return (
    <div>
      {comments.map(comment => (
        <Comment key={comment.id} comment={comment} onReply={handleReply} allNames={allNames} />
      ))}
    </div>
  )
}

export default Comments
