import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLesson from "../hooks/useLesson";
import useUserProgress from "../hooks/useUserProgress";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import '../index.css';

const Learn = () => {
  const [category, setCategory] = useState("Reading");
  const [lessons, setLessons] = useState([]);
  const [showFloatbox, setShowFloatbox] = useState(false);
  const [showLivesError, setShowLivesError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const lessonRefs = useRef([]);
  const { data, loading, error: lessonError } = useLesson(category);
  const { progressData, statsData, progressLoading, statsLoading, error: progressError, startLesson } = useUserProgress();
  const navigate = useNavigate();

  // Load lessons
  useEffect(() => {
    if (data?.data) {
      const sortedLessons = [...data.data].sort((a, b) => a.lesson_id - b.lesson_id);
      setLessons(sortedLessons);
    }
  }, [data])

  // Log lessons, progressData, and statsData for debugging
  useEffect(() => {
    console.log("Category:", category);
    console.log("Lessons state:", lessons);
    console.log("Lesson IDs:", lessons.map(l => l.lesson_id));
    console.log("progressData:", progressData, "Type:", Array.isArray(progressData) ? "Array" : typeof progressData);
    console.log("statsData:", statsData);
  }, [category, lessons, progressData, statsData]);

  // Kiểm tra lives và bắt đầu bài học
  const checkAndStartLesson = async (lessonId, token) => {
    console.log("Checking lives before starting lesson:", statsData?.lives);
    if (statsData?.lives === undefined) {
      console.error("Lives data not available");
      setErrorMessage("Không thể tải dữ liệu lives. Vui lòng thử lại sau.");
      setShowFloatbox(false);
      setShowLivesError(true);
      return false;
    }
    if (statsData.lives === 0) {
      console.log("Lives = 0, showing lives error floatbox");
      setErrorMessage("Vui lòng chờ để hồi hoặc mua lives ở cửa hàng.");
      setShowFloatbox(false);
      setShowLivesError(true);
      return false;
    }

    try {
      await startLesson(lessonId, token);
      navigate(`/lesson/${lessonId}/questions`);
      return true;
    } catch (err) {
      console.error("Failed to start lesson:", {
        error: err.message,
        lessonId,
        timestamp: new Date().toISOString(),
      });
      setErrorMessage("Không thể bắt đầu bài học. Vui lòng thử lại.");
      setShowFloatbox(false);
      setShowLivesError(true);
      return false;
    }
  };

  const handleLessonClick = (lesson) => {
    console.log("Clicked lesson:", lesson);
    const lessonProgress = Array.isArray(progressData) ? progressData.find(p => p.lesson_id == lesson.lesson_id) : null;
    console.log("Progress for lesson ID", lesson.lesson_id, ":", lessonProgress || "No progress");

    // Find the index of the current lesson
    const lessonIndex = lessons.findIndex(l => l.lesson_id === lesson.lesson_id);

    // The first lesson (index 0) is always unlocked
    if (lessonIndex === 0) {
      setSelectedLesson(lesson);
      setShowFloatbox(true);
      return;
    }

    // Check if the previous lesson is completed
    const previousLesson = lessons[lessonIndex - 1];
    const previousLessonProgress = Array.isArray(progressData) ? progressData.find(p => p.lesson_id == previousLesson.lesson_id) : null;

    if (!previousLessonProgress || previousLessonProgress.completion_status !== 'Completed') {
      setErrorMessage(`Bạn cần hoàn thành bài học "${previousLesson.title}" trước khi bắt đầu bài này.`);
      setShowLivesError(true);
      return;
    }

    setSelectedLesson(lesson);
    setShowFloatbox(true);
  };

  const handleStartLesson = async () => {
    if (!selectedLesson) {
      console.error("No lesson selected");
      setErrorMessage("Vui lòng chọn một bài học.");
      setShowLivesError(true);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found for starting lesson");
      setErrorMessage("Vui lòng đăng nhập để tiếp tục.");
      setShowFloatbox(false);
      setShowLivesError(true);
      return;
    }

    if (statsLoading || progressLoading) {
      console.log("Waiting for data to load...");
      setErrorMessage("Đang tải dữ liệu, vui lòng chờ...");
      setShowFloatbox(false);
      setShowLivesError(true);
      return;
    }

    const success = await checkAndStartLesson(selectedLesson.lesson_id, token);
    if (success) {
      setShowFloatbox(false);
    }
  }

  const handleReviewSubmission = () => {
    if (selectedLesson) {
      navigate(`/review/${selectedLesson.lesson_id}`) // Thêm lesson_id vào URL
      setShowFloatbox(false)
    }
  }

  const closeFloatbox = () => {
    setShowFloatbox(false);
    setShowLivesError(false);
    setErrorMessage("");
  };

  // Group lessons into sets of 5 for S-shaped path
  const lessonGroups = []
  for (let i = 0; i < lessons.length; i += 5) {
    lessonGroups.push(lessons.slice(i, i + 5))
  }

  // Tạo style động
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .bg-custom-green { background-color: #58cc02; }
      .bg-custom-purple { background-color: #ce82ff; }
      .bg-custom-teal { background-color: #00cd9c; }
      .bg-custom-blue { background-color: #1cb0f6; }
      .bg-custom-pink { background-color: #ff86d0; }
      .text-custom-green { color: #58cc02; }
      .text-custom-purple { color: #ce82ff; }
      .text-custom-teal { color: #00cd9c; }
      .text-custom-blue { color: #1cb0f6; }
      .text-custom-pink { color: #ff86d0; }
      .border-custom-green { border-color: #58cc02; }
      .border-custom-purple { border-color: #ce82ff; }
      .border-custom-teal { border-color: #00cd9c; }
      .border-custom-blue { border-color: #1cb0f6; }
      .border-custom-pink { border-color: #ff86d0; }
      .hover-custom-green:hover { background-color: #4cac02; }
      .hover-custom-purple:hover { background-color: #b86fec; }
      .hover-custom-teal:hover { background-color: #00b78a; }
      .hover-custom-blue:hover { background-color: #0f9edf; }
      .hover-custom-pink:hover { background-color: #ec74bc; }
      .press-button {
        position: relative;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .press-button:active {
        transform: scale(0.95);
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      }
      .score-display {
        font-size: 1.5rem;
        font-weight: bold;
        margin-top: 0.25rem;
      }
      .completed-badge {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: white;
        border-radius: 9999px;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease-in;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Hàm lấy màu cho nhóm bài học
  const getGroupColor = (groupIdx) => {
    const colors = [
      { bg: "bg-custom-blue", hover: "hover-custom-blue", border: "border-custom-blue", text: "text-custom-blue" },
      { bg: "bg-custom-purple", hover: "hover-custom-purple", border: "border-custom-purple", text: "text-custom-purple" },
      { bg: "bg-custom-pink", hover: "hover-custom-pink", border: "border-custom-pink", text: "text-custom-pink" },
      { bg: "bg-custom-green", hover: "hover-custom-green", border: "border-custom-green", text: "text-custom-green" },
      { bg: "bg-custom-teal", hover: "hover-custom-teal", border: "border-custom-teal", text: "text-custom-teal" },
    ];
    return colors[groupIdx % colors.length];
  };

  // Hàm tái sử dụng để render floatbox (cho click và lỗi)
  const renderFloatbox = (content, buttons, lessonId) => {
    const groupIdx = lessonId ? lessons.findIndex(lesson => lesson.lesson_id === lessonId) : -1;
    const colorScheme = groupIdx !== -1 ? getGroupColor(Math.floor(groupIdx / 5)) : getGroupColor(0);

    // Check if the lesson is completed and get the score
    const lessonProgress = Array.isArray(progressData) ? progressData.find(p => p.lesson_id == lessonId) : null;
    const isCompleted = lessonProgress?.completion_status === 'Completed';
    const score = isCompleted ? lessonProgress?.score.toFixed(2) : null;
    return (
      <div className={`animate-slide-in-right absolute left-42 top-0 ${colorScheme.bg} text-white rounded-lg p-4 w-64 shadow-lg z-10`}>
        <div className="absolute -left-6 top-6 transform rotate-90">
          <div className={`w-12 h-12 ${colorScheme.bg} rounded-full border-4 ${colorScheme.border} flex items-center justify-center`}>
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              {content.isError ? (
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              ) : (
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              )}
            </svg>
          </div>
        </div>
        <div className="mt-2 text-center">
          {content.title && <h3 className="text-lg font-bold">{content.title}</h3>}
          {content.message && <p className="text-sm">{content.message}</p>}
          {isCompleted && score !== null && (
            <p className="text-sm font-bold mt-2">Điểm: {score}</p>
          )}
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              className={`mt-4 bg-white ${colorScheme.text} font-bold py-2 px-4 rounded-full w-full hover:bg-gray-100 transition-colors`}
              onClick={btn.onClick}
            >
              {btn.label}
            </button>
          ))}
        </div>
        <button
          className="absolute top-2 right-2 text-white hover:text-gray-200"
          onClick={closeFloatbox}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  };

  // Handle loading, error, no lessons, or data loading
  if (loading || lessonError || lessons.length === 0 || statsLoading || progressLoading || progressError || !Array.isArray(progressData)) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen">
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-md z-30">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 bg-blue-50">
        <div className="sticky top-0 bg-white shadow z-20">
          <div className="flex justify-center gap-4 p-4">
            <button
              className={`px-4 py-2 rounded ${category === "Reading" ? "bg-custom-blue text-white" : "bg-gray-200"}`}
              onClick={() => setCategory("Reading")}
            >
              Reading
            </button>
            <button
              className={`px-4 py-2 rounded ${category === "Listening" ? "bg-custom-blue text-white" : "bg-gray-200"}`}
              onClick={() => setCategory("Listening")}
            >
              Listening
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-12 mt-10 px-4 py-8 overflow-y-auto min-h-screen">
          {lessonGroups.map((group, groupIdx) => {
            const colorScheme = getGroupColor(groupIdx);
            return (
              <div key={groupIdx} className="relative flex flex-col items-center gap-10">
                {group.map((lesson, idx) => {
                  const totalIdx = groupIdx * 5 + idx;
                  const isLastInGroup = idx === group.length - 1;
                  const lessonProgress = Array.isArray(progressData) ? progressData.find(p => p.lesson_id == lesson.lesson_id) : null;
                  const isCompleted = lessonProgress?.completion_status === 'Completed';
                  const lessonIndex = lessons.findIndex(l => l.lesson_id === lesson.lesson_id);
                  const isLocked = lessonIndex > 0 && 
                    (!Array.isArray(progressData) || 
                     !progressData.find(p => p.lesson_id == lessons[lessonIndex - 1].lesson_id) ||
                     progressData.find(p => p.lesson_id == lessons[lessonIndex - 1].lesson_id).completion_status !== 'Completed');

                  return (
                    <div key={lesson.lesson_id} className="relative flex flex-col items-center">
                      <button
                        ref={(el) => (lessonRefs.current[totalIdx] = el)}
                        className={`press-button w-42 h-42 rounded-full flex flex-col items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-colors z-10 text-white text-sm font-semibold text-center p-2 relative
                          ${isLocked ? 'bg-gray-400 cursor-not-allowed' : `${colorScheme.bg} ${colorScheme.hover}`}`}
                        onClick={() => !isLocked && handleLessonClick(lesson)}
                        disabled={isLocked}
                      >
                        <span className="text-md mb-1 line-clamp-2">{lesson.title}</span>
                        {isCompleted && (
                          <div className="completed-badge">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        {isLocked && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3-9H9V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2z" />
                            </svg>
                          </div>
                        )}
                      </button>
                      {!isLastInGroup && (
                        <div className={`h-10 mt-10 border-l-4 border-dashed ${colorScheme.bg} mx-auto`}></div>
                      )}
                      {showFloatbox && selectedLesson?.lesson_id === lesson.lesson_id && renderFloatbox(
                        {
                          title: selectedLesson.title,
                          isError: false,
                        },
                        [
                          { label: "BẮT ĐẦU", onClick: handleStartLesson },
                          { label: "Xem lại bài làm", onClick: handleReviewSubmission },
                        ],
                        lesson.lesson_id
                      )}
                      {showLivesError && selectedLesson?.lesson_id === lesson.lesson_id && renderFloatbox(
                        {
                          title: isLocked ? "Bài học bị khóa" : "Hết lives",
                          message: errorMessage,
                          isError: true,
                        },
                        [{ label: "Đóng", onClick: closeFloatbox }],
                        lesson.lesson_id
                      )}
                      {idx === 2 && (
                        <div
                          className="absolute w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-bounce mt-2 left-48"
                        >
                          <svg className={`w-12 h-12 ${colorScheme.text}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 14c2.76 0 5-2.24 5-5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H7c0 2.76 2.24 5 5 5z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
                {groupIdx < lessonGroups.length - 1 && (
                  <div className="w-1/2 h-1 bg-gray-400 my-8"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Learn
