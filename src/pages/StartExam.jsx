import { React, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconXboxX, IconCircleCheck } from '@tabler/icons-react';
import useQuestion from '../hooks/useQuestion';
import useUserProgress from '../hooks/useUserProgress';

const StartExam = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const parsedLessonId = parseInt(lessonId, 10);
    const { data, loading, error } = useQuestion(parsedLessonId || 0);
    const { data: progressStats, getLearningStats, submitAnswer, finalizeLessonProgress, loading: submitLoading, error: submitError } = useUserProgress();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [results, setResults] = useState([]); // Lưu kết quả từng câu
    const [showFloatbox, setShowFloatbox] = useState(false); // Điều khiển floatbox
    const [statsLoaded, setStatsLoaded] = useState(false);

    console.log("progressStats lives", progressStats?.lives);
    console.log("progressStats time_limit", progressStats?.time_limit);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !statsLoaded) {
            getLearningStats(token);
            setStatsLoaded(true);
        }
    }, [getLearningStats, statsLoaded]);
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

            // Lưu kết quả câu hỏi
            setResults((prev) => [
                ...prev,
                {
                    questionId: question.question_id,
                    questionText: question.question_text,
                    isCorrect: isAnswerCorrect,
                },
            ]);

            setIsCorrect(isAnswerCorrect);
            setIsChecked(true);
            await getLearningStats(token);
        } catch (err) {
            console.error('Error checking answer:', err);
            alert('Lỗi khi kiểm tra câu trả lời: ' + err.message);
        }
    };

    // Handle navigation to next question or show floatbox
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
                console.log('Showing floatbox with results');
                setShowFloatbox(true); // Hiển thị floatbox
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

    // Calculate results for floatbox
    const correctCount = results.filter((result) => result.isCorrect).length;
    const totalQuestions = data.questions.length;
    const score = (correctCount / totalQuestions) * 100; // Điểm tính theo phần trăm

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
                        className="text-3xl font-bold text-black hover:text-blue-400 hover:scale-130 transition-transform duration-200"
                        aria-label="Quay lại trang học"
                    >
                        x
                    </button>
                    <div className="flex-1 mx-4 h-5 bg-gray-300 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-400 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / data.questions.length) * 100}%` }}
                        >

                        </div>
                    </div>
                    <div className="flex items-center space-x-2  ">
                        <span className="text-red-400 text-xl">❤️</span>
                        <span className="text-black">{progressStats?.lives}</span>
                    </div>
                </div>
                <h2 className="text-xl font-bold text-blue-500 text-center my-6">
                    Câu hỏi {currentQuestionIndex + 1}/{data.questions.length}
                </h2>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-4xl flex-grow">
                <h3 className="text-2xl font-bold text-black mb-4 text-center">{currentQuestion.question_text}</h3>
                {/* Audio bên dưới câu hỏi */}
                {currentQuestion.audio_url && (
                    <>
                        {console.log("Audio URL:", currentQuestion.audio_url)}
                        <div className="flex justify-center mb-4">
                            <audio controls preload="auto" className="w-full max-w-md">
                                <source src={currentQuestion.audio_url} type="audio/mpeg" />
                                Trình duyệt của bạn không hỗ trợ phát âm thanh.
                            </audio>
                        </div>
                    </>
                )}
                <form onSubmit={handleCheckAnswer} className="space-y-4">
                    {currentQuestion.options.map((option) => (
                        <label
                            key={option.option_id}
                            className={`flex items-center justify-between p-4 rounded-lg border-2 hover:bg-gray-200 ${selectedOption === option.option_id
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
                                className="h-5 w-5 text-blue-500 border-gray-300 rounded-full focus:ring-blue-500 cursor-pointer"
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
                        <span className="mr-2 w-6 h-6">
                            {isCorrect ? <IconCircleCheck stroke={2} /> : <IconXboxX stroke={2} />}
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

            {/* Floatbox */}
            {showFloatbox && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold text-center mb-4">Kết quả bài thi</h2>
                        <div className="text-center mb-4">
                            <p className="text-lg">Số câu đúng: {correctCount}/{totalQuestions}</p>
                            <p className="text-lg">Điểm: {score.toFixed(2)}/100</p>
                        </div>
                        <div className="max-h-60 overflow-y-auto mb-4">
                            <h3 className="text-lg font-semibold mb-2">Chi tiết câu hỏi:</h3>
                            <ul className="space-y-2">
                                {results.map((result, index) => (
                                    <li
                                        key={result.questionId}
                                        className={`flex items-center ${result.isCorrect ? 'text-green-600' : 'text-red-600'
                                            }`}
                                    >
                                        <span className="mr-2">
                                            {result.isCorrect ? (
                                                <IconCircleCheck stroke={2} size={20} />
                                            ) : (
                                                <IconXboxX stroke={2} size={20} />
                                            )}
                                        </span>
                                        <span>
                                            Câu {index + 1}: {result.questionText}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate('/learn')}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StartExam;