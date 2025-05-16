import { useEffect, useState } from 'react';

const base_url = "http://localhost:8000/api";

const useComments = (lessonId = 3) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${base_url}/v1/lessons/${lessonId}/comments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setComments(data?.cmtList || []);
        } catch (err) {
            setError(err.message || "Lỗi khi tải bình luận");
        } finally {
            setLoading(false);
        }
    };

    const addComment = async (content, parentId = null, name = "Unknown User") => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:8000/api/v1/lessons/3/comments`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content,
                    parent_id: parentId,
                    name,
                }),
            });

            if (!res.ok) throw new Error("Gửi bình luận thất bại");

            await fetchComments(); // Load lại danh sách sau khi thêm
        } catch (err) {
            console.error("❌ Lỗi khi thêm bình luận:", err.message);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [lessonId]);

    return {
        comments,
        loading,
        error,
        addComment,
        refetchComments: fetchComments,
    };
};

export default useComments;
