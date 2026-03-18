import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/global/Navigation.jsx';
import Footer from './components/global/Footer.jsx';
import Home from './pages/Home.jsx';
import LoginPage from "./pages/auth/LoginPage.jsx";
import Correction from "./pages/Correction.jsx";
import Signup from './pages/auth/Signup.jsx';
import OAuthCallback from "./pages/auth/OAuthCallback.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ProtectedRoute from "./components/global/ProtectedRoute.jsx";

import AdminMembersPage from "./pages/admin/AdminMembersPage.jsx";
import AdminMemberDetailPage from "./pages/admin/AdminMemberDetailPage.jsx";
import AdminCreditsPage from "./pages/admin/AdminCreditsPage.jsx";
import AdminUsageLogsPage from "./pages/admin/AdminUsageLogsPage.jsx";
import AdminUsageStatisticsPage from "./pages/admin/AdminUsageStatisticsPage.jsx";
import MyPageLayout from "./components/mypage/MyPageLayout.jsx";
import Profile from './pages/mypage/Profile.jsx';
import ProfileEdit from './pages/mypage/ProfileEdit.jsx';
import ResumesList from "./pages/mypage/ResumesList.jsx";
import DashBoard from "./pages/mypage/DashBoard.jsx";
import InterviewsList from "./pages/mypage/InterviewsList.jsx";
import MyResumeDetail from "./pages/mypage/MyResumeDetail.jsx";
import MyInterviewDetail from "./pages/mypage/MyInterviewDetail.jsx";
import QuestionBookmark from "./pages/mypage/QuestionsBookmark.jsx";
import ResumeEdit from "./pages/mypage/ResumeEdit.jsx";

import SetupPage from './pages/interview/SetupPage.jsx';
import TextInterview from './pages/interview/TextInterview.jsx';
import VoiceInterview from './pages/interview/VoiceInterview.jsx';
import ReportPage from './pages/interview/ReportPage.jsx';

function App() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");

    return (
        <>
            {!isAdminRoute && <Navbar />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/correction" element={<Correction />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} />

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/members"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminMembersPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/members/:memberId"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminMemberDetailPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/credits"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminCreditsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/usage/logs"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminUsageLogsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/usage/statistics"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminUsageStatisticsPage />
                        </ProtectedRoute>
                    }
                />

                {/*마이페이지*/}
                <Route path="/mypage" element={<MyPageLayout />}>
                    <Route path="dashboard" element={<DashBoard />} />
                    <Route path="resumes" element={<ResumesList />} />
                    <Route path="interviews" element={<InterviewsList />} />
                    <Route path="bookmarks" element={<QuestionBookmark />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="profile/edit" element={<ProfileEdit />} />
                </Route>
                <Route path="/mypage/resumes/:id" element={<MyResumeDetail />} />
                <Route path="/mypage/resume/edit/:id" element={<ResumeEdit />} />
                <Route path="/mypage/interviews/:id" element={<MyInterviewDetail />} />

                {/*면 접*/}
                <Route path="/interview/setup" element={<SetupPage />} />
                <Route path="/interview/text/:sessionId" element={<TextInterview />} />
                <Route path="/interview/voice/:sessionId" element={<VoiceInterview />} />
                <Route path="/interview/report/:sessionId" element={<ReportPage />} />

            </Routes>
            <Footer />
        </>
    );
}

export default App;