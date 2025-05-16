import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameDay,
} from 'date-fns';
import useCheckIn from '../hooks/useCheckIn';

export function Checkin() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const { checkedInDates, loading, error, setCheckedInDates } = useCheckIn();

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const hasCheckedInToday = checkedInDates.includes(todayStr);

  const handleCheckIn = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/api/v1/check-in', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Điểm danh thất bại');

      setIsCheckedIn(true);
      setCheckedInDates(prev => [...prev, todayStr]); // Cập nhật ngày điểm danh ngay
    } catch (err) {
      alert(err.message);
    }
  };

  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const dateFormat = 'd';
  const rows = [];

  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, dateFormat);
      const dateStr = format(day, 'yyyy-MM-dd');
      const isCurrent = isSameDay(day, today);
      const isChecked = checkedInDates.includes(dateStr);

      days.push(
        <div
          key={dateStr}
          className={`w-[14.2%] py-4 rounded-lg text-center font-medium transition-all
            ${!isCurrent && !isChecked ? 'text-gray-400' : ''}
            ${isChecked ? 'bg-green-500 text-white' : ''}
            ${isCurrent && !isChecked && !isCheckedIn ? 'bg-blue-500 text-white' : ''}
            ${isCurrent && (isChecked || isCheckedIn) ? 'bg-gray-500 text-white' : ''}
          `}
        >
          {formattedDate}
        </div>
      );

      day = addDays(day, 1);
    }

    rows.push(
      <div className="flex justify-between mb-1" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {format(monthStart, 'yyyy')}
          </div>
          <div className="text-lg text-gray-700 font-semibold mb-4 uppercase">
            {format(monthStart, 'MMMM')}
          </div>

          <div className="flex justify-between text-gray-600 font-semibold mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="w-[14.2%] text-center">
                {day.toUpperCase()}
              </div>
            ))}
          </div>

          {error && <div className="text-red-500 font-medium mb-4">{error}</div>}

          {loading ? (
            <div className="text-gray-500">Đang tải lịch sử điểm danh...</div>
          ) : (
            rows
          )}

          <button
            onClick={handleCheckIn}
            disabled={hasCheckedInToday || isCheckedIn}
            className={`mt-6 px-6 py-2 rounded-xl text-white font-semibold transition 
              ${hasCheckedInToday || isCheckedIn ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {hasCheckedInToday || isCheckedIn ? 'Đã điểm danh' : 'Điểm danh'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkin;
