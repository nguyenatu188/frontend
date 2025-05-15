import { useState, useEffect, useCallback } from 'react';

const useQuestion = (lessonId) => {
  const [data, setData] = useState({ lesson: null, questions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getLessonWithQuestions = useCallback(async (lessonId, token, signal) => {
    try {
      if (!lessonId) {
        throw new Error('Lesson ID is required');
      }

      const response = await fetch(`http://localhost:8000/api/v1/lessons/${lessonId}/with-questions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        signal,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lesson with questions');
      }

      const result = await response.json();
      setData(result.data || { lesson: null, questions: [] });
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Token is required');
      setLoading(false);
      return;
    }

    if (!lessonId) {
      setError('Lesson ID is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    getLessonWithQuestions(lessonId, token, controller.signal);

    return () => controller.abort();
  }, [lessonId, getLessonWithQuestions]);

  return { data, loading, error };
};

export default useQuestion;