import { React, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IconXboxX, IconCircleCheck } from '@tabler/icons-react';
import useQuestion from '../hooks/useQuestion';
import useUserProgress from '../hooks/useUserProgress';
import Loading from '../components/Loading';

const StartExam = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const parsedLessonId = parseInt(lessonId, 10);
    const { data, loading, error } = useQuestion(parsedLessonId || 0);
    const { statsData, getLearningStats, submitAnswer, finalizeLessonProgress, loading: submitLoading, error: submitError } = useUserProgress();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [results, setResults] = useState([]);
    const [showFloatbox, setShowFloatbox] = useState(false);
    const [floatboxReason, setFloatboxReason] = useState(null); // null, 'time', 'lives', 'error'
    const [errorMessage, setErrorMessage] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [isStatsFetching, setIsStatsFetching] = useState(false); // Prevent duplicate stats calls
    const timerRef = useRef(null);

    // Fetch lives on mount (once)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !isStatsFetching) {
            setIsStatsFetching(true);
            getLearningStats(token)
                .catch((err) => {
                    setErrorMessage('Lỗi khi lấy dữ liệu lives: ' + err.message);
                })
                .finally(() => {
                    setIsStatsFetching(false);
                });
        } else if (!token) {
            setErrorMessage('Không tìm thấy token xác thực.');
        }
        setTimerActive(true);
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []); // Empty deps for single mount call

    // Timer logic
    useEffect(() => {
        if (timerActive) {
            timerRef.current = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [timerActive]);

    // Helper function for auto-completion
    const autoCompleteExam = async (reason) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('Không tìm thấy token xác thực.');
            setShowFloatbox(true);
            setFloatboxReason('error');
            return;
        }

        try {
            // Submit current question if unanswered and questions are available
            if (!isChecked && data?.questions?.length > 0 && currentQuestionIndex < data.questions.length) {
                const question = data.questions[currentQuestionIndex];
                const response = await submitAnswer(
                    parsedLessonId,
                    question.question_id,
                    selectedOption || null,
                    elapsedTime,
                    token
                );
                const isAnswerCorrect = response?.data?.is_correct ?? false;

                setResults((prev) => [
                    ...prev,
                    {
                        questionId: question.question_id,
                        questionText: question.question_text,
                        isCorrect: isAnswerCorrect,
                    },
                ]);

                // Update lives after submission
                if (!isStatsFetching) {
                    setIsStatsFetching(true);
                    await getLearningStats(token);
                    setIsStatsFetching(false);
                }
            }

            // Finalize lesson progress
            setTimerActive(false);
            clearInterval(timerRef.current);
            await finalizeLessonProgress(parsedLessonId, token, elapsedTime);
            setFloatboxReason(reason);
            setShowFloatbox(true);
        } catch (err) {
            setErrorMessage('Lỗi khi tự động hoàn thành bài thi: ' + err.message);
            setShowFloatbox(true);
            setFloatboxReason('error');
        }
    };

    // Check time limit
    useEffect(() => {
        if (data?.lesson?.time_limit && elapsedTime >= data.lesson.time_limit && timerActive) {
            setTimerActive(false);
            autoCompleteExam('time');
        }
    }, [elapsedTime, data?.lesson?.time_limit, timerActive]);

    // Check lives
    useEffect(() => {
        if (statsData?.lives === 0 && timerActive) {
            setTimerActive(false);
            autoCompleteExam('lives');
        }
    }, [statsData?.lives, timerActive]);

    // Handle invalid lessonId or data issues
    if (!lessonId || isNaN(parsedLessonId)) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center text-red-500">
                Lỗi: Lesson ID không hợp lệ hoặc thiếu.
            </div>
        );
    }

    // Handle loading, errors, or no questions
    if (loading || error || !data?.questions || data.questions.length === 0) {
        return <Loading />;
    }

    // Handle close button
    const handleClose = () => {
        setTimerActive(false);
        clearInterval(timerRef.current);
        navigate('/learn');
    };

    // Handle answer submission
    const handleCheckAnswer = async (e) => {
        e.preventDefault();
        if (!selectedOption) {
            setErrorMessage('Vui lòng chọn một đáp án!');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('Không tìm thấy token xác thực.');
            return;
        }

        try {
            const question = data.questions[currentQuestionIndex];
            const selectedOptionData = question.options.find(
                (option) => option.option_id === selectedOption
            );
            if (currentQuestionIndex === data.questions.length - 1) {
                setTimerActive(false);
                clearInterval(timerRef.current);
            }
            const response = await submitAnswer(parsedLessonId, question.question_id, selectedOption, elapsedTime, token);
            const isAnswerCorrect = response?.data?.is_correct ?? selectedOptionData.is_correct === 1;

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
            setErrorMessage(null);

            // Update lives after submission
            if (!isStatsFetching) {
                setIsStatsFetching(true);
                await getLearningStats(token);
                setIsStatsFetching(false);
            }
        } catch (err) {
            setErrorMessage('Lỗi khi kiểm tra câu trả lời: ' + err.message);
        }
    };

    // Handle next question or finalize
    const handleNextQuestion = async () => {
        if (currentQuestionIndex < data.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsChecked(false);
            setIsCorrect(null);
            setTimerActive(true);
            setErrorMessage(null);
        } else {
            const token = localStorage.getItem('token');
            if (!token) {
                setErrorMessage('Không tìm thấy token xác thực.');
                return;
            }

            try {
                setTimerActive(false);
                clearInterval(timerRef.current);
                await finalizeLessonProgress(parsedLessonId, token, elapsedTime);
                setFloatboxReason(null);
                setShowFloatbox(true);
                setErrorMessage(null);
            } catch (err) {
                setErrorMessage('Lỗi khi hoàn thành bài học: ' + err.message);
                setShowFloatbox(true);
                setFloatboxReason('error');
            }
        }
    };

    // Handle option selection
    const handleOptionChange = (optionId) => {
        setSelectedOption(optionId);
        setIsChecked(false);
        setIsCorrect(null);
        setErrorMessage(null);
    };

    // Format time for display
    const formatElapsedTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Calculate results
    const correctCount = results.filter((result) => result.isCorrect).length;
    const totalQuestions = data.questions.length;
    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    const currentQuestion = data.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === data.questions.length - 1;

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
                            className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-red-400 text-xl">❤️</span>
                        <span className="text-black">{statsData?.lives ?? 0}</span>
                    </div>
                </div>
                <h2 className="text-xl font-bold text-blue-500 text-center my-6">
                    Câu hỏi {currentQuestionIndex + 1}/{totalQuestions}
                </h2>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-4xl flex-grow">
                <div className="text-center mb-4">
                    <div className="text-lg font-semibold text-black">
                        Thời gian: {formatElapsedTime(elapsedTime)}
                    </div>
                    {data.lesson?.time_limit && (
                        <div className="text-sm text-gray-600">
                            Giới hạn: {formatElapsedTime(data.lesson.time_limit)}
                        </div>
                    )}
                </div>
                <h3 className="text-2xl font-bold text-black mb-4 text-center">{currentQuestion.question_text}</h3>
                {currentQuestion.audio_url && (
                    <div className="flex justify-center mb-4">
                        <audio controls preload="auto" className="w-full max-w-md">
                            <source src={currentQuestion.audio_url} type="audio/mpeg" />
                            Trình duyệt của bạn không hỗ trợ phát âm thanh.
                        </audio>
                    </div>
                )}
                <form onSubmit={handleCheckAnswer} className="space-y-4">
                    {currentQuestion.options.map((option) => (
                        <label
                            key={option.option_id}
                            className={`flex items-center justify-between p-4 rounded-lg border-2 hover:bg-gray-200 ${
                                selectedOption === option.option_id
                                    ? 'border-blue-500 bg-blue-100'
                                    : 'border-gray-300'
                            } ${
                                isChecked
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
                        className={`flex items-center justify-center text-lg ${
                            isCorrect ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        <span className="mr-2 w-6 h-6">
                            {isCorrect ? <IconCircleCheck stroke={2} /> : <IconXboxX stroke={2} />}
                        </span>
                        {currentQuestion.explanation}
                    </p>
                )}
                {(submitError || errorMessage) && (
                    <p className="text-red-500 text-center mb-4">{submitError || errorMessage}</p>
                )}
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

            {/* Results Floatbox */}
            {showFloatbox && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold text-center mb-4">Kết quả bài thi</h2>
                        <p className="text-lg text-center mb-4 text-gray-600">
                            {floatboxReason === 'time'
                                ? 'Nộp do hết thời gian'
                                : floatboxReason === 'lives'
                                ? 'Nộp do hết lives'
                                : floatboxReason === 'error'
                                ? 'Lỗi hệ thống'
                                : 'Nộp bài thi'}
                        </p>
                        {floatboxReason && floatboxReason !== 'error' && (
                            <p className="text-lg text-center mb-4 text-red-600">
                                {floatboxReason === 'time'
                                    ? `Bạn đã vượt quá thời gian cho phép (${formatElapsedTime(
                                          data.lesson?.time_limit || 0
                                      )}).`
                                    : 'Bạn đã hết lives. Vui lòng thử lại sau.'}
                            </p>
                        )}
                        {floatboxReason === 'error' && (
                            <p className="text-lg text-center mb-4 text-red-600">
                                {errorMessage || 'Có lỗi xảy ra khi xử lý bài thi.'}
                                {results.length === 0 && ' Bạn hãy làm ít nhất 1 câu để có thể lưu kết quả.'}
                            </p>
                        )}
                        <div className="text-center mb-4">
                            <p
                                className={`text-3xl font-bold ${
                                    score > 60 ? 'text-blue-500' : 'text-red-500'
                                }`}
                            >
                                Điểm: {score.toFixed(2)}/100
                            </p>
                            <p className="text-lg">Số câu đúng: {correctCount}/{totalQuestions}</p>
                            <p className="text-lg">Thời gian: {formatElapsedTime(elapsedTime)}</p>
                        </div>
                        <div className="max-h-60 overflow-y-auto mb-4">
                            <h3 className="text-lg font-semibold mb-2">Chi tiết câu hỏi:</h3>
                            {results.length === 0 ? (
                                <p className="text-gray-600">Chưa có câu trả lời nào.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {results.map((result, index) => (
                                        <li
                                            key={result.questionId}
                                            className={`flex items-center ${
                                                result.isCorrect ? 'text-green-600' : 'text-red-600'
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
                            )}
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate('/learn')}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Quay lại
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StartExam;