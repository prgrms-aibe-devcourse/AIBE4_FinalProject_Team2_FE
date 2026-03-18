import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../../api/axios.js'; // 기존에 만든 axios 인스턴스

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
                        Authorization: null
                    }
                });

                console.log("auth/me response:", response.data);

                const payload = response.data.data ?? response.data;
                const { accessToken, nickname, role, email } = payload;

                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                    if (role) localStorage.setItem('role', role);
                    if (email) localStorage.setItem('email', email);
                    if (nickname) localStorage.setItem('nickname', nickname);

                    setAuthToken(accessToken);

                    alert(`${nickname || '사용자'}님, 환영합니다!`);
                    navigate('/', { replace: true });
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

    return (
        <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-white font-korean position-relative">

            {/* 배경 그리드 패턴 (이미지 ca4cf7 스타일) */}
            <div className="position-absolute w-100 h-100 opacity-05" style={{
                backgroundImage: 'radial-gradient(#1976D2 0.5px, transparent 0.5px)',
                backgroundSize: '24px 24px',
                zIndex: 0
            }}></div>

            <div className="text-center position-relative" style={{ zIndex: 1 }}>
                {/* 커스텀 스피너 영역 */}
                <div className="mb-4 position-relative d-inline-block">
                    {/* 중앙 아이콘 (선택 사항: 로고 아이콘 배치 가능) */}
                    <div className="p-3 bg-primary bg-opacity-10 rounded-circle mb-2">
                        <div className="spinner-border" role="status" style={{ color: '#1976D2', width: '3rem', height: '3rem' }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>

                <h5 className="fw-bold mb-2 text-dark">보안 세션 확인 중</h5>
                <p className="text-muted small">
                    안전한 접속을 위해 인증 정보를 확인하고 있습니다.<br />
                    잠시만 기다려 주세요.
                </p>

                {/* 하단 진행 바 (이미지 디자인 반영) */}
                <div className="mx-auto mt-4" style={{ width: '160px' }}>
                    <div className="progress" style={{ height: '4px', backgroundColor: '#E3F2FD' }}>
                        <div
                            className="progress-bar progress-bar-animated progress-bar-striped"
                            role="progressbar"
                            style={{ width: '100%', backgroundColor: '#1976D2' }}
                        ></div>
                    </div>
                </div>
            </div>

            <style>{`
      .font-korean { font-family: 'Pretendard', 'Noto Sans KR', sans-serif; }
      .opacity-05 { opacity: 0.05; }
    `}</style>
        </div>
    );
};

export default OAuthCallback;