import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLesson from "../hooks/useLesson"; // Adjust path as needed
import Sidebar from "../components/Sidebar"; // Adjust path as needed

// import slideInRight from "../../src/index.css"; // Adjust path as needed

const Learn = () => {
  const [category, setCategory] = useState("Reading");
  const [lessons, setLessons] = useState([]);
  const [showFloatbox, setShowFloatbox] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const lessonRefs = useRef([]);
  const { data, loading, error } = useLesson(category);
  const navigate = useNavigate();

  // Log category changes
  useEffect(() => {
    console.log("Selected category:", category);
  }, [category]);

  // Log loading and error states
  useEffect(() => {
    console.log("Loading state:", loading);
    if (error) console.error("Error state:", error);
  }, [loading, error]);

  // Update lessons from API data
  useEffect(() => {
    console.log("API response:", data);
    if (data?.data) {
      console.log("Lessons from API:", data.data);
      const sortedLessons = [...data.data].sort((a, b) => {
        return a.lesson_id - b.lesson_id; // Sort ascending by lesson_id
      });
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
    // Removed scrollIntoView to prevent scrolling
  };

  // Handle floatbox button click to navigate
  const handleStartLesson = () => {
    if (selectedLesson) {
      console.log("Starting lesson:", selectedLesson);
      navigate(`/lesson/${selectedLesson.lesson_id}`);
    }
    setShowFloatbox(false);
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

  return (
    <>
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
                className={`px-4 py-2 rounded ${category === "Reading" ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                onClick={() => {
                  console.log("Switching to Reading");
                  setCategory("Reading");
                }}
              >
                Reading
              </button>
              <button
                className={`px-4 py-2 rounded ${category === "Listening" ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
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
            {lessonGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="relative flex flex-col items-center gap-20">
                {group.map((lesson, idx) => {
                  const totalIdx = groupIdx * 5 + idx;
                  const isLastInGroup = idx === group.length - 1;

                  return (
                    <div key={lesson.lesson_id} className="relative flex flex-col items-center">
                      {/* Lesson button */}
                      <button
                        ref={(el) => (lessonRefs.current[totalIdx] = el)}
                        className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:bg-blue-600 transition-colors z-10 text-white text-sm font-semibold text-center p-2"
                        onClick={() => handleLessonClick(lesson, totalIdx)}
                      >
                        {lesson.title}
                      </button>

                      {/* Connecting dashed line */}
                      {!isLastInGroup && (
                        <div className="h-20 mt-10 border-l-4 border-dashed border-blue-400 mx-auto mt-2"></div>
                      )}

                      {/* Floatbox for lesson info */}
                      {showFloatbox && selectedLesson?.lesson_id === lesson.lesson_id && (
                        <div className="absolute left-28 top-0 bg-blue-500 text-white rounded-lg p-4 w-64 shadow-lg z-30">
                          <div className="absolute -left-6 top-6 transform rotate-90">
                            <div className="w-12 h-12 bg-blue-500 rounded-full border-4 border-blue-600 flex items-center justify-center">
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
                            <p className="text-sm mt-2">ID: {selectedLesson.lesson_id}</p>
                            <button
                              className="mt-4 bg-white text-blue-500 font-bold py-2 px-4 rounded-full w-full hover:bg-gray-100 transition-colors"
                              onClick={handleStartLesson}
                            >
                              BẮT ĐẦU
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
                    </div>
                  );
                })}

                {/* Mascot */}
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-bounce mt-8">
                  <svg
                    className="w-12 h-12 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 14c2.76 0 5-2.24 5-5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H7c0 2.76 2.24 5 5 5z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Learn;