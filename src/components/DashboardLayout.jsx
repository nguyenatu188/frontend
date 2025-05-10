import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
// import Practice from '../pages/Practice';
import LeaderBoard from '../pages/LeaderBoards';
// import Shop from '../pages/Shop';
import Profile from '../pages/Profile';
// import More from '../pages/More';
import Missions from '../pages/Missions';
import RightSidebar from './RightSidebar';


export default function DashboardLayout() {
  return (
    <div className="flex bg-white">
      <Sidebar />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/mission" element={<Missions />} />
          {/* <Route path="/practice" element={<Practice />} /> */}
          <Route path="/leaderboard" element={<LeaderBoard />} />
          {/* <Route path="/shop" element={<Shop />} /> */}
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/more" element={<More />} /> */}
          
        </Routes>
      </div>
      <RightSidebar/>
    </div>
  );
}
