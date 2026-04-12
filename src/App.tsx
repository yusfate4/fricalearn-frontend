import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useEffect, useState } from "react";

// --- 🏗️ LAYOUT COMPONENT ---
import Layout from "./components/Layout";

// --- 🚀 NEW LANDING PAGE ---
import LandingPage from "./pages/LandingPage";

// --- 🌍 SHARED & AUTH PAGES ---
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ParentProgressView from "./pages/ParentProgressView";
import StudentAnalytics from "./pages/student/StudentAnalytics";
import LiveRoom from "./pages/LiveRoom";
import VerifyNotice from "./pages/VerifyNotice"; 
import VerifyEmailHandler from "./pages/VerifyEmailHandler";

// --- 👨‍👩‍👧‍👦 PARENT PORTAL PAGES ---
import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentMessages from "./pages/parent/ParentMessages";
import SelectCourses from "./pages/parent/SelectCourses";
import PaymentPage from "./pages/parent/PaymentPage";

// --- 🎓 STUDENT PAGES ---
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import LessonPlayer from "./pages/LessonPlayer";
import Leaderboard from "./pages/Leaderboard";
import RewardsCatalog from "./pages/student/RewardsCatalog";
import MyRewards from "./pages/student/MyRewards";
import OluChat from "./pages/student/OluChat";

