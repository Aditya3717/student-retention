import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentManagement from './pages/admin/StudentManagement';
import AtRiskStudents from './pages/admin/AtRiskStudents';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="at-risk" element={<AtRiskStudents />} />
          <Route path="ml" element={<div className="text-white p-8 font-bold text-xl text-center mt-20">ML Model Training & Dataset Upload</div>} />
        </Route>

        <Route path="*" element={<div className="text-stone-400 flex items-center justify-center min-h-screen">404 - Admin Domain Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
