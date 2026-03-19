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

  // ✅ 기업명 다듬기 (대괄호나 여백 제거)
  const refineCompanyName = (name) => {
    if (!name) return "기업명 미상";
    // "[원티드랩]" 처럼 오는 경우 대괄호를 제거합니다.
    return name.replace(/\[|\]/g, "").trim();
  };

  // ✅ 직무명 다듬기 (지저분한 뒷부분만 날리고, 앞부분의 [프론트엔드] 같은 정보는 살림)
  const refineJobTitle = (title) => {
    if (!title) return "직무 미상";
    
    // "채용 공고 | 원티드" 같이 공통적으로 붙는 지저분한 꼬리표만 정교하게 자릅니다.
    // split() 대신 정규식으로 '채용'이라는 단어 뒤의 모든 것을 날리되, 
    // "채용 연계형 인턴" 같은 경우는 날아가지 않도록 보통 맨 뒤에 붙는 패턴만 날립니다.
    let refined = title.replace(/(채용\s*공고\s*\|).*$/g, "").trim();
    refined = refined.replace(/\|\s*원티드.*$/g, "").trim();
    
    // 만약 파싱된 제목이 "프론트엔드 개발자 [신규서비스]" 라면 그대로 살려둡니다.
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

  const renderListItems = (data, emptyMessage) => {
    if (!data) return null;
    if (Array.isArray(data)) {
      return data.length > 0 ? (
        data.map((item, idx) => <li key={idx}>{item}</li>)
      ) : null;
    }
    return <li>{String(data)}</li>;
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
            {/* ✅ 하드코딩된 대괄호 [] 를 제거하고, refineCompanyName 함수 적용 */}
            <span className="job-parser-company-badge">
              {refineCompanyName(parsedData.companyName)}
            </span>
            <h4 className="job-parser-job-title">
              {refineJobTitle(parsedData.jobTitle)}
            </h4>
          </div>

          {/* ... (이하 렌더링 코드는 이전과 완전히 동일) ... */}
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

          {Array.isArray(parsedData.expectedQuestions) && parsedData.expectedQuestions.length > 0 && (
            <div className="job-parser-info-section">
              <strong>🎯 면접 예상 질문</strong>
              <ul className="job-parser-question-list">
                {renderListItems(parsedData.expectedQuestions, "예상 질문을 생성하지 못했습니다.")}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobPostingParser;