import axios from 'axios';

// 기본 Axios 인스턴스 설정
// VITE_API_BASE_URL은 .env 파일에 설정 (예: http://localhost:8081 또는 ngrok 주소)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, // 쿠키/인증 정보 포함
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true' // Ngrok 사용 시 경고창 무시
    }
});

export const interviewApi = {
    // 1. 면접 세션 생성
    startInterview: async (data) => {
        const response = await api.post('/api/interviews/start', data);
        return response.data;
    },

    // 2. 음성 면접 시작 (Retell 토큰 발급)
    startVoiceSession: async (sessionId, memberId = 1) => {
        const response = await api.post(`/api/interviews/${sessionId}/voice/start`, null, {
            params: { memberId }
        });
        return response.data;
    },

    // 3. 면접 종료 처리 (상태를 DONE으로 변경)
    endInterview: async (sessionId, memberId = 1) => {
        const response = await api.patch(`/api/interviews/${sessionId}/end`, null, {
            params: { memberId }
        });
        return response.data;
    },

    // 4. 결과 리포트 조회
    getReport: async (sessionId, memberId = 1) => {
        const response = await api.get(`/api/interviews/${sessionId}/report`, {
            params: { memberId }
        });
        return response.data;
    }
};