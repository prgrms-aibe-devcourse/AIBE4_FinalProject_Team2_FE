import React, { useRef, useState } from "react";
import { Container, Card, Form, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 
import axios from "../../api/axios";
import { parseJobPosting } from "../../api/jobPosting";

const ResumeWrite = () => {
  const navigate = useNavigate();

  // 1. 채용 공고 상태 관리
  const [jobDescription, setJobDescription] = useState("");
  const [isJobLoading, setIsJobLoading] = useState(false);

  // 2. 자기소개서 상태 관리
  const [resumeItems, setResumeItems] = useState([
    { subtitle: "", content: "" },
  ]);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const fileInputRef = useRef(null);

  // 3. AI 첨삭 로딩 상태 관리
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 전체 글자 수 계산 (모든 문항의 내용 길이 합산)
  const totalCharCount = resumeItems.reduce(
    (acc, item) => acc + (item.content?.length || 0),
    0
  );

  // ==========================================
  // 💼 1. 채용 공고 불러오기 기능
  // ==========================================
  const handleLoadJobPosting = async () => {
    const url = window.prompt("분석할 원티드 채용 공고 URL을 입력해주세요:");
    if (!url) return;

    setIsJobLoading(true);
    try {
      const response = await parseJobPosting(url);
      if (response.success) {
        const data = response.data;
        const jdText = `[${data.companyName}] ${data.jobTitle}\n\n[주요 업무]\n${data.mainTasks}\n\n[자격 요건]\n${data.qualifications}`;
        setJobDescription(jdText);
      } else {
        alert("공고를 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("공고 파싱 에러:", error);
      alert("공고를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsJobLoading(false);
    }
  };

  // ==========================================
  // 📄 2. 자기소개서 파일 업로드 및 API 연동
  // ==========================================
  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsFileLoading(true);
    try {
      const response = await axios.post("/resumes/extract", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const parsedItems = response.data.data;
      console.log("백엔드에서 넘겨준 파싱 데이터:", parsedItems);

      if (parsedItems && parsedItems.length > 0) {
        const mappedItems = parsedItems.map((item) => {
          // 🔥 500자 자르기 로직 제거: 원본 내용 그대로 저장
          return {
            subtitle: item.question || "",
            content: item.answer || "",
          };
        });
        setResumeItems(mappedItems);
        alert("파일 분석이 완료되었습니다!");
      } else {
        alert("파일에서 추출된 내용이 없습니다.");
      }
    } catch (error) {
      console.error("이력서 파싱 실패:", error);
      alert("이력서 파일 분석 중 오류가 발생했습니다.");
    } finally {
      setIsFileLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // 📝 3. 에디터 UI 텍스트 포맷팅 (B, I, U)
  // ==========================================
  const applyFormat = (index, formatType) => {
    const textarea = document.getElementById(`content-textarea-${index}`);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = resumeItems[index].content;

    if (start === end) {
      alert("서식을 적용할 텍스트를 드래그하여 선택해주세요.");
      return;
    }

    const selectedText = currentText.substring(start, end);
    let formattedText = "";

    if (formatType === "bold") formattedText = `**${selectedText}**`;
    else if (formatType === "italic") formattedText = `*${selectedText}*`;
    else if (formatType === "underline")
      formattedText = `<u>${selectedText}</u>`;

    let newContent =
      currentText.substring(0, start) +
      formattedText +
      currentText.substring(end);

    // 🔥 500자 제한 방어 로직 제거
    updateResumeItem(index, "content", newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formattedText.length);
    }, 0);
  };

  // ==========================================
  // 🔄 4. 입력칸 동적 제어
  // ==========================================
  const updateResumeItem = (index, field, value) => {
    const newItems = [...resumeItems];
    newItems[index][field] = value;
    setResumeItems(newItems);
  };

  const addResumeItem = () => {
    setResumeItems([...resumeItems, { subtitle: "", content: "" }]);
  };

  const removeResumeItem = (index) => {
    const newItems = resumeItems.filter((_, i) => i !== index);
    setResumeItems(newItems);
  };

  // ==========================================
  // ✨ 5. AI 첨삭 요청 기능
  // ==========================================
  const handleAiAnalysis = async () => {
    const hasContent = resumeItems.some((item) => item.content.trim() !== "");
    if (!hasContent) {
      alert("자기소개서 내용을 최소 한 문항 이상 입력해주세요.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const combinedContent = resumeItems
        .filter((item) => item.content.trim() !== "")
        .map((item) => `[${item.subtitle}]\n${item.content}`)
        .join("\n\n");

      const today = new Date().toISOString().split("T")[0].replace(/-/g, "");
      const resumePayload = {
        title: `자기소개서_${today}`,
        content: combinedContent,
      };

      const saveResponse = await axios.post("/resumes", resumePayload);
      const resumeId = saveResponse.data.data.id || saveResponse.data.data;

      const analyzeResponse = await axios.post(
        `/resumes/${resumeId}/analyze/normal`
      );
      
      const reportId = analyzeResponse.data.data;

      alert("AI 첨삭 요청이 완료되었습니다!");
      // 🔥 Progress 창으로 라우팅되도록 수정된 부분
      navigate(`/resumes/${resumeId}/reports/${reportId}/progress`);
    } catch (error) {
      console.error("AI 첨삭 요청 에러:", error);
      alert("AI 첨삭 처리 중 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: "850px" }}>
      <div className="text-center mb-5">
        <h2 className="fw-bold">AI 자기소개서 작성</h2>
        <p className="text-muted small">
          지원하려는 직무 공고와 작성 중인 자기소개서를 입력해주세요.
        </p>
      </div>

      {/* 1. 채용 공고 영역 */}
      <Card className="shadow-sm border-0 rounded-4 mb-4 p-4">
        <div className="d-flex justify-content-between mb-3 align-items-center">
          <h6 className="fw-bold m-0">💼 채용 공고 (선택 사항)</h6>
          <Button
            variant="link"
            className="text-decoration-none p-0 small text-primary fw-bold"
            onClick={handleLoadJobPosting}
            disabled={isJobLoading}
          >
            {isJobLoading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "공고 불러오기"
            )}
          </Button>
        </div>
        <Form.Control
          as="textarea"
          rows={4}
          className="bg-light border-0 p-3"
          placeholder="직무 설명(JD)이나 주요 자격 요건을 입력하세요. (우측 상단의 '공고 불러오기'를 통해 자동 입력 가능)"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          style={{ fontSize: "14px", lineHeight: "1.6", resize: "none" }}
        />
      </Card>

      {/* 2. 자기소개서 본문 영역 */}
      <div className="bg-white rounded-4 shadow-sm border-0 pt-4 pb-3 px-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#0d6efd"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" />
            </svg>
            <h6 className="fw-bold m-0 fs-5">자기소개서 본문</h6>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* 🔥 상단: 전체 글자 수 제한 없이 '총 N자'로 표시 */}
            <span className="small fw-bold text-muted">
              총 {totalCharCount.toLocaleString()}자
            </span>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".hwpx,.pdf,.doc,.docx"
            />
            <Button
              variant="outline-secondary"
              className="bg-white d-flex align-items-center gap-2 fw-bold border"
              style={{
                padding: "6px 14px",
                fontSize: "14px",
                borderRadius: "8px",
              }}
              onClick={handleFileUploadClick}
              disabled={isFileLoading}
            >
              {isFileLoading ? (
                <Spinner size="sm" animation="border" />
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 16H15V10H19L12 3L5 10H9V16ZM5 20V18H19V20H5Z" />
                  </svg>
                  파일 업로드
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 에디터 본문 영역 */}
        {resumeItems.map((item, index) => (
          <div
            key={index}
            className="mb-4 position-relative rounded-4 p-4"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            {/* 툴바 */}
            <div
              className="d-flex align-items-center mb-3 pb-3 border-bottom"
              style={{ borderColor: "#e9ecef" }}
            >
              <span
                onClick={() => applyFormat(index, "bold")}
                className="fw-bold me-4 text-secondary"
                style={{ cursor: "pointer", fontSize: "15px" }}
                title="굵게"
              >
                B
              </span>
              <span
                onClick={() => applyFormat(index, "italic")}
                className="fst-italic me-4 text-secondary"
                style={{ cursor: "pointer", fontSize: "15px" }}
                title="기울임"
              >
                I
              </span>
              <span
                onClick={() => applyFormat(index, "underline")}
                className="text-decoration-underline me-4 text-secondary"
                style={{ cursor: "pointer", fontSize: "15px" }}
                title="밑줄"
              >
                U
              </span>
            </div>

            {/* 소제목 입력칸 */}
            <Form.Control
              type="text"
              value={item.subtitle}
              onChange={(e) =>
                updateResumeItem(index, "subtitle", e.target.value)
              }
              placeholder="소제목을 입력하세요 (예: 지원동기 및 포부)"
              className="border-0 bg-transparent fw-bold px-0 mb-2 shadow-none"
              style={{ fontSize: "16px" }}
            />

            {/* 내용 입력칸 (🔥 maxLength 속성 제거됨) */}
            <Form.Control
              id={`content-textarea-${index}`}
              as="textarea"
              rows={6}
              value={item.content}
              onChange={(e) =>
                updateResumeItem(index, "content", e.target.value)
              }
              placeholder="작성하신 자기소개서 내용을 이곳에 입력해주세요."
              className="border-0 bg-transparent px-0 shadow-none text-secondary"
              style={{
                fontSize: "15px",
                resize: "vertical",
                lineHeight: "1.8",
              }}
            />

            {/* 🔥 문항별 글자 수 카운터 ('N자 / 500자'에서 'N자'로 변경) */}
            <div className="text-end mt-2">
              <small className="fw-bold text-muted">
                {(item.content || "").length.toLocaleString()}자
              </small>
            </div>

            {/* 삭제 버튼 */}
            {resumeItems.length > 1 && (
              <Button
                variant="link"
                className="text-muted position-absolute top-0 end-0 p-3 text-decoration-none"
                onClick={() => removeResumeItem(index)}
              >
                ✕
              </Button>
            )}
          </div>
        ))}

        <div className="text-center mb-4">
          <Button
            variant="link"
            className="text-decoration-none fw-bold text-primary"
            onClick={addResumeItem}
          >
            + 문항 추가하기
          </Button>
        </div>

        {/* 하단 푸터 */}
        <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
          <div className="d-flex align-items-center gap-2">
            <span className="text-success small fw-bold d-flex align-items-center gap-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
              </svg>
              최종 저장: 방금 전
            </span>
            <span
              className="text-muted small ms-2"
              style={{ fontSize: "13px" }}
            >
              <span style={{ color: "#ced4da" }}>●</span> 내용은 브라우저에 자동
              저장됩니다.
            </span>
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              className="bg-white fw-bold border px-3"
              style={{ borderRadius: "8px" }}
            >
              임시 저장
            </Button>

            {/* AI 첨삭 받기 버튼 */}
            <Button
              variant="primary"
              className="fw-bold px-4 d-flex align-items-center gap-2"
              style={{ borderRadius: "8px", backgroundColor: "#0d6efd" }}
              onClick={handleAiAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <Spinner size="sm" animation="border" />
              ) : (
                <>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                  </svg>
                  ✨ AI 첨삭 받기
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ResumeWrite;