// --- 🔐 ADMIN/STAFF PAGES ---
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminAddLesson from "./pages/admin/AdminAddLesson";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminQuiz from "./pages/admin/AdminQuiz";
import AdminRedemptions from "./pages/admin/AdminRedemptions";
import ManageMarketplace from "./pages/admin/ManageMarketplace";
import AdminChatList from "./pages/admin/AdminChatList";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminParentPortal from "./pages/admin/AdminParentPortal";
import AdminLessonList from "./pages/admin/AdminLessonList";
import AdminEditLesson from "./pages/admin/AdminEditLesson";
import ManageLiveClasses from "./pages/admin/ManageLiveClasses";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminMasterSchedule from "./pages/admin/AdminMasterSchedule";
import AdminCourseList from "./pages/admin/AdminCourseList";
import AdminPaymentVerify from "./pages/admin/AdminPaymentVerify"; // 👈 This is your history page
import AdminTutorProfile from "./components/AdminTutorProfile"; 
import TutorDashboard from "./pages/admin/TutorDashboard";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const { user, loading } = useAuth();

  const [isImpersonating, setIsImpersonating] = useState(
    localStorage.getItem("is_impersonating") === "true",
  );

  useEffect(() => {
    const checkImpersonation = () => {
      const active = localStorage.getItem("is_impersonating") === "true";
      setIsImpersonating(active);
    };

    window.addEventListener("storage", checkImpersonation);
    const interval = setInterval(checkImpersonation, 500);

    return () => {
      window.removeEventListener("storage", checkImpersonation);
      clearInterval(interval);
    };
  }, []);

  // --- 👑 ROLE HELPERS ---
  const isActuallyAdmin = user?.role === "admin" || Number(user?.is_admin) === 1;
  const isTutor = user?.role === "tutor";
  
  /**
   * 🚀 THE STAFF HELPERS:
   * isStaff handles common academic routes.
   */
  const isStaff = isActuallyAdmin || isTutor;

  const canAccessStudentArea =
    user?.role === "student" ||
    (user?.role === "parent" && isImpersonating) ||
    isStaff;

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
          {/* --- 🚀 PUBLIC ROUTES --- */}
          <Route
            path="/"
            element={user ? <Navigate to={isStaff ? "/admin" : "/dashboard"} /> : <LandingPage />}
          />

          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to={isStaff ? "/admin" : "/dashboard"} />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/dashboard" />}
          />
          
          <Route path="/verify-notice" element={<VerifyNotice />} />
          <Route path="/verify-email/:id/:hash" element={<VerifyEmailHandler />} />
          <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
          <Route path="/reset-password" element={!user ? <ResetPassword /> : <Navigate to="/dashboard" />} />

          {/* --- 🏠 PROTECTED ROUTE TREE --- */}
          <Route
            path="/*"
            element={
              !user ? (
                <Navigate to="/login" />
              ) : (
                <Routes>
                  {/* Shared Dashboard Redirects */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* 📊 Root Admin Path (Differentiates between Admin and Tutor Dashboards) */}
                  <Route 
                    path="/admin" 
                    element={
                      isActuallyAdmin ? <AdminDashboard /> : 
                      isTutor ? <TutorDashboard /> : 
                      <Navigate to="/dashboard" />
                    } 
                  />

                  {/* 👨‍👩‍👧‍👦 Parent Portal */}
                  <Route
                    path="/parent/dashboard"
                    element={user?.role === "parent" ? <ParentDashboard /> : <Navigate to="/dashboard" />}
                  />
                  <Route
                    path="/parent/messages"
                    element={user?.role === "parent" ? <ParentMessages /> : <Navigate to="/dashboard" />}
                  />
                  <Route path="/select-courses" element={user?.role === "parent" ? <SelectCourses /> : <Navigate to="/login" />} />
                  <Route path="/payment" element={user?.role === "parent" ? <PaymentPage /> : <Navigate to="/login" />} />

                  {/* 🎓 Student Area (Accessible by Staff & Impersonating Parents) */}
                  <Route path="/courses" element={canAccessStudentArea ? <Courses /> : <Navigate to="/parent/dashboard" />} />
                  <Route path="/course-detail/:id" element={canAccessStudentArea ? <CourseDetail /> : <Navigate to="/parent/dashboard" />} />
                  <Route path="/lessons/:id" element={canAccessStudentArea ? <LessonPlayer /> : <Navigate to="/parent/dashboard" />} />
                  <Route path="/leaderboard" element={canAccessStudentArea ? <Leaderboard /> : <Navigate to="/parent/dashboard" />} />
                  <Route path="/store" element={canAccessStudentArea ? <RewardsCatalog /> : <Navigate to="/parent/dashboard" />} />
                  <Route path="/my-rewards" element={canAccessStudentArea ? <MyRewards /> : <Navigate to="/parent/dashboard" />} />
                  <Route path="/olu-chat" element={canAccessStudentArea ? <OluChat /> : <Navigate to="/parent/dashboard" />} />
                  <Route path="/analytics/:userId?" element={canAccessStudentArea ? <StudentAnalytics /> : <Navigate to="/parent/dashboard" />} />
                  <Route path="/live-room/:id" element={<LiveRoom />} />

                  {/* 👨‍🏫 Staff Shared Area (Admins & Tutors) */}
                  <Route path="/admin/lessons" element={isStaff ? <AdminLessonList /> : <Navigate to="/dashboard" />} />
                  <Route path="/admin/add-lesson" element={isStaff ? <AdminAddLesson /> : <Navigate to="/dashboard" />} />
                  <Route path="/admin/edit-lesson/:id" element={isStaff ? <AdminEditLesson /> : <Navigate to="/dashboard" />} />
                  <Route path="/admin/courses" element={isStaff ? <AdminCourses /> : <Navigate to="/dashboard" />} />
                  <Route path="/admin/users" element={isStaff ? <AdminUsers /> : <Navigate to="/dashboard" />} />
                  <Route path="/admin/parents" element={isStaff ? <AdminParentPortal /> : <Navigate to="/dashboard" />} />
                  <Route path="/admin/questions" element={isStaff ? <AdminQuiz /> : <Navigate to="/dashboard" />} />
                  <Route path="/admin/schedule" element={isStaff ? <AdminMasterSchedule /> : <Navigate to="/dashboard" />} />
                  <Route path="/admin/analytics" element={isStaff ? <AdminAnalytics /> : <Navigate to="/dashboard" />} />
                  <Route path="/admin/live-classes" element={isStaff ? <ManageLiveClasses /> : <Navigate to="/dashboard" />} />
                  <Route path="/admin/courses/list" element={isStaff ? <AdminCourseList /> : <Navigate to="/dashboard" />} />
                  <Route path="/admin/profile" element={isStaff ? <AdminTutorProfile /> : <Navigate to="/dashboard" />} />
                  
                  {/* 🚀 FIXED: Enrollment History Path (Accessible to both Admin & Tutor) */}
                  <Route path="/admin/payments/history" element={isStaff ? <AdminPaymentVerify /> : <Navigate to="/admin" />} />

                  {/* ⛔ SuperAdmin (Founder) Only Routes */}
                  <Route path="/admin/payments" element={isActuallyAdmin ? <AdminPayments /> : <Navigate to="/admin" />} />
                  <Route path="/admin/rewards" element={isActuallyAdmin ? <AdminRedemptions /> : <Navigate to="/admin" />} />
                  <Route path="/admin/manage-rewards" element={isActuallyAdmin ? <ManageMarketplace /> : <Navigate to="/admin" />} />
                  <Route path="/admin/chats" element={isActuallyAdmin ? <AdminChatList /> : <Navigate to="/admin" />} />

                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;