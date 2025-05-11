import React, { useState } from 'react';
import { IconFlame, IconHexagon, IconUserPlus, IconCoin } from "@tabler/icons-react";
import { useAuthContext } from '../context/AuthContext';

const RightSidebar = () => {
  const [showInvites, setShowInvites] = useState(false);
  const { authUser, isLoading } = useAuthContext();

  console.log('authUser:', authUser); // Debug authUser

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
        <div className="fixed top-16 right-4 w-64 bg-white border border-gray-200 rounded-lg shadow-md p-4 z-20">
          <h3 className="text-md font-semibold text-gray-800 mb-2">Lời mời kết bạn</h3>
          <ul className="space-y-2">
            <li className="text-sm text-gray-600">Phạm Công Quân</li>
            <li className="text-sm text-gray-600">Nguyễn Anh Tú</li>
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