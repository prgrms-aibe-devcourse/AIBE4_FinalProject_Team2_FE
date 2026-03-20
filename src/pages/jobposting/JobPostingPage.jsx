import React from "react";
import JobPostingParser from "../../components/jobposting/JobPostingParser";

const JobPostingPage = () => {
  return (
    <div style={{ padding: "40px 2  0px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px", color: "#333" }}>SyncTalk 면접 코칭 </h2>
      <p style={{ marginBottom: "30px", color: "#666" }}>
        관심 있는 채용 공고의 URL을 입력하면, AI가 핵심 역량과 예상 면접 질문을 자동으로 추출해 드립니다.
      </p>
      
      {/* 1. 채용 공고 파서 컴포넌트 */}
      <JobPostingParser />

      {/* 추후 여기에 '내 북마크 공고 리스트' 같은 다른 컴포넌트들을 추가할 수 있습니다. */}
    </div>
  );
};

export default JobPostingPage;