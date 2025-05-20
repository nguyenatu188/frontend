import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLesson from "../hooks/useLesson";
import useUserProgress from "../hooks/useUserProgress";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
import '../index.css';

const Learn = () => {
  const [category, setCategory] = useState("Reading");
  const [lessons, setLessons] = useState([]);
  const [showFloatbox, setShowFloatbox] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const lessonRefs = useRef([]);
  const { data, loading, error } = useLesson(category);
  const { startLesson } = useUserProgress();
  const navigate = useNavigate();

  // Log category changes
  // useEffect(() => {
  //   console.log("Selected category:", category);
  // }, [category]);

  // Log loading and error states
  // useEffect(() => {
  //   console.log("Loading state:", loading);
  //   if (error) console.error("Error state:", error);
  // }, [loading, error]);

  // Update lessons from API data
  useEffect(() => {
    // console.log("API response:", data);
    if (data?.data) {
      console.log("Lessons from API:", data.data);
      const sortedLessons = [...data.data].sort((a, b) => a.lesson_id - b.lesson_id);
      setLessons(sortedLessons);
    }
  }, [data]);

  // Log lessons state
  useEffect(() => {
    console.log("Lessons state:", lessons);
  }, [lessons]);

  // Handle lesson click to show floatbox
  const handleLessonClick = (lesson) => {
    console.log("Clicked lesson:", lesson);
    setSelectedLesson(lesson);
    setShowFloatbox(true);
  };

  // Handle floatbox button click to start lesson and navigate
  const handleStartLesson = async () => {
    if (selectedLesson) {
      console.log("Starting lesson:", selectedLesson);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found for starting lesson");
        setShowFloatbox(false);
        return;
      }

      try {
        const response = await startLesson(selectedLesson.lesson_id, token);
        console.log("API startLesson response:", {
          success: true,
          lessonId: selectedLesson.lesson_id,
          data: response,
          timestamp: new Date().toISOString(),
        });
        navigate(`/lesson/${selectedLesson.lesson_id}/questions`);
      } catch (err) {
        console.error("Failed to start lesson:", {
          error: err.message,
          lessonId: selectedLesson.lesson_id,
          timestamp: new Date().toISOString(),
        });
      }
      setShowFloatbox(false);
    }
  };

  // Handle review submission (placeholder for "Xem lại bài làm")
  const handleReviewSubmission = () => {
    if (selectedLesson) {
      console.log("Reviewing submission for lesson:", selectedLesson);
      setShowFloatbox(false);
    }
  };

  // Close floatbox
  const closeFloatbox = () => {
    setShowFloatbox(false);
    setSelectedLesson(null);
  };

  // Group lessons into sets of 5 for S-shaped path
  const lessonGroups = [];
  for (let i = 0; i < lessons.length; i += 5) {
    lessonGroups.push(lessons.slice(i, i + 5));
  }

  // Custom CSS for our specific colors
  useEffect(() => {
    // Add custom colors to the document
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
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Function to get color based on group index
  const getGroupColor = (groupIdx) => {
    // Rotate through colors for each group of 5 lessons
    const colors = [
      { bg: "bg-custom-blue", hover: "hover-custom-blue", border: "border-custom-blue", text: "text-custom-blue" },
      { bg: "bg-custom-purple", hover: "hover-custom-purple", border: "border-custom-purple", text: "text-custom-purple" },
      { bg: "bg-custom-pink", hover: "hover-custom-pink", border: "border-custom-pink", text: "text-custom-pink" },
      { bg: "bg-custom-green", hover: "hover-custom-green", border: "border-custom-green", text: "text-custom-green" },
      { bg: "bg-custom-teal", hover: "hover-custom-teal", border: "border-custom-teal", text: "text-custom-teal" },
    ];

    return colors[groupIdx % colors.length];
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-md z-30">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 bg-blue-50">
        {/* Category Header */}
        <div className="sticky top-0 bg-white shadow z-20">
          <div className="flex justify-center gap-4 p-4">
            <button
              className={`px-4 py-2 rounded ${category === "Reading" ? "bg-custom-blue text-white" : "bg-gray-200"}`}
              onClick={() => {
                console.log("Switching to Reading");
                setCategory("Reading");
              }}
            >
              Reading
            </button>
            <button
              className={`px-4 py-2 rounded ${category === "Listening" ? "bg-custom-blue text-white" : "bg-gray-200"}`}
              onClick={() => {
                console.log("Switching to Listening");
                setCategory("Listening");
              }}
            >
              Listening
            </button>
          </div>
        </div>

        {/* Lesson List */}
        <div className="flex flex-col items-center gap-12 mt-10 px-4 py-8 overflow-y-auto min-h-screen">
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">Error: {error}</div>}
          {!loading && !error && lessons.length === 0 && (
            <div>No lessons found for this category.</div>
          )}

          {/* Iterate through lessonGroups and lessons */}
          {lessonGroups.map((group, groupIdx) => {
            const isOddGroup = groupIdx % 2 !== 0; // Odd group check
            const colorScheme = getGroupColor(groupIdx);

            return (
              <div key={groupIdx} className="relative flex flex-col items-center gap-10">
                {group.map((lesson, idx) => {
                  const totalIdx = groupIdx * 5 + idx;
                  const isLastInGroup = idx === group.length - 1;

                  return (
                    <div key={lesson.lesson_id} className="relative flex flex-col items-center">
                      {/* Lesson button */}
                      <button
                        ref={(el) => (lessonRefs.current[totalIdx] = el)}
                        className={`press-button w-32 h-32 ${colorScheme.bg} rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.25)] ${colorScheme.hover} transition-colors z-10 text-white text-sm font-semibold text-center p-2`}
                        onClick={() => handleLessonClick(lesson)}
                      >
                        {lesson.title}
                      </button>

                      {/* Connecting dashed line */}
                      {!isLastInGroup && (
                        <div className={`h-10 mt-10 border-l-4 border-dashed ${colorScheme.bg} mx-auto`}></div>
                      )}

                      {/* Floatbox for lesson info */}
                      {showFloatbox && selectedLesson?.lesson_id === lesson.lesson_id && (
                        <div className={`animate-slide-in-right absolute left-28 top-0 ${colorScheme.bg} text-white rounded-lg p-4 w-64 shadow-lg z-30`}>
                          <div className="absolute -left-6 top-6 transform rotate-90">
                            <div className={`w-12 h-12 ${colorScheme.bg} rounded-full border-4 ${colorScheme.border} flex items-center justify-center`}>
                              <svg
                                className="w-6 h-6 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </div>
                          </div>
                          <div className="mt-2 text-center">
                            <h3 className="text-lg font-bold">{selectedLesson.title}</h3>
                            <button
                              className={`mt-4 bg-white ${colorScheme.text} font-bold py-2 px-4 rounded-full w-full hover:bg-gray-100 transition-colors`}
                              onClick={handleStartLesson}
                            >
                              BẮT ĐẦU
                            </button>
                            <button
                              className={`mt-4 bg-white ${colorScheme.text} font-bold py-2 px-4 rounded-full w-full hover:bg-gray-100 transition-colors`}
                              onClick={handleReviewSubmission}
                            >
                              Xem lại bài làm
                            </button>
                          </div>
                          <button
                            className="absolute top-2 right-2 text-white hover:text-gray-200"
                            onClick={closeFloatbox}
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Mascot next to the 3rd lesson in each group */}
                      {idx === 2 && (
                        <div
                          className={`absolute w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-bounce mt-2 ${isOddGroup ? "right-48" : "left-48"}`}
                        >
                          <svg
                            className={`w-12 h-12 ${colorScheme.text}`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 14c2.76 0 5-2.24 5-5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H7c0 2.76 2.24 5 5 5z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Separator line after each group (except the last group) */}
                {groupIdx < lessonGroups.length - 1 && (
                  <div className="w-1/2 h-1 bg-gray-400 my-8"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Learn;