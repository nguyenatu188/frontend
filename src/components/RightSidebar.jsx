import React, { useState } from 'react';
import { IconFlame, IconUserPlus, IconCoin } from "@tabler/icons-react";
import { useAuthContext } from '../context/AuthContext';
import useFriendRequests from '../hooks/useFriends';

const RightSidebar = () => {
  const [showInvites, setShowInvites] = useState(false);
  const { authUser, isLoading } = useAuthContext();
  const {
    friendRequests,
    loading: invitesLoading,
    error,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useFriendRequests();

  const [processingId, setProcessingId] = useState(null);

  const handleRespond = async (requestId, action) => {
    setProcessingId(requestId);
    try {
      if (action === 'accept') {
        await acceptFriendRequest(requestId);
      } else if (action === 'reject') {
        await rejectFriendRequest(requestId);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="fixed top-4 right-4 w-40 bg-white border border-gray-200 rounded-lg shadow-sm p-2 flex flex-row items-center gap-2 z-10">
      <div className="flex items-center gap-1">
        <IconFlame className="h-6 w-6 text-orange-500" />
        <span className="text-sm font-semibold text-gray-800">
          {isLoading ? '...' : (authUser?.current_streak ?? 0)}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <IconCoin className="h-6 w-6 text-blue-500" />
        <span className="text-sm font-semibold text-gray-800">
          {isLoading ? '...' : (authUser?.coins ?? 0)}
        </span>
      </div>

      <div className="flex items-center">
        <IconUserPlus
          className="h-6 w-6 text-purple-500 cursor-pointer"
          onClick={() => setShowInvites(!showInvites)}
        />
      </div>

      {showInvites && (
        <div className="fixed top-16 right-4 w-72 bg-white border border-gray-200 rounded-lg shadow-md p-4 z-20">
          <h3 className="text-md font-semibold text-gray-800 mb-2">Lời mời kết bạn</h3>
          <ul className="space-y-2">
            {invitesLoading ? (
              <li className="text-sm text-gray-600">Đang tải...</li>
            ) : error ? (
              <li className="text-sm text-red-600">Lỗi: {error}</li>
            ) : friendRequests.length === 0 ? (
              <li className="text-sm text-gray-600">Không có lời mời nào</li>
            ) : (
              friendRequests.map((request, idx) => (
                <li key={idx} className="text-sm text-gray-800 flex flex-col gap-1 border-b pb-2">
                  <span>
                    {request.sender?.full_name || request.sender?.username || `Người dùng ${idx + 1}`}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="text-xs text-green-600 hover:underline"
                      disabled={processingId === request.request_id}
                      onClick={() => handleRespond(request.request_id, 'accept')}
                    >
                      {processingId === request.request_id ? 'Đang xử lý...' : 'Chấp nhận'}
                    </button>
                    <button
                      className="text-xs text-red-600 hover:underline"
                      disabled={processingId === request.request_id}
                      onClick={() => handleRespond(request.request_id, 'reject')}
                    >
                      Từ chối
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
          <button
            className="mt-2 text-sm text-blue-500 hover:text-blue-700"
            onClick={() => setShowInvites(false)}
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
