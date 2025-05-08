
import { useEffect, useRef, useState } from "react";

const lessons = [
    {
        section: "Phần 1",
        gate: "Cửa 1",
        title: "Gọi đồ uống",
        color: "#58cc02",
        topics: [
            { id: 1, title: "Bài 1: Xin chào" },
            { id: 2, title: "Bài 2: Gọi cà phê" },
            { id: 1, title: "Bài 1: Xin chào" },
            { id: 2, title: "Bài 2: Gọi cà phê" },
            { id: 3, title: "Bài 1: Tôi là Nam" },
            { id: 4, title: "Bài 2: Nghề nghiệp" },
            { id: 5, title: "Bài 1: Nhà vệ sinh ở đâu?" },
            { id: 6, title: "Bài 2: Rẽ trái, rẽ phải" },
        ],
    },
    {
        section: "Phần 2",
        gate: "Cửa 2",
        title: "Giới thiệu bản thân",
        color: "#a259ff",
        topics: [
            { id: 3, title: "Bài 1: Tôi là Nam" },
            { id: 4, title: "Bài 2: Nghề nghiệp" },
            { id: 1, title: "Bài 1: Xin chào" },
            { id: 2, title: "Bài 2: Gọi cà phê" },
            { id: 3, title: "Bài 1: Tôi là Nam" },
            { id: 4, title: "Bài 2: Nghề nghiệp" },
            { id: 5, title: "Bài 1: Nhà vệ sinh ở đâu?" },
            { id: 6, title: "Bài 2: Rẽ trái, rẽ phải" },
            { id: 1, title: "Bài 1: Xin chào" },
            { id: 2, title: "Bài 2: Gọi cà phê" },
            { id: 3, title: "Bài 1: Tôi là Nam" },
            { id: 4, title: "Bài 2: Nghề nghiệp" },
            { id: 5, title: "Bài 1: Nhà vệ sinh ở đâu?" },
            { id: 6, title: "Bài 2: Rẽ trái, rẽ phải" },
        ],
    },
    {
        section: "Phần 3",
        gate: "Cửa 3",
        title: "Hỏi đường",
        color: "#ff914d",
        topics: [
            { id: 5, title: "Bài 1: Nhà vệ sinh ở đâu?" },
            { id: 6, title: "Bài 2: Rẽ trái, rẽ phải" },
            { id: 1, title: "Bài 1: Xin chào" },
            { id: 2, title: "Bài 2: Gọi cà phê" },
            { id: 3, title: "Bài 1: Tôi là Nam" },
            { id: 4, title: "Bài 2: Nghề nghiệp" },
            { id: 5, title: "Bài 1: Nhà vệ sinh ở đâu?" },
            { id: 6, title: "Bài 2: Rẽ trái, rẽ phải" },
            { id: 1, title: "Bài 1: Xin chào" },
            { id: 2, title: "Bài 2: Gọi cà phê" },
            { id: 3, title: "Bài 1: Tôi là Nam" },
            { id: 4, title: "Bài 2: Nghề nghiệp" },
            { id: 5, title: "Bài 1: Nhà vệ sinh ở đâu?" },
            { id: 6, title: "Bài 2: Rẽ trái, rẽ phải" },
        ],
    },
];

const Learn = () => {
    const [currentLesson, setCurrentLesson] = useState(lessons[0]);
    const lessonRefs = useRef([]);
    const stickyHeaderRef = useRef(null);

    // scroll cho header
    useEffect(() => {
        const handleScroll = () => {
            if (!stickyHeaderRef.current) return;

            const stickyTop = stickyHeaderRef.current.getBoundingClientRect().top + window.scrollY;
            const headerHeight = stickyHeaderRef.current.offsetHeight;

            const headerCenter = stickyTop + headerHeight / 2;

            for (let i = 0; i < lessonRefs.current.length; i++) {
                const lessonEl = lessonRefs.current[i];
                if (!lessonEl) continue;

                const rect = lessonEl.getBoundingClientRect();
                const top = rect.top + window.scrollY;
                const bottom = top + lessonEl.offsetHeight;

                if (headerCenter >= top && headerCenter < bottom) {
                    setCurrentLesson(lessons[i]);
                    break;
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="flex flex-col my-10">
            {/* Tiêu đề bài học cố định */}
            <div ref={stickyHeaderRef} className="sticky top-0 bg-white z-10 py-4 shadow-md">
                <div className="mx-auto flex justify-center">
                    <div
                        className="card card-border w-96 text-white px-4 py-2 rounded-lg"
                        style={{ backgroundColor: currentLesson.color }}
                    >
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m12 19-7-7 7-7"></path>
                                    <path d="M19 12H5"></path>
                                </svg>
                                <h1 className="text-lg font-semibold">Chào mừng bạn đến với khóa học</h1>
                            </div>
                            <h2 className="text-xl font-bold">{currentLesson.title}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Giao diện tất cả bài học */}
            <div className="flex flex-col items-center gap-20 mt-10 px-4">
                {lessons.map((lesson, idx) => (
                    <div
                        key={idx}
                        ref={(el) => (lessonRefs.current[idx] = el)}
                        className="w-full max-w-sm"
                    >
                        <div className="text-2xl font-bold mb-4 text-center" style={{ color: lesson.color }}>
                            {lesson.title}
                        </div>
                        <div className="text-lg font-semibold text-center text-gray-700 mb-4">
                            {lesson.section}, {lesson.gate}
                        </div>
                        <div className="flex flex-col gap-4">
                            {lesson.topics.map((topic) => (
                                <div
                                    key={topic.id}
                                    className="bg-[#58cc02] text-white font-semibold px-4 py-3 rounded-full shadow text-center"
                                   >
                                    {topic.title}
                                </div>
                            ))}
                        </div>
                        {/* <div className="flex flex-col gap-4">
                            {lesson.topics.map((topic) => (
                                <div
                                    key={topic.id}
                                    className="bg-[#58cc02] text-white font-semibold px-4 py-3 rounded-full shadow text-center cursor-pointer"
                                    onClick={() => handleTopicClick(topic)}
                                >
                                    <img src="/star.svg" alt="Star" width="24" height="24" fill="#ffffff" />
                                </div>
                            ))}
                        </div> */}

                    </div>
                ))}
            </div>
        </div>
    );
};

export default Learn;

