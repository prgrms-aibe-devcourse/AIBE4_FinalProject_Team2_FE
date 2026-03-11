import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navigation.jsx';
import Home from './pages/Home.jsx';
import LoginPage from "./pages/LoginPage.jsx";
import Correction from "./pages/Correction.jsx";
import Dashboard from "./pages/DashBoard.jsx";
import Signup from './pages/Signup.jsx';
import OAuthCallback from "./pages/OAuthCallback.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import AdminMembersPage from "./pages/admin/AdminMembersPage.jsx";
import AdminMemberDetailPage from "./pages/admin/AdminMemberDetailPage.jsx";
import AdminCreditsPage from "./pages/admin/AdminCreditsPage.jsx";
import AdminUsageLogsPage from "./pages/admin/AdminUsageLogsPage.jsx";
import AdminUsageStatisticsPage from "./pages/admin/AdminUsageStatisticsPage.jsx";

function App() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");

    return (
        <>
            {!isAdminRoute && <Navbar />}

            <Routes>
                <Route path="/main" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
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
            </Routes>
        </>
    );
}

export default App;