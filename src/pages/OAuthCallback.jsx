import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../api/axios'; // 기존에 만든 axios 인스턴스

const OAuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoginInfo = async () => {
            try {
                /**
                 * 1. 백엔드에 세션 확인 요청
                 * 백엔드가 SuccessHandler에서 쿠키를 구웠기 때문에,
                 * 이 요청 시 브라우저가 자동으로 쿠키를 실어 보냅니다. (withCredentials: true 필수)
                 */
                const response = await api.get('/auth/me'); // 유저 정보 확인용 엔드포인트

                // 2. 백엔드에서 넘겨준 JSON 데이터에서 accessToken 추출
                const { accessToken, nickname } = response.data;

                if (accessToken) {
                    // 3. 클라이언트 측에서 사용할 수 있도록 토큰 저장 및 헤더 설정
                    localStorage.setItem('accessToken', accessToken);
                    setAuthToken(accessToken);

                    alert(`${nickname || '사용자'}님, 환영합니다!`);
                    navigate('/main', { replace: true });
                } else {
                    throw new Error("토큰을 찾을 수 없습니다.");
                }
            } catch (error) {
                console.error("소셜 로그인 처리 중 오류:", error);
                alert("로그인에 실패했습니다. 다시 시도해주세요.");
                navigate('/login');
            }
        };

        fetchLoginInfo();
    }, [navigate]);

    // Bootstrap 스타일 유지
    return (
        <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-dark text-white">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p>보안 세션을 확인 중입니다...</p>
        </div>
    );
};

export default OAuthCallback;