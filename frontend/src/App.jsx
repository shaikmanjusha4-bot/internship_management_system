import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Internships from './pages/Internships';
import InternshipDetails from './pages/InternshipDetails';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import Profile from './pages/Profile';
import RecommendedInternships from './pages/RecommendedInternships';
import MyApplications from './pages/MyApplications';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageInternships from './pages/ManageInternships';
import AddInternship from './pages/AddInternship';
import EditInternship from './pages/EditInternship';
import ManageApplications from './pages/ManageApplications';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/internships" element={<Internships />} />
              <Route path="/internships/:id" element={<InternshipDetails />} />

              {/* Student Protected Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recommended"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <RecommendedInternships />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-applications"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <MyApplications />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/internships"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageInternships />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/internships/add"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AddInternship />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/internships/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <EditInternship />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/applications"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageApplications />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
