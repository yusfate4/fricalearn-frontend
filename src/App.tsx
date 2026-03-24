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
import ParentProgressView from "./pages/ParentProgressView"; // 👈 Public Family View
import StudentAnalytics from "./pages/student/StudentAnalytics";

// --- Student Pages ---
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonPlayer from "./pages/LessonPlayer";
import Leaderboard from "./pages/Leaderboard";
import RewardsCatalog from "./pages/student/RewardsCatalog";
import StudentChat from "./pages/student/StudentChat";

// --- Admin Pages ---
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminAddLesson from "./pages/admin/AdminAddLesson";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminQuiz from "./pages/admin/AdminQuiz";
import AdminRedemptions from "./pages/admin/AdminRedemptions";
import ManageRewards from "./pages/admin/ManageRewards";
import AdminChatList from "./pages/admin/AdminChatList";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminParentPortal from "./pages/admin/AdminParentPortal";
import AdminLessonList from "./pages/admin/AdminLessonList";
import AdminEditLesson from "./pages/admin/AdminEditLesson";

function App() {
  const { user, loading } = useAuth();

  // Global Loading State with FricaLearn Branding
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-black text-2xl text-[#2D5A27] animate-pulse italic uppercase tracking-tighter">
            FricaLearn...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#2D5A27] selection:text-white">
        <Routes>
          {/* --- 🌍 PUBLIC ROUTES (No Login Required) --- */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" />}
          />

          {/* 👨‍👩‍👧‍👦 The Public Parent View */}
          <Route
            path="/parent/view/:studentId"
            element={<ParentProgressView />}
          />

          {/* --- 🏠 ROOT REDIRECT --- */}
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
          />

          {/* --- 🎓 STUDENT PROTECTED ROUTES --- */}
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

          {/* 📊 Personal Analytics (Optional userId for Admin View) */}
          <Route
            path="/analytics/:userId?"
            element={user ? <StudentAnalytics /> : <Navigate to="/login" />}
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
            path="/messages"
            element={user ? <StudentChat /> : <Navigate to="/login" />}
          />

          {/* --- 🔐 ADMIN PROTECTED ROUTES (is_admin == 1) --- */}
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

          {/* 🚀 FIXED: Lesson Manager (List View) */}
          <Route
            path="/admin/lessons"
            element={
              user?.is_admin == 1 ? (
                <AdminLessonList />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          {/* 🚀 FIXED: Added the Edit Lesson Page */}
          <Route
            path="/admin/edit-lesson/:id"
            element={
              user?.is_admin == 1 ? (
                <AdminEditLesson />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          {/* 🚀 FIXED: Changed path to /admin/add-lesson to match Sidebar.tsx */}
          <Route
            path="/admin/add-lesson"
            element={
              user?.is_admin == 1 ? (
                <AdminAddLesson />
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
            path="/admin/users"
            element={
              user?.is_admin == 1 ? (
                <AdminUsers />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          <Route
            path="/admin/parents"
            element={
              user?.is_admin == 1 ? (
                <AdminParentPortal />
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

          {/* --- 404 FALLBACK --- */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
