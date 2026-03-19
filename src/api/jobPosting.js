import api from "./axios"; 

export const parseJobPosting = async (url) => {
    try {
        const response = await api.post(`/job-postings/parse?url=${encodeURIComponent(url)}`);
        return response.data;
    } catch (error) {
        console.error("공고 파싱 실패:", error);
        throw error;
    }
};