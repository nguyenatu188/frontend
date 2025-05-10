
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLesson from "../hooks/useLesson"; // Adjust path as needed

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
      return a.lesson_id - b.lesson_id; // sắp xếp tăng dần theo lesson_id
    });
    setLessons(sortedLessons);
  }
}, [data]);


  // Log lessons state
  useEffect(() => {
    console.log("Lessons state:", lessons);
  }, [lessons]);

  // Handle lesson click to show floatbox
  const handleLessonClick = (lesson, index) => {
    console.log("Clicked lesson:", lesson);
    setSelectedLesson(lesson);
    setShowFloatbox(true);
    lessonRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
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
    <div className="flex flex-col my-10">
      {/* Category header */}
      <div className="sticky top-0 z-20 bg-white py-2 shadow">
        <div className="flex justify-center gap-4">
          <button
            className={`px-4 py-2 rounded ${
              category === "Reading" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => {
              console.log("Switching to Reading");
              setCategory("Reading");
            }}
          >
            Reading
          </button>
          <button
            className={`px-4 py-2 rounded ${
              category === "Listening" ? "bg-blue-500 text-white" : "bg-gray-200"
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

      {/* Lesson list with S-shaped path */}
      <div className="relative flex flex-col items-center gap-12 mt-10 px-4">
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        {!loading && !error && lessons.length === 0 && (
          <div>No lessons found for this category.</div>
        )}
        {lessonGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="relative flex flex-col items-center">
            {/* S-shaped path for the group */}
            <div className="relative flex flex-col items-center">
              {group.map((lesson, idx) => {
                const totalIdx = groupIdx * 5 + idx;
                const isLastInGroup = idx === group.length - 1;
                // Calculate position for S-shape
                const offset = idx % 2 === 0 ? -20 : 20; // Alternate left and right for S-shape
                const topPosition = idx * 80; // Vertical spacing between lessons

                return (
                  <div
                    key={lesson.lesson_id}
                    className="relative"
                    style={{ top: `${topPosition}px`, left: `${offset}px` }}
                  >
                    {/* Lesson button */}
                    <button
                      ref={(el) => (lessonRefs.current[totalIdx] = el)}
                      className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors z-10"
                      onClick={() => handleLessonClick(lesson, totalIdx)}
                    >
                      {/* Star icon for lesson */}
                      <svg
                        className="w-8 h-8 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>

                    {/* S-shaped path connector */}
                    {!isLastInGroup && (
                      <svg
                        className="absolute left-1/2 transform -translate-x-1/2"
                        style={{ top: "16px", left: `${offset}px` }}
                        width="60"
                        height="80"
                        viewBox="0 0 60 80"
                        fill="none"
                      >
                        <path
                          d={`M${offset < 0 ? 40 : 20} 0 C${offset < 0 ? 20 : 40} 20, ${
                            offset < 0 ? 40 : 20
                          } 60, ${offset < 0 ? 20 : 40} 80`}
                          stroke="#60A5FA"
                          strokeWidth="4"
                          strokeDasharray="8 8"
                        />
                      </svg>
                    )}

                    {/* Floatbox */}
                    {showFloatbox && selectedLesson?.lesson_id === lesson.lesson_id && (
                      <div
                        className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-green-500 text-white rounded-lg p-4 w-64 shadow-lg z-30"
                        style={{ top: "100%" }}
                      >
                        {/* Star icon with circle */}
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                          <div className="relative">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-green-600">
                              <svg
                                className="w-6 h-6 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            </div>
                            <div className="absolute inset-0 border-4 border-green-600 rounded-full" />
                          </div>
                        </div>

                        {/* Floatbox content */}
                        <div className="mt-6 text-center">
                          <h3 className="text-lg font-bold">{selectedLesson.title}</h3>
                          <p className="text-sm mt-2">ID: {selectedLesson.lesson_id}</p>
                          <button
                            className="mt-4 bg-white text-green-500 font-bold py-2 px-4 rounded-full w-full hover:bg-gray-100 transition-colors"
                            onClick={handleStartLesson}
                          >
                            BẮT ĐẦU
                          </button>
                        </div>

                        {/* Close button */}
                        <button
                          className="absolute top-2 right-2 text-white hover:text-gray-200"
                          onClick={closeFloatbox}
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
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
            </div>

            {/* Mascot area every 5 lessons */}
            <div
              className="absolute left-[-80px] top-1/2 transform -translate-y-1/2 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-bounce"
              style={{ top: `${(group.length * 80) / 2}px` }}
            >
              {/* Mascot icon (e.g., a jumping bird) */}
              <svg
                className="w-12 h-12 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 14c2.76 0 5-2.24 5-5h-2c0 1.66-1.34 3-3 3s-3-1.34-3-3H7c0 2.76 2.24 5 5 5z" />
              </svg>
            </div>

            {/* Connect groups with a straight dashed line */}
            {groupIdx < lessonGroups.length - 1 && (
              <svg
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ top: `${group.length * 80}px` }}
                width="20"
                height="40"
                viewBox="0 0 20 40"
                fill="none"
              >
                <path
                  d="M10 0 L10 40"
                  stroke="#60A5FA"
                  strokeWidth="4"
                  strokeDasharray="8 8"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learn;