import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonPlayer from "./pages/LessonPlayer";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import ParentPortal from "./pages/ParentPortal";
import { useAuth } from "./hooks/useAuth";
import AdminQuiz from "./pages/admin/AdminQuiz";

// Admin Imports
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminAddLesson from "./pages/admin/AdminAddLesson";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

function App() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen font-black text-2xl text-frica-green animate-pulse">
        Loading FricaLearn...
      </div>
    );

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
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

          {/* Student Routes */}
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
            path="/parent"
            element={user ? <ParentPortal /> : <Navigate to="/login" />}
          />

          {/* --- Admin Protected Routes --- */}
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
            path="/admin/analytics"
            element={
              user?.is_admin == 1 ? (
                <AdminAnalytics />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
