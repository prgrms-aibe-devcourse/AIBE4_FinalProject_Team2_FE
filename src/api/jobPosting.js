import api from "./axios"; // 기존에 설정된 axios 인스턴스 가져오기

// 1. URL로 채용 공고 파싱 요청
export const parseJobPosting = async (url) => {
    try {
        // Query Parameter로 url을 넘겨야 하므로 encodeURIComponent 사용
        const response = await api.post(`/api/v1/job-postings/parse?url=${encodeURIComponent(url)}`);
        return response.data; // { success, code, data: {...} } 형태 반환
    } catch (error) {
        console.error("공고 파싱 실패:", error);
        throw error;
    }
};
