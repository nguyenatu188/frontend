import { useState, useEffect } from 'react';

const base_url = "http://localhost:8000/api";

const useComments = (lessonId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const addComment = async (content, parentId = null, name) => {
    try {
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
    }
  };

  useEffect(() => {
    fetchComments();
  }, [lessonId]);

  return {
    comments,
    loading,
    addComment,
  };
};

export default useComments;
