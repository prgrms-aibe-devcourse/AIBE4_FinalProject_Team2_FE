import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const accessToken = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;