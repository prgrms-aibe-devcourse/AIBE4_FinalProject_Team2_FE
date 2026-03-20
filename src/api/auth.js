import api from './axios';

export const auth = {
    // 1. 이메일 인증 코드 요청
    requestCode: async (email) => {
        const response = await api.post('/auth/email/request', { email });
        return response.data;
    },

    // 2. 인증 코드 확인
    verifyCode: async (email, code) => {
        const response = await api.post('/auth/email/verify', { email, code });
        return response.data;
    },

    // 3. 최종 회원가입 요청
    signup: async (signupData) => {
        const response = await api.post('/auth/signup', signupData);
        return response;
    }
};