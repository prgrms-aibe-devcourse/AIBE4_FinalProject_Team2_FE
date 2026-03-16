import axios from 'axios';

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
};

// 1. axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8081/api/v1', // 백엔드 서버 주소
    timeout: 5000,
    withCredentials: true,           // 쿠키(RefreshToken) 공유를 위해 필수
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Access Token을 공통 헤더에 설정하거나 삭제하는 함수
 */
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// 2. 요청(Request) 인터셉터
api.interceptors.request.use(
    (config) => {
        // 로컬 스토리지 등에 저장된 토큰이 있다면 요청마다 헤더에 삽입
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 3. 응답(Response) 인터셉터: 401 에러(만료) 발생 시 자동 재발급 로직
api.interceptors.response.use(
    (response) => response, // 성공 응답은 그대로 반환
    async (error) => {
        const originalRequest = error.config;

        // 에러 상태가 401(Unauthorized)이고, 아직 재시도를 안 했다면
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 무한 루프 방지용 플래그

            try {
                const refreshToken = getCookie('refreshToken');

                // 백엔드 /reissue 엔드포인트 호출
                // 주의: 인스턴스(api) 대신 기본 axios를 사용하여 헤더 꼬임을 방지합니다.
                const res = await axios.post('http://localhost:8081/reissue',
                    { refreshToken },
                    { withCredentials: true }
                );

                if (res.status === 200) {
                    const newAccessToken = res.data.accessToken;

                    // 새로운 토큰 저장 및 헤더 갱신
                    localStorage.setItem('accessToken', newAccessToken);
                    setAuthToken(newAccessToken);

                    // 실패했던 원래 요청의 헤더를 새 토큰으로 교체 후 재요청
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (reissueError) {
                // Refresh Token도 만료되었거나 오류가 나면 로그아웃 처리
                console.error('세션이 만료되었습니다. 다시 로그인해주세요.');
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(reissueError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;