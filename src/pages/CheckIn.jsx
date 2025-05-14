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

export function Checkin() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = 'd';
  const rows = [];

  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, dateFormat);
      const isCurrent = isSameDay(day, today);

      days.push(
        <div
          key={day}
          className={`w-[14.2%] py-4 rounded-lg text-center font-medium transition-all
            ${!isCurrent ? 'text-gray-400' : ''}
            ${isCurrent && !isCheckedIn ? 'bg-blue-500 text-white' : ''}
            ${isCurrent && isCheckedIn ? 'bg-gray-500 text-white' : ''}`}
        >
          {formattedDate}
        </div>
      );
      day = addDays(day, 1);
    }

    rows.push(
      <div className="flex justify-between mb-1" key={day}>
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

          {rows}

          <button
            onClick={() => {
              if (!isCheckedIn) {
                setIsCheckedIn(true);
              }
            }}
            disabled={isCheckedIn}
            className={`mt-6 px-6 py-2 rounded-xl text-white font-semibold transition 
              ${isCheckedIn ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isCheckedIn ? 'Đã điểm danh' : 'Điểm danh'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkin;
