import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../api/axios'; // 기존에 만든 axios 인스턴스

const OAuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoginInfo = async () => {
            try {
                // ⭐ 핵심 수정: 기존의 모든 인증 흔적을 지우고 시작합니다.
                localStorage.removeItem('accessToken'); 
                // 만약 axios 공통 헤더에 토큰이 설정되어 있다면 제거 (함수 이름은 본인의 프로젝트에 맞게 수정)
                // setAuthToken(null); 

                /**
                 * 헤더에 낡은 토큰이 실려나가지 않도록 
                 * 이 요청에서만 헤더를 명시적으로 비우거나 초기화합니다.
                 */
                const response = await api.get('/auth/me', {
                    headers: {
                        Authorization: null // 기존 헤더 무시
                    }
                });

                const { accessToken, nickname } = response.data;

                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                    setAuthToken(accessToken);

                    alert(`${nickname || '사용자'}님, 환영합니다!`);
                    navigate('/main', { replace: true });
                } else {
                    throw new Error("토큰을 찾을 수 없습니다.");
                }
            } catch (error) {
                console.error("소셜 로그인 처리 중 오류:", error);
                // 401 에러 등이 나면 아예 싹 비우는 처리를 추가
                localStorage.clear(); 
                alert("로그인 세션이 만료되었거나 실패했습니다.");
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