import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/api/v1', // Spring Boot 서버 주소
    withCredentials: true,
    timeout: 5000,
});

// 요청 인터셉터: 로컬 스토리지에서 토큰을 꺼내 헤더에 주입
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터: 401(만료) 에러 발생 시 로그아웃 처리 등
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;