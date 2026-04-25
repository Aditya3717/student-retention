import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentLayout from './layouts/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import CareerGuidance from './pages/student/CareerGuidance';
import Academics from './pages/student/Academics';
import Analytics from './pages/student/Analytics';
import Profile from './pages/student/Profile';
import Settings from './pages/student/Settings';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PendingVerification from './pages/auth/PendingVerification';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Verify token exists and role is student
  const isAuthenticated = token && user.role === 'student';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check verification status
  if (user.verificationStatus === 'pending' || user.verificationStatus === 'rejected') {
    return <Navigate to="/pending" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pending" element={<PendingVerification />} />
        
        {/* Protected Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute>
            <StudentLayout />
          </ProtectedRoute>
        }>
          <Route index element={<StudentDashboard />} />
          <Route path="academics" element={<Academics />} />
          <Route path="careers" element={<CareerGuidance />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/" element={<Navigate to="/student" replace />} />
        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
