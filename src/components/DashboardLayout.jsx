import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
// import Practice from '../pages/Practice';
// import Ranking from '../pages/Ranking';
// import Shop from '../pages/Shop';
import Profile from '../pages/Profile';
// import More from '../pages/More';
import Missions from '../pages/Missions';
import Learn from '../pages/Learn';


export default function DashboardLayout() {
  return (
    <div className="flex bg-white">
      <Sidebar />
      <div className="flex-1 p-4">
        <Routes  >
          <Route path="/mission" element={<Missions />} />
          {/* <Route path="/practice" element={<Practice />} /> */}
          {/* <Route path="/ranking" element={<Ranking />} /> */}
          {/* <Route path="/shop" element={<Shop />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/learn" element={<Learn />} />
          {/* <Route path="/more" element={<More />} /> */}
          
        </Routes>
      </div>
    </div>
  );
}
