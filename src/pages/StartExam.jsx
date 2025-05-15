// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import useQuestion from '../hooks/useQuestion';
// import useUserProgress from '../hooks/useUserProgress';

// const StartExam = () => {
//   const { lessonId } = useParams();
//   const navigate = useNavigate();
//   const parsedLessonId = parseInt(lessonId, 10);
//   const { data, loading, error } = useQuestion(parsedLessonId || 0);
//   const { submitAnswer, finalizeLessonProgress, loading: submitLoading, error: submitError } = useUserProgress();
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [isChecked, setIsChecked] = useState(false);
//   const [isCorrect, setIsCorrect] = useState(null);

//   // Debug: Log lessonId và parsedLessonId khi component render
//   console.log('StartExam lessonId:', { lessonId, parsedLessonId });

//   // Kiểm tra lessonId không hợp lệ
//   if (!lessonId || isNaN(parsedLessonId)) {
//     console.log('Phát hiện lessonId không hợp lệ:', { lessonId, parsedLessonId });
//     return (
//       <div className="max-w-2xl mx-auto p-6 text-center text-red-500">
//         Lỗi: Lesson ID không hợp lệ hoặc thiếu.
//       </div>
//     );
//   }

//   // Hàm xử lý khi kiểm tra đáp án
//   const handleCheckAnswer = async (e) => {
//     e.preventDefault();
//     console.log('Đã gọi handleCheckAnswer:', { selectedOption, currentQuestionIndex });

//     if (!selectedOption) {
//       console.log('Không có đáp án nào được chọn');
//       alert('Vui lòng chọn một đáp án!');
//       return;
//     }

//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.log('Thiếu token');
//       alert('Token is required');
//       return;
//     }

//     try {
//       const question = data.questions[currentQuestionIndex];
//       const selectedOptionData = question.options.find(
//         (option) => option.option_id === selectedOption
//       );
//       console.log('Đang gửi đáp án:', {
//         lessonId: parsedLessonId,
//         questionId: question.question_id,
//         selectedOption,
//       });

//       const response = await submitAnswer(parsedLessonId, question.question_id, selectedOption, token);
//       const isAnswerCorrect = response?.data?.is_correct ?? selectedOptionData.is_correct === 1;

//       console.log('Kết quả kiểm tra đáp án:', {
//         isAnswerCorrect,
//         responseData: response?.data,
//       });

//       setIsCorrect(isAnswerCorrect);
//       setIsChecked(true);
//     } catch (err) {
//       console.error('Lỗi khi kiểm tra đáp án:', err);
//       alert('Lỗi khi kiểm tra câu trả lời: ' + err.message);
//     }
//   };

//   // Hàm xử lý chuyển sang câu hỏi tiếp theo hoặc hoàn thành bài học
//   const handleNextQuestion = async () => {
//     console.log('Đã gọi handleNextQuestion:', {
//       currentQuestionIndex,
//       totalQuestions: data.questions.length,
//     });

//     if (currentQuestionIndex < data.questions.length - 1) {
//       console.log('Chuyển sang câu hỏi tiếp theo:', currentQuestionIndex + 1);
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//       setSelectedOption(null);
//       setIsChecked(false);
//       setIsCorrect(null);
//     } else {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.log('Thiếu token để hoàn thành tiến độ');
//         alert('Token is required');
//         return;
//       }

//       try {
//         console.log('Đang hoàn thành tiến độ bài học:', { lessonId: parsedLessonId });
//         await finalizeLessonProgress(parsedLessonId, token);
//         console.log('Đã hoàn thành tiến độ bài học, chuyển hướng đến /learn');
//         navigate('/learn');
//       } catch (err) {
//         console.error('Lỗi khi hoàn thành bài học:', err);
//         alert('Lỗi khi hoàn thành bài học: ' + err.message);
//       }
//     }
//   };

//   // Hàm xử lý khi chọn đáp án
//   const handleOptionChange = (optionId) => {
//     console.log('Đã thay đổi đáp án:', { optionId });
//     setSelectedOption(optionId);
//     setIsChecked(false);
//     setIsCorrect(null);
//   };

//   // Kiểm tra trạng thái loading
//   if (loading) {
//     console.log('Đang tải câu hỏi...');
//     return <div className="text-center mt-10 text-black">Đang tải...</div>;
//   }

//   // Kiểm tra lỗi khi tải câu hỏi
//   if (error) {
//     console.error('Lỗi khi tải câu hỏi:', error);
//     return <div className="text-center mt-10 text-red-500">Lỗi: {error}</div>;
//   }

//   // Kiểm tra nếu không có câu hỏi
//   if (!data.questions || data.questions.length === 0) {
//     console.log('Không có câu hỏi nào cho bài học:', parsedLessonId);
//     return <div className="text-center mt-10 text-black">Không có câu hỏi nào cho bài học này.</div>;
//   }

