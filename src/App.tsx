import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// --- Shared & Auth Pages ---
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ParentPortal from "./pages/ParentPortal";

// --- Student Pages ---
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonPlayer from "./pages/LessonPlayer";
import Leaderboard from "./pages/Leaderboard";
import RewardsCatalog from "./pages/student/RewardsCatalog";
import StudentChat from "./pages/student/StudentChat"; // ✅ Imported

// --- Admin Pages ---
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminAddLesson from "./pages/admin/AdminAddLesson";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminQuiz from "./pages/admin/AdminQuiz";
import AdminRedemptions from "./pages/admin/AdminRedemptions";
import ManageRewards from "./pages/admin/ManageRewards"; // 👈 ADDED THIS MISSING IMPORT
import AdminChatList from "./pages/admin/AdminChatList"; // ✅ Imported

function App() {
  const { user, loading } = useAuth();

  // Global Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen font-black text-2xl text-frica-green animate-pulse">
        Loading FricaLearn...
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* --- Root Redirect Logic --- */}
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" />}
          />

          {/* --- Student Protected Routes --- */}
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/courses"
            element={user ? <Courses /> : <Navigate to="/login" />}
          />
          <Route
            path="/courses/:id"
            element={user ? <CourseDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/lessons/:id"
            element={user ? <LessonPlayer /> : <Navigate to="/login" />}
          />
          <Route
            path="/leaderboard"
            element={user ? <Leaderboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/store"
            element={user ? <RewardsCatalog /> : <Navigate to="/login" />}
          />
          <Route
            path="/parent"
            element={user ? <ParentPortal /> : <Navigate to="/login" />}
          />
          <Route
            path="/messages"
            element={user ? <StudentChat /> : <Navigate to="/login" />}
          />

          {/* --- Admin Protected Routes (Founder's Control Room) --- */}
          {/* Note: All these paths use user?.is_admin == 1 for security */}
          <Route
            path="/admin"
            element={
              user?.is_admin == 1 ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/admin/courses"
            element={
              user?.is_admin == 1 ? (
                <AdminCourses />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/admin/lessons/new"
            element={
              user?.is_admin == 1 ? (
                <AdminAddLesson />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/admin/questions"
            element={
              user?.is_admin == 1 ? <AdminQuiz /> : <Navigate to="/dashboard" />
            }
          />
          <Route
            path="/admin/rewards"
            element={
              user?.is_admin == 1 ? (
                <AdminRedemptions />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/admin/manage-rewards"
            element={
              user?.is_admin == 1 ? (
                <ManageRewards />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/admin/analytics"
            element={
              user?.is_admin == 1 ? (
                <AdminAnalytics />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/admin/chats"
            element={
              user?.is_admin == 1 ? (
                <AdminChatList />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          {/* --- 404 Redirect --- */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
