import { Navigate, Outlet } from 'react-router-dom';

const AuthProtectedRoute = () => {
    // 로컬 스토리지에 토큰이 있는지 확인
    const isAuthenticated = !!localStorage.getItem('accessToken');

    if (!isAuthenticated) {
        alert("로그인이 필요한 서비스입니다.");
        return <Navigate to="/login" replace />;
    }

    // 인증되었다면 자식 라우트들(Outlet)을 렌더링
    return <Outlet />;
};

export default AuthProtectedRoute;