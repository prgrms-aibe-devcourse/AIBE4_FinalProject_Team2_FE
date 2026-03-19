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
      setError("서버 통신 중 에러가 발생했습니다. URL을 다시 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const refineCompanyName = (name) => {
    if (!name) return "기업명 미상";
    return name.replace(/\[|\]/g, "").trim();
  };

  const refineJobTitle = (title) => {
    if (!title) return "직무 미상";
    let refined = title.replace(/(채용\s*공고\s*\|).*$/g, "").trim();
    refined = refined.replace(/\|\s*원티드.*$/g, "").trim();
    return refined || title; 
  };

  const renderTags = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;
    return (
      <div className="job-parser-tags">
        {data.map((item, idx) => (
          <span key={idx} className="job-parser-tag">{item}</span>
        ))}
      </div>
    );
  };

  const renderTextWithLineBreaks = (text) => {
    if (!text) return null;
    const lines = text.split("•").filter((line) => line.trim() !== "");
    if (lines.length === 0) return text;

    return (
      <ul className="job-parser-bullet-list">
        {lines.map((line, idx) => (
          <li key={idx}>{line.trim()}</li>
        ))}
      </ul>
    );
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

      {parsedData && (
        <div className="job-parser-result-box">
          <div className="job-parser-header">
            <span className="job-parser-company-badge">
              {refineCompanyName(parsedData.companyName)}
            </span>
            <h4 className="job-parser-job-title">
              {refineJobTitle(parsedData.jobTitle)}
            </h4>
          </div>

          {parsedData.mainTasks && parsedData.mainTasks !== "정보 없음" && parsedData.mainTasks !== "없음" && (
            <div className="job-parser-info-section">
              <strong>🔹 주요 업무</strong>
              <div>{renderTextWithLineBreaks(parsedData.mainTasks)}</div>
            </div>
          )}

          {parsedData.qualifications && parsedData.qualifications !== "정보 없음" && parsedData.qualifications !== "없음" && (
            <div className="job-parser-info-section">
              <strong>🔹 자격 요건</strong>
              <div>{renderTextWithLineBreaks(parsedData.qualifications)}</div>
            </div>
          )}

          {parsedData.preferred && parsedData.preferred !== "정보 없음" && parsedData.preferred !== "없음" && (
            <div className="job-parser-info-section">
              <strong>🔹 우대 사항</strong>
              <p>{parsedData.preferred}</p>
            </div>
          )}

          {parsedData.benefits && parsedData.benefits !== "정보 없음" && parsedData.benefits !== "없음" && (
            <div className="job-parser-info-section">
              <strong>🔹 복지 및 혜택</strong>
              <p>{parsedData.benefits}</p>
            </div>
          )}

          {Array.isArray(parsedData.requiredSkills) && parsedData.requiredSkills.length > 0 && (
            <div className="job-parser-info-section">
              <strong>🔹 요구 스택</strong>
              {renderTags(parsedData.requiredSkills)}
            </div>
          )}

          {/* ✅ 면접 예상 질문 영역을 화려하게 포장 */}
          {Array.isArray(parsedData.expectedQuestions) && parsedData.expectedQuestions.length > 0 && (
            <div className="job-parser-questions-section">
              <h4 className="job-parser-questions-title">🎯 AI 면접 예상 질문</h4>
              <p className="job-parser-questions-desc">
                지원하신 직무와 우대사항을 바탕으로 추출한 핵심 면접 질문입니다.
              </p>
              <div className="job-parser-questions-list">
                {parsedData.expectedQuestions.map((q, idx) => (
                  <div key={idx} className="job-parser-question-card">
                    <div className="job-parser-question-badge">Q{idx + 1}</div>
                    <div className="job-parser-question-text">{q}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
};

export default JobPostingParser;