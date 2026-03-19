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
import AdminOperationsPage from "./pages/admin/AdminOperationsPage.jsx";

import OpsDashboardPage from "./pages/ops/OpsDashboardPage.jsx";
import OpsAlertsPage from "./pages/ops/OpsAlertsPage.jsx";
import OpsQueuePage from "./pages/ops/OpsQueuePage.jsx";
import OpsIssuesPage from "./pages/ops/OpsIssuesPage.jsx";
import OpsLogsPage from "./pages/ops/OpsLogsPage.jsx";

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

import JobPostingPage from "./pages/jobposting/JobPostingPage.jsx";
import ResumePage from "./pages/resume/ResumePage.jsx"; 

function App() {
    const location = useLocation();
    const isAdminOrOpsRoute =
        location.pathname.startsWith("/admin") || location.pathname.startsWith("/ops");

    return (
        <>
            {!isAdminOrOpsRoute && <Navbar />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/correction" element={<Correction />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} />

                {/* 관리자 */}
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

                <Route
                    path="/admin/operations"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <AdminOperationsPage />
                        </ProtectedRoute>
                    }
                />

                {/* 운영 관제 */}
                <Route
                    path="/ops/dashboard"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <OpsDashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ops/alerts"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <OpsAlertsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ops/queue"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <OpsQueuePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ops/issues"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <OpsIssuesPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ops/logs"
                    element={
                        <ProtectedRoute requireAdmin={true}>
                            <OpsLogsPage />
                        </ProtectedRoute>
                    }
                />

                {/* 면접 코칭 컨설턴트 */}
                <Route path="/job-posting" element={<JobPostingPage />} />
                {/* AI 자기소개서 분석*/}
                <Route path="/resume" element={<ResumePage />} />

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
            </Routes>

            {!isAdminOrOpsRoute && <Footer />}
        </>
    );
}

export default App;