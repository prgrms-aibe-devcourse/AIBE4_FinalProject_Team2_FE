import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function parseJwt(token) {
    try {
        const base64Payload = token.split('.')[1];
        const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(payload);
    } catch (e) {
        return null;
    }
}

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const accessToken = searchParams.get('accessToken');
            const refreshToken = searchParams.get('refreshToken');

            if (!accessToken || !refreshToken) {
                alert("로그인 정보가 올바르지 않습니다.");
                navigate('/login');
                return;
            }

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            const decoded = parseJwt(accessToken);
            if (decoded?.role) {
                localStorage.setItem('role', decoded.role);
            }

            alert("소셜 로그인에 성공했습니다!");
            navigate('/');
        } catch (error) {
            console.error("OAuth callback 처리 실패:", error);
            alert("로그인 처리 중 문제가 발생했습니다.");
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div className="vh-100 d-flex align-items-center justify-content-center bg-dark text-white">
            로그인 처리 중...
        </div>
    );
};

export default OAuthCallback;