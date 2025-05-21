import React from 'react';

const Loading = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <div className="flex space-x-2 mb-4">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-[pulse-dot_1.2s_ease-in-out_infinite]"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-[pulse-dot_1.2s_ease-in-out_0.2s_infinite]"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-[pulse-dot_1.2s_ease-in-out_0.4s_infinite]"></div>
            </div>
            <p className="text-lg font-semibold text-black">Đang tải nội dung bài học...</p>
            <style>{`
                @keyframes pulse-dot {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(0.8);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.2);
                    }
                }
            `}</style>
        </div>
    );
};

export default Loading;