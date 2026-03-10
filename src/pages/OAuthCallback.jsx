import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');

        if (accessToken && refreshToken) {
            // 1. 토큰 저장
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // 2. 메인 페이지로 이동
            alert("소셜 로그인에 성공했습니다!");
            navigate('/');
        } else {
            alert("로그인 정보가 올바르지 않습니다.");
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return <div className="vh-100 d-flex align-items-center justify-content-center bg-dark text-white">로그인 처리 중...</div>;
};

export default OAuthCallback;