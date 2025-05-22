import { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';

const useUserProgress = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { authUser } = useAuthContext();

  // Lấy tất cả tiến độ học tập
  const getUserProgress = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/v1/progress', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Endpoint /api/v1/progress không tồn tại. Kiểm tra routes/api.php.');
        }
        if (response.status === 401) {
          throw new Error('Token không hợp lệ hoặc đã hết hạn.');
        }
        throw new Error(`Không thể lấy tiến độ học tập: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('API getUserProgress response:', {
        success: result.success,
        data: result.data,
        message: result.message,
        timestamp: new Date().toISOString(),
      });

      if (!result.success) {
        throw new Error(result.message || 'Lấy tiến độ học tập thất bại');
      }

      setData(result.data);
    } catch (err) {
      console.error('API getUserProgress error:', {
        error: err.message,
        timestamp: new Date().toISOString(),
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Lấy tiến độ cho một bài học cụ thể
  const getLessonProgress = async (lessonId, token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/progress/lesson/${lessonId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Endpoint không tồn tại');
        }
        throw new Error('Không thể lấy tiến độ bài học');
      }

      const result = await response.json();
      console.log('API getLessonProgress response:', {
        success: result.success,
        data: result.data,
        message: result.message,
        timestamp: new Date().toISOString(),
      });

      if (!result.success) {
        throw new Error(result.message || 'Lấy tiến độ bài học thất bại');
      }

      setData(result.data);
    } catch (err) {
      console.error('API getLessonProgress error:', {
        error: err.message,
        timestamp: new Date().toISOString(),
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Bắt đầu bài học
  const startLesson = async (lessonId, token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/progress/lesson/${lessonId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Endpoint startLesson không tồn tại');
        }
        if (response.status === 403) {
          throw new Error('Không có quyền tiếp tục học');
        }
        throw new Error('Không thể bắt đầu bài học');
      }

      const result = await response.json();
      console.log('API startLesson response:', {
        success: result.success,
        data: result.data,
        message: result.message,
        timestamp: new Date().toISOString(),
      });

      if (!result.success) {
        throw new Error(result.message || 'Bắt đầu bài học thất bại');
      }

      setData(result.data);
      return result.data;
    } catch (err) {
      console.error('API startLesson error:', {
        error: err.message,
        timestamp: new Date().toISOString(),
      });
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Hoàn thành bài học
  const completeLesson = async (lessonId, answers, elapsedTime, token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/progress/lesson/${lessonId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers, elapsed_time: elapsedTime }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Thời gian làm bài đã hết');
        }
        if (response.status === 400) {
          throw new Error('Dữ liệu đầu vào không hợp lệ');
        }
        throw new Error('Không thể hoàn thành bài học');
      }

      const result = await response.json();
      console.log('API completeLesson response:', {
        success: result.success,
        data: result.data,
        message: result.message,
        timestamp: new Date().toISOString(),
      });

      if (!result.success) {
        throw new Error(result.message || 'Hoàn thành bài học thất bại');
      }

      setData(result.data);
      return result.data;
    } catch (err) {
      console.error('API completeLesson error:', {
        error: err.message,
        timestamp: new Date().toISOString(),
      });
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Nộp một câu trả lời
  const submitAnswer = async (lessonId, questionId, optionId, elapsedTime, token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/progress/lesson/${lessonId}/question/${questionId}/submit`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ option_id: optionId, elapsed_time: elapsedTime }),
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Thời gian làm bài đã hết');
        }
        if (response.status === 400) {
          throw new Error('Dữ liệu đầu vào không hợp lệ');
        }
        throw new Error('Không thể nộp câu trả lời');
      }

      const result = await response.json();
      console.log('API submitAnswer response:', {
        success: result.success,
        data: result.data,
        message: result.message,
        timestamp: new Date().toISOString(),
      });

      if (!result.success) {
        throw new Error(result.message || 'Nộp câu trả lời thất bại');
      }

      setData(result.data);
      return result.data;
    } catch (err) {
      console.error('API submitAnswer error:', {
        error: err.message,
        timestamp: new Date().toISOString(),
      });
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Hoàn thành bài học sau khi nộp tất cả câu trả lời
  const finalizeLessonProgress = async (lessonId, token, elapsedTime) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/progress/lesson/${lessonId}/finalize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ elapsed_time: elapsedTime }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Dữ liệu đầu vào không hợp lệ');
        }
        throw new Error('Không thể hoàn thành bài học');
      }

      const result = await response.json();
      console.log('API finalizeLessonProgress response:', {
        success: result.success,
        data: result.data,
        message: result.message,
        timestamp: new Date().toISOString(),
      });

      if (!result.success) {
        throw new Error(result.message || 'Hoàn thành bài học thất bại');
      }

      setData(result.data);
      return result.data;
    } catch (err) {
      console.error('API finalizeLessonProgress error:', {
        error: err.message,
        timestamp: new Date().toISOString(),
      });
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Lấy thống kê học tập
  const getLearningStats = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/v1/progress/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Không thể lấy thống kê học tập');
      }

      const result = await response.json();
      console.log('API getLearningStats response:', {
        success: result.success,
        data: result.data,
        message: result.message,
        timestamp: new Date().toISOString(),
      });

      if (!result.success) {
        throw new Error(result.message || 'Lấy thống kê học tập thất bại');
      }

      setData(result.data);
    } catch (err) {
      console.error('API getLearningStats error:', {
        error: err.message,
        timestamp: new Date().toISOString(),
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Gọi getUserProgress khi mount
  useEffect(() => {
    if (!authUser) {
      console.error('No authenticated user for getUserProgress');
      setError('Yêu cầu đăng nhập để lấy tiến độ học tập');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found for getUserProgress');
      setError('Token is required');
      setLoading(false);
      return;
    }

    getUserProgress(token);
  }, [authUser]);

  return {
    data,
    loading,
    error,
    getUserProgress,
    getLessonProgress,
    startLesson,
    completeLesson,
    submitAnswer,
    finalizeLessonProgress,
    getLearningStats,
  };
};

export default useUserProgress;