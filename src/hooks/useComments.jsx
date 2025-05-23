import { useState, useEffect } from 'react';

const base_url = "http://localhost:8000/api";

const useComments = (lessonId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addingLoading, setAddingLoading] = useState(false);

  const [updatingLoading, setUpdatingLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base_url}/v1/lessons/${lessonId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setComments(data.cmtList || []);
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content, parentId = null) => {
    try {
      setAddingLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${base_url}/v1/lessons/${lessonId}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content,
          parent_id: parentId
        })
      });

      if (!res.ok) throw new Error("Gửi bình luận thất bại");
      await fetchComments();
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
    } finally {
      setAddingLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${base_url}/v1/lessons/${lessonId}/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Xóa bình luận thất bại");
      await fetchComments(); // Cập nhật danh sách comment sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
    }
  };

  const updateComment = async (commentId, content) => {
    try {
      setUpdatingLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${base_url}/v1/lessons/${lessonId}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) throw new Error("Cập nhật bình luận thất bại");
      await fetchComments();
    } catch (error) {
      console.error("Lỗi khi cập nhật bình luận:", error);
      throw error;
    } finally {
      setUpdatingLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [lessonId]);

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    addingLoading,
    updateComment,
    updatingLoading,
  };
};

export default useComments;