//   const currentQuestion = data.questions[currentQuestionIndex];
//   const isLastQuestion = currentQuestionIndex === data.questions.length - 1;

//   console.log('Đang hiển thị câu hỏi:', {
//     questionIndex: currentQuestionIndex,
//     questionId: currentQuestion.question_id,
//     isLastQuestion,
//   });

//   return (
//     <div className="max-w-2xl mx-auto p-6 text-black">
//       <h1 className="text-2xl font-bold mb-4">{data.lesson?.title || 'Bài thi'}</h1>
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <h2 className="text-xl font-semibold mb-4">
//           Câu hỏi {currentQuestionIndex + 1}/{data.questions.length}
//         </h2>
//         <p className="mb-4">{currentQuestion.question_text}</p>
//         <form onSubmit={handleCheckAnswer}>
//           <div className="space-y-2">
//             {currentQuestion.options.map((option) => (
//               <label
//                 key={option.option_id}
//                 className={`flex items-center space-x-2 ${
//                   isChecked
//                     ? option.is_correct
//                       ? 'text-green-600'
//                       : selectedOption === option.option_id
//                         ? 'text-red-600'
//                         : ''
//                     : ''
//                 }`}
//               >
//                 <input
//                   type="radio"
//                   name="option"
//                   value={option.option_id}
//                   checked={selectedOption === option.option_id}
//                   onChange={() => handleOptionChange(option.option_id)}
//                   disabled={isChecked || submitLoading}
//                   className="h-4 w-4 text-blue-600"
//                 />
//                 <span>{option.option_text}</span>
//               </label>
//             ))}
//           </div>
//           {isChecked && (
//             <p className={`mt-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
//               {isCorrect ? 'Đúng!' : 'Sai!'} {currentQuestion.explanation}
//             </p>
//           )}
//           {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
//           <div className="mt-4 flex space-x-4">
//             <button
//               type="submit"
//               disabled={isChecked || submitLoading || !selectedOption}
//               className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
//             >
//               {submitLoading ? 'Đang kiểm tra...' : 'Kiểm tra'}
//             </button>
//             {isChecked && (
//               <button
//                 type="button"
//                 onClick={handleNextQuestion}
//                 className="bg-green-500 text-white px-4 py-2 rounded"
//               >
//                 {isLastQuestion ? 'Hoàn thành bài học' : 'Câu tiếp theo'}
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StartExam;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconXboxX, IconCircleCheck } from '@tabler/icons-react';
import useQuestion from '../hooks/useQuestion';
import useUserProgress from '../hooks/useUserProgress';

