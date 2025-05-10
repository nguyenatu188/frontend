import React from 'react';
import { IconBolt, IconTarget, IconCoin, IconFlame } from "@tabler/icons-react";

const Missions = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 w-full max-w-md relative">
        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Nhiệm vụ hàng ngày</h2>

        {/* Danh sách nhiệm vụ */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <IconBolt className="h-6 w-6 text-yellow-500" />
            <div className="flex-1">
              <div className="text-sm font-medium">Kiếm 20 KN</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1 mb-1">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="text-xs text-gray-600">20/20</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <IconTarget className="h-6 w-6 text-green-500" />
            <div className="flex-1">
              <div className="text-sm font-medium">Hoàn thành 1 bài học hôm nay</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1 mb-1">
                <div className="bg-gray-300 h-2.5 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <div className="text-xs text-gray-600">0/1</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <IconBolt className="h-6 w-6 text-yellow-500" />
            <div className="flex-1">
              <div className="text-sm font-medium">Đạt 15 Điểm thưởng KN</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1 mb-1">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '33.33%' }}></div>
              </div>
              <div className="text-xs text-gray-600">5/15</div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Missions;
