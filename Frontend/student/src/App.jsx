import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import CareerGuidance from './pages/student/CareerGuidance';
import Academics from './pages/student/Academics';
import Login from './pages/auth/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="academics" element={<Academics />} />
          <Route path="careers" element={<CareerGuidance />} />
          <Route path="analytics" element={<div className="text-white p-8">Detailed Analytics - Coming Soon</div>} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<div className="text-white flex items-center justify-center min-h-screen">404 - Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