const StartExam = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const parsedLessonId = parseInt(lessonId, 10);
    const { data, loading, error } = useQuestion(parsedLessonId || 0);
    const { submitAnswer, finalizeLessonProgress, loading: submitLoading, error: submitError } = useUserProgress();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);

    // Debug: Log lessonId and parsedLessonId when component renders
    console.log('StartExam lessonId:', { lessonId, parsedLessonId });

    // Check for invalid lessonId
    if (!lessonId || isNaN(parsedLessonId)) {
        console.log('Invalid lessonId detected:', { lessonId, parsedLessonId });
        return (
            <div className="max-w-2xl mx-auto p-6 text-center text-red-500">
                Lỗi: Lesson ID không hợp lệ hoặc thiếu.
            </div>
        );
    }

    // Handle close button click
    const handleClose = () => {
        console.log('Close button clicked, navigating to /learn');
        navigate('/learn');
    };

    // Handle answer submission
    const handleCheckAnswer = async (e) => {
        e.preventDefault();
        console.log('handleCheckAnswer called:', { selectedOption, currentQuestionIndex });

        if (!selectedOption) {
            console.log('No option selected');
            alert('Vui lòng chọn một đáp án!');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Token missing');
            alert('Token is required');
            return;
        }

        try {
            const question = data.questions[currentQuestionIndex];
            const selectedOptionData = question.options.find(
                (option) => option.option_id === selectedOption
            );
            console.log('Submitting answer:', {
                lessonId: parsedLessonId,
                questionId: question.question_id,
                selectedOption,
            });

            const response = await submitAnswer(parsedLessonId, question.question_id, selectedOption, token);
            const isAnswerCorrect = response?.data?.is_correct ?? selectedOptionData.is_correct === 1;

            console.log('Answer check result:', {
                isAnswerCorrect,
                responseData: response?.data,
            });

            setIsCorrect(isAnswerCorrect);
            setIsChecked(true);
        } catch (err) {
            console.error('Error checking answer:', err);
            alert('Lỗi khi kiểm tra câu trả lời: ' + err.message);
        }
    };

    // Handle navigation to next question or lesson completion
    const handleNextQuestion = async () => {
        console.log('handleNextQuestion called:', {
            currentQuestionIndex,
            totalQuestions: data.questions.length,
        });

        if (currentQuestionIndex < data.questions.length - 1) {
            console.log('Moving to next question:', currentQuestionIndex + 1);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsChecked(false);
            setIsCorrect(null);
        } else {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('Token missing for finalizing progress');
                alert('Token is required');
                return;
            }

            try {
                console.log('Finalizing lesson progress:', { lessonId: parsedLessonId });
                await finalizeLessonProgress(parsedLessonId, token);
                console.log('Lesson progress finalized, navigating to /learn');
                navigate('/learn');
            } catch (err) {
                console.error('Error finalizing lesson:', err);
                alert('Lỗi khi hoàn thành bài học: ' + err.message);
            }
        }
    };

    // Handle option selection
    const handleOptionChange = (optionId) => {
        console.log('Option changed:', { optionId });
        setSelectedOption(optionId);
        setIsChecked(false);
        setIsCorrect(null);
    };

    // Check loading state
    if (loading) {
        console.log('Loading questions...');
        return <div className="text-center mt-10 text-black">Đang tải...</div>;
    }

    // Check for errors
    if (error) {
        console.error('Error loading questions:', error);
        return <div className="text-center mt-10 text-black">Lỗi: {error}</div>;
    }

    // Check if no questions are available
    if (!data.questions || data.questions.length === 0) {
        console.log('No questions available for lesson:', parsedLessonId);
        return <div className="text-center mt-10 text-black">Không có câu hỏi nào cho bài học này.</div>;
    }

    const currentQuestion = data.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === data.questions.length - 1;

    console.log('Displaying question:', {
        questionIndex: currentQuestionIndex,
        questionId: currentQuestion.question_id,
        isLastQuestion,
    });

    return (
        <div className="min-h-screen bg-white text-black flex flex-col items-center p-6 relative">
            {/* Header */}
            <header className="w-full max-w-6xl mb-6">
                <div className="p-2 rounded-lg flex items-center justify-between">
                    <button
                        onClick={handleClose}
                        className="text-3xl font-bold text-black hover:text-gray-400"
                        aria-label="Quay lại trang học"
                    >
                        ×
                    </button>
                    <div className="flex-1 mx-4 h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-400 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / data.questions.length) * 100}%` }}
                        >
                            <span className="absolute left-0 ml-1 transform -translate-y-1/2 bg-green-400 rounded-full w-3 h-3"></span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-red-400 text-xl">❤️</span>
                        <span className="text-black">4</span>
                    </div>
                </div>
                <h2 className="text-xl font-bold text-blue-500 text-center my-6">
                    Câu hỏi {currentQuestionIndex + 1}/{data.questions.length}
                </h2>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-4xl flex-grow">
                <h3 className="text-2xl font-bold text-black mb-4 text-center">{currentQuestion.question_text}</h3>
                <form onSubmit={handleCheckAnswer} className="space-y-4">
                    {currentQuestion.options.map((option) => (
                        <label
                            key={option.option_id}
                            className={`flex items-center justify-between p-4 rounded-lg border-2 ${selectedOption === option.option_id
                                    ? 'border-blue-500 bg-blue-100'
                                    : 'border-gray-300'
                                } ${isChecked
                                    ? option.is_correct
                                        ? 'border-green-500 bg-green-100'
                                        : selectedOption === option.option_id
                                            ? 'border-red-500 bg-red-100'
                                            : ''
                                    : ''
                                } cursor-pointer transition-all duration-200`}
                        >
                            <span className="text-lg text-black">{option.option_text}</span>
                            <input
                                type="radio"
                                name="option"
                                value={option.option_id}
                                checked={selectedOption === option.option_id}
                                onChange={() => handleOptionChange(option.option_id)}
                                disabled={isChecked || submitLoading}
                                className="h-5 w-5 text-blue-500 focus:ring-blue-500"
                            />
                        </label>
                    ))}
                </form>
            </main>

            {/* Footer */}
            <footer className="w-full max-w-4xl mt-5">
                {isChecked && (
                    <p
                        className={`flex items-center justify-center text-lg ${isCorrect ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        <span className="mr-2">
                            {isCorrect ? <IconCircleCheck stroke={2} size={35} /> : <IconXboxX stroke={2} size={35} />}
                        </span>
                        {currentQuestion.explanation}
                    </p>
                )}
                {submitError && <p className="text-red-500 text-center mb-4">{submitError}</p>}
                <div className="flex justify-center">
                    {isChecked ? (
                        <button
                            type="button"
                            onClick={handleNextQuestion}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            {isLastQuestion ? 'HOÀN THÀNH' : 'TIẾP TỤC'}
                        </button>
                    ) : (
                        <button
                            type="submit"
                            onClick={handleCheckAnswer}
                            disabled={submitLoading || !selectedOption}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 hover:bg-green-600 transition-colors"
                        >
                            {submitLoading ? 'ĐANG KIỂM TRA...' : 'KIỂM TRA'}
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default StartExam;