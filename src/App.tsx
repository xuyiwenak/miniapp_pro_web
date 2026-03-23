import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import HomePage from './pages/HomePage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminLayout from './pages/admin/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import SystemPage from './pages/admin/SystemPage'
import UsersPage from './pages/admin/UsersPage'
import WorksPage from './pages/admin/WorksPage'
import FeedbackPage from './pages/admin/FeedbackPage'
import ProtectedRoute from './pages/admin/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter basename="/app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="system" element={<SystemPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="works" element={<WorksPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
