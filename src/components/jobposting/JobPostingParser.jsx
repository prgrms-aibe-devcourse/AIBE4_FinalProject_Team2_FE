import React, { useState } from "react";
import { parseJobPosting } from "../../api/jobPosting";
import "./JobPostingParser.css"; 

const JobPostingParser = () => {
  const [url, setUrl] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleParseClick = async () => {
    if (!url.trim()) {
      alert("채용 공고 URL을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");
    setParsedData(null);

    try {
      const response = await parseJobPosting(url);
      
      if (response.success) {
        setParsedData(response.data);
      } else {
        setError("파싱에 실패했습니다.");
      }
    } catch (err) {
      setError("서버 통신 중 에러가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="job-parser-container">
      <h3 className="job-parser-title">채용 공고 AI 분석기</h3>
      
      <div className="job-parser-input-group">
        <input
          type="text"
          className="job-parser-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="원티드 채용 공고 URL을 붙여넣으세요 (예: https://www.wanted.co.kr/wd/146317)"
        />
        <button 
          className="job-parser-btn"
          onClick={handleParseClick} 
          disabled={isLoading}
        >
          {isLoading ? "AI 분석 중..." : "파싱하기"}
        </button>
      </div>

      {error && <p className="job-parser-error">{error}</p>}

      {/* 분석 결과가 있으면 화면에 렌더링 */}
      {parsedData && (
        <div className="job-parser-result-box">
          <h4 className="job-parser-job-title">
            [{parsedData.companyName}] {parsedData.jobTitle}
          </h4>
          
          <div className="job-parser-info-section">
            <strong>🔹 주요 업무:</strong>
            <p>{parsedData.mainTasks}</p>
          </div>
          
          <div className="job-parser-info-section">
            <strong>🔹 요구 스택:</strong>
            <p>{parsedData.requiredSkills?.length > 0 ? parsedData.requiredSkills.join(", ") : "없음"}</p>
          </div>

          <div className="job-parser-info-section">
            <strong>🔹 우대 사항:</strong>
            <p>{parsedData.preferred}</p>
          </div>

          <div className="job-parser-info-section">
            <strong>면접 예상 질문 리스트:</strong>
            <ul className="job-parser-question-list">
              {parsedData.expectedQuestions?.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostingParser;