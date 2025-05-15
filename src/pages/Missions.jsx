// Missions.jsx
import React, { useEffect, useState } from 'react';
import { IconBolt, IconTarget, IconCoin } from '@tabler/icons-react';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import useDailyMissions from '../hooks/useDailyMissions';

const Missions = () => {
    const { data, loading, error } = useDailyMissions();
    const [missions, setMissions] = useState([]);
    const [showFloatbox, setShowFloatbox] = useState(false);
    const [selectedMission, setSelectedMission] = useState(null);

    useEffect(() => {
        if (data?.missions) {
            setMissions(data.missions);
        }
    }, [data]);

    const handleMissionClick = (mission) => {
        setSelectedMission(mission);
        setShowFloatbox(true);
    };

    const handleClaimReward = async () => {
        if (!selectedMission) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Token is required');
                return;
            }

            const response = await fetch(`http://localhost:8000/api/v1/daily-missions/${selectedMission.user_mission_id}/claim`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to claim reward');
            }

            const result = await response.json();
            // Cập nhật trạng thái reward_claimed trong state
            setMissions(missions.map((m) =>
                m.user_mission_id === selectedMission.user_mission_id
                    ? { ...m, reward_claimed: true }
                    : m
            ));
            setShowFloatbox(false);
            setSelectedMission(null);
            alert(result.message);
        } catch (err) {
            console.error('Claim error:', err);
            alert('Không thể nhận thưởng: ' + err.message);
        }
    };

    const closeFloatbox = () => {
        setShowFloatbox(false);
        setSelectedMission(null);
    };

    const calculateProgress = (progress, requiredCount) => {
        return Math.min((progress / requiredCount) * 100, 100);
    };

    const getMissionIcon = (requiredAction) => {
        switch (requiredAction) {
            case 'complete_lesson':
                return <IconTarget className="w-6 h-6 text-green-500" />;
            case 'correct_answers':
                return <IconBolt className="w-6 h-6 text-yellow-500" />;
            case 'daily_checkin':
                return <IconCoin className="w-6 h-6 text-blue-500" />;
            default:
                return <IconBolt className="w-6 h-6 text-yellow-500" />;
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-md z-30">
                <Sidebar />
            </div>
            <div className="flex-1 ml-64 bg-blue-50">
                <div className="flex items-center justify-center min-h-screen px-4 py-8">
                    <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.25)] p-6 w-full max-w-3xl">
                        {loading && <div className="text-center text-gray-800">Đang tải...</div>}
                        {error && <div className="text-red-600 text-center">Lỗi: {error}</div>}
                        {!loading && !error && missions.length === 0 && (
                            <div className="text-center text-gray-800">Không tìm thấy nhiệm vụ nào.</div>
                        )}

                        {!loading && !error && missions.length > 0 && (
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-blue-500 text-white">
                                        <th className="py-3 px-4 text-left text-sm font-semibold">Nhiệm vụ</th>
                                        <th className="py-3 px-4 text-center text-sm font-semibold">Tiến độ</th>
                                        <th className="py-3 px-4 text-center text-sm font-semibold">Trạng thái</th>
                                        <th className="py-3 px-4 text-center text-sm font-semibold">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {missions.map((mission) => (
                                        <tr
                                            key={mission.user_mission_id}
                                            className="border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer"
                                            onClick={() => handleMissionClick(mission)}
                                        >
                                            <td className="py-3 px-4 flex items-center gap-2 text-gray-800 text-sm">
                                                {getMissionIcon(mission.mission.required_action)}
                                                <span>{mission.mission.title}</span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="w-24 bg-gray-200 rounded-full h-2 mx-auto">
                                                    <div
                                                        className={`h-2 rounded-full ${mission.is_completed ? 'bg-green-600' : 'bg-yellow-600'}`}
                                                        style={{ width: `${calculateProgress(mission.progress, mission.mission.required_count)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-600 block mt-1">{mission.progress}/{mission.mission.required_count}</span>
                                            </td>
                                            <td className="py-3 px-4 text-center text-sm">
                                                {mission.is_completed ? (
                                                    mission.reward_claimed ? (
                                                        <span className="text-green-600">Đã nhận</span>
                                                    ) : (
                                                        <span className="text-blue-600">Hoàn thành</span>
                                                    )
                                                ) : (
                                                    <span className="text-gray-600">Đang thực hiện</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {mission.is_completed && !mission.reward_claimed && (
                                                    <button
                                                        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors text-sm font-semibold"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMissionClick(mission);
                                                        }}
                                                    >
                                                        Nhận thưởng
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {showFloatbox && selectedMission && (
                        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50 backdrop-blur-sm">
                            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                                <button
                                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                                    onClick={closeFloatbox}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="flex flex-col items-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                        {getMissionIcon(selectedMission.mission.required_action)}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mt-2">{selectedMission.mission.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Hoàn thành {selectedMission.progress}/{selectedMission.mission.required_count}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                                        <div
                                            className={`h-3 rounded-full ${selectedMission.is_completed ? 'bg-green-500' : 'bg-yellow-500'}`}
                                            style={{ width: `${calculateProgress(selectedMission.progress, selectedMission.mission.required_count)}%` }}
                                        ></div>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4">
                                        <p className="text-gray-700 text-sm mb-2">{selectedMission.mission.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Phần thưởng:</span>
                                            <div className="flex items-center">
                                                <IconCoin className="w-5 h-5 text-yellow-500 mr-1" />
                                                <span className="font-semibold text-yellow-600">{selectedMission.mission.reward_coins}</span>
                                            </div>
                                        </div>
                                        {selectedMission.is_completed && !selectedMission.reward_claimed && (
                                            <button
                                                className="mt-4 bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600 transition-colors w-full text-sm"
                                                onClick={handleClaimReward}
                                            >
                                                Nhận {selectedMission.mission.reward_coins} xu
                                            </button>
                                        )}
                                        {selectedMission.reward_claimed && (
                                            <div className="mt-4 text-center text-green-600 font-semibold text-sm">Đã nhận thưởng!</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <RightSidebar />
        </div>
    );
};

export default Missions;