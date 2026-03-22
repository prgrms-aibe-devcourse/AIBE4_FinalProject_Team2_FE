import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Nav,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const ResumeResult = () => {
  const { resumeId, reportId } = useParams();
  const navigate = useNavigate();

  const [reportData, setReportData] = useState(null);
  const [originalResume, setOriginalResume] = useState([]);
  const [activeTab, setActiveTab] = useState("correction");
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 원본 자소서 파싱
  const parseResumeContent = (text) => {
    if (!text) return [];
    const blocks = text.split(/(?=\n*\[.*?\]\n)/).filter(Boolean);
    return blocks
      .map((block) => {
        const match = block.trim().match(/^\[(.*?)\]\n([\s\S]*)$/);
        if (match) {
          return { subtitle: match[1].trim(), content: match[2].trim() };
        }
        return { subtitle: "", content: block.trim() };
      })
      .filter((item) => item.content.length > 0);
  };

  // 🌟 AI JSON 데이터 파싱 헬퍼
  const tryParseJSON = (text) => {
    if (!text) return null;
    try {
      const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      let parsed = JSON.parse(cleaned);
      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed);
        } catch (e) {}
      }
      return parsed;
    } catch (e) {
      return null;
    }
  };

  // 📝 1. 세부 문장 교정 렌더러
  const formatSentenceCorrections = (text) => {
    const parsedData = tryParseJSON(text);
    const jsonData = Array.isArray(parsedData)
      ? parsedData
      : parsedData && Object.values(parsedData).find(Array.isArray);

    if (jsonData) {
      return jsonData.map((item, idx) => {
        const targetOriginal =
          item.original || item.Original || item.원문 || item["수정 전"] || "";
        const targetCorrected =
          item.corrected ||
          item.Corrected ||
          item.수정본 ||
          item["수정 후"] ||
          "";
        const targetReason =
          item.reason || item.Reason || item.이유 || item["교정 이유"] || "";

        return (
          <Card
            key={idx}
            className="mb-4 border-0 shadow-sm rounded-4 overflow-hidden"
          >
            {targetOriginal && (
              <div
                className="p-3"
                style={{
                  backgroundColor: "#fff1f2",
                  borderBottom: "1px dashed #ffe4e6",
                }}
              >
                <Badge bg="danger" className="mb-2 px-2 py-1 shadow-sm">
                  수정 전
                </Badge>
                <div
                  style={{
                    color: "#be123c",
                    fontSize: "14.5px",
                    textDecoration: "line-through",
                    lineHeight: "1.6",
                  }}
                >
                  {targetOriginal}
                </div>
              </div>
            )}
            {targetCorrected && (
              <div
                className="p-3"
                style={{
                  backgroundColor: "#f0fdf4",
                  borderBottom: "1px dashed #dcfce7",
                }}
              >
                <Badge bg="success" className="mb-2 px-2 py-1 shadow-sm">
                  수정 후 (제안)
                </Badge>
                <div
                  style={{
                    color: "#166534",
                    fontSize: "14.5px",
                    fontWeight: "600",
                    lineHeight: "1.6",
                  }}
                >
                  {targetCorrected}
                </div>
              </div>
            )}
            {targetReason && (
              <div className="p-3 bg-white">
                <Badge bg="secondary" className="mb-2 px-2 py-1 shadow-sm">
                  💡 교정 이유
                </Badge>
                <div
                  style={{
                    color: "#475569",
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  {targetReason}
                </div>
              </div>
            )}
          </Card>
        );
      });
    }
    return <div className="result-text-block">{text}</div>;
  };

  // 📑 2. 문단 요약 렌더러
  const formatParagraphSummaries = (text) => {
    const parsedData = tryParseJSON(text);
    const jsonData = Array.isArray(parsedData)
      ? parsedData
      : parsedData && Object.values(parsedData).find(Array.isArray);

    if (jsonData) {
      return jsonData.map((item, idx) => {
        const targetSummary =
          item.summary || item.Summary || item.요약 || item["요약 내용"] || "";
        return (
          <div
            key={idx}
            className="mb-3 p-3 bg-white rounded-4 border shadow-sm d-flex gap-3 align-items-start"
          >
            <Badge
              bg="dark"
              className="rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 shadow-sm"
              style={{ width: "28px", height: "28px", fontSize: "13px" }}
            >
              {idx + 1}
            </Badge>
            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.7",
                fontSize: "14.5px",
                color: "#334155",
                marginTop: "2px",
              }}
            >
              {targetSummary}
            </div>
          </div>
        );
      });
    }
    return <div className="result-text-block">{text}</div>;
  };

  // 🎯 3. 핵심 키워드 매칭 렌더러
  const formatKeywordAnalysis = (text) => {
    const parsed = tryParseJSON(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const matched =
        parsed.matchedKeywords || parsed.matched || parsed.일치키워드 || [];
      const missing =
        parsed.missingKeywords || parsed.missing || parsed.부족키워드 || [];

      return (
        <Row className="g-3 mt-2">
          <Col md={6}>
            <Card className="border-success h-100 shadow-sm">
              <Card.Header className="bg-success text-white fw-bold py-2">
                ✅ 자소서에 포함된 강점 키워드
              </Card.Header>
              <Card.Body>
                {matched.length > 0 ? (
                  matched.map((k, i) => (
                    <Badge
                      key={i}
                      bg="white"
                      text="success"
                      className="border border-success me-2 mb-2 px-2 py-1 shadow-sm"
                    >
                      {k}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted small">
                    일치하는 키워드가 부족합니다.
                  </span>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-danger h-100 shadow-sm">
              <Card.Header className="bg-danger text-white fw-bold py-2">
                ⚠️ 보완이 필요한 키워드
              </Card.Header>
              <Card.Body>
                {missing.length > 0 ? (
                  missing.map((k, i) => (
                    <Badge
                      key={i}
                      bg="white"
                      text="danger"
                      className="border border-danger me-2 mb-2 px-2 py-1 shadow-sm"
                    >
                      {k}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted small">
                    부족한 키워드가 없습니다! 완벽합니다.
                  </span>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      );
    }
    return <div className="result-text-block">{text}</div>;
  };

  // 🎙️ 4. 면접 예상 질문 렌더러
  const formatExpectedQuestions = (text) => {
    const parsedData = tryParseJSON(text);
    const questions = Array.isArray(parsedData)
      ? parsedData
      : parsedData && parsedData.expectedQuestions
        ? parsedData.expectedQuestions
        : [];

    if (questions.length > 0) {
      return questions.map((q, idx) => (
        <div
          key={idx}
          className="mb-3 p-3 bg-white rounded-4 border shadow-sm d-flex gap-3 align-items-center"
        >
          <Badge
            bg="warning"
            text="dark"
            className="rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 shadow-sm"
            style={{ width: "32px", height: "32px", fontSize: "14px" }}
          >
            Q{idx + 1}
          </Badge>
          <div
            className="fw-bold"
            style={{ fontSize: "15px", color: "#1e293b" }}
          >
            {q}
          </div>
        </div>
      ));
    }
    return <div className="result-text-block">{text}</div>;
  };

  // 📊 5. 상세 매칭 피드백 렌더러 (🔥 궁극의 통합 파싱 + 점수 뱃지 + 가독성 완벽 지원)
  const formatMatchingFeedback = (text) => {
    if (!text) return null;

    let parts = [];

    // 1. AI가 항목 구분을 '/' 로만 한 경우 방어
    if (text.includes("/") && !text.includes("[")) {
      parts = text.split(/\s*\/\s*/).filter(p => p.trim() !== "");
    } else {
      // 2. '[' 이나 '1.', '2.' 같은 번호 앞에서 정확히 자르기
      const cleanText = text.replace(/\s*[\/\|]\s*(?=\[|\d+\.)/g, "\n");
      parts = cleanText.split(/(?=\[|(?:\n|^)\s*\d+\.)/).filter(p => p.trim() !== "");
    }

    const sections = [];

    parts.forEach((part, index) => {
      let title = "";
      let content = part.trim();
      let scoreText = "";

      // 패턴 A: [제목] 내용
      const bracketMatch = content.match(/^\[(.*?)\]([\s\S]*)$/);
      // 패턴 B: 1. 제목 : 내용 (또는 1. 제목 내용)
      const numberMatch = content.match(/^(\d+\.\s*[^:\-\n]+)[:\-]?([\s\S]*)$/);
      // 패턴 C: 제목 : 내용
      const colonMatch = content.match(/^([^:\-\n]+)[:\-]([\s\S]*)$/);

      if (bracketMatch) {
        title = bracketMatch[1].trim();
        content = bracketMatch[2].trim();
      } else if (/^\d+\./.test(content) && numberMatch) {
        title = numberMatch[1].trim();
        content = numberMatch[2].trim();
      } else if (colonMatch && parts.length > 1) {
        title = colonMatch[1].trim();
        content = colonMatch[2].trim();
      } else {
        title = `평가 항목 ${index + 1}`;
      }

      // 제목 앞의 숫자 찌꺼기(1., 2. 등) 제거
      title = title.replace(/^[0-9]+[\.\-]?\s*/, '').trim();
      // 내용 앞의 불필요한 기호 제거
      content = content.replace(/^[\s/:\-\[\]]+/, '').replace(/\]$/, '').trim();

      // 🚀 🌟 완벽한 점수 분리 로직 (제목에 있든 내용에 있든 무조건 찾아냅니다!)
      const scoreRegex = /(\d+)\s*\/\s*(\d+)(점?)/;
      
      const titleScoreMatch = title.match(scoreRegex);
      if (titleScoreMatch) {
         scoreText = `${titleScoreMatch[1]} / ${titleScoreMatch[2]}`;
         title = title.replace(scoreRegex, '').replace(/[:\(\[\-\s]+$/, '').trim();
      } else {
         const contentScoreMatch = content.match(new RegExp('^' + scoreRegex.source));
         if (contentScoreMatch) {
             scoreText = `${contentScoreMatch[1]} / ${contentScoreMatch[2]}`;
             // 내용 본문에서 점수 부분만 싹 삭제
             content = content.replace(new RegExp('^' + scoreRegex.source + '[:\\(\\[\\-\\s]*'), '').trim();
         }
      }

      // 끝에 지저분하게 남은 기호 최종 청소
      title = title.replace(/[:\-]$/, '').trim();

      sections.push({ title, content, scoreText });
    });

    // 🌟 본문 렌더링 헬퍼 (마침표 줄바꿈 & 글머리 기호 예쁘게 처리)
    const renderContent = (contentStr) => {
      if (!contentStr) return "상세 내용이 제공되지 않았습니다.";
      
      const spacedContent = contentStr.replace(/(?<=[가-힣a-zA-Z])\.\s+/g, ".\n");
      const lines = spacedContent.split('\n');

      return lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} style={{ height: "8px" }}></div>;
        
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          return (
            <div key={idx} className="d-flex align-items-start mb-2">
              <span className="me-2 text-primary fw-bold" style={{ fontSize: "16px", lineHeight: "1.4" }}>•</span>
              <span style={{ color: "#1e293b", wordBreak: "keep-all" }}>{trimmed.substring(1).trim()}</span>
            </div>
          );
        }
        return (
           <div key={idx} className="mb-2" style={{ color: "#1e293b", wordBreak: "keep-all" }}>
             {trimmed}
           </div>
        );
      });
    };

    if (sections.length > 0) {
      return (
        <div className="d-flex flex-column gap-4 mt-2">
          {sections.map((sec, index) => (
            <div key={index} className="bg-white border rounded-4 overflow-hidden shadow-sm">
              <div className="px-4 py-3 d-flex align-items-center border-bottom" style={{ backgroundColor: "#f8fafc" }}>
                <Badge bg="primary" className="me-3 rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: "26px", height: "26px", fontSize: "14px" }}>
                  {index + 1}
                </Badge>
                <h6 className="fw-bold text-dark m-0" style={{ fontSize: "15.5px", letterSpacing: "-0.3px" }}>
                  {sec.title || `평가 항목 ${index + 1}`}
                </h6>
                
                {/* 🚀 우측 상단으로 완벽하게 분리된 예쁜 점수 뱃지 */}
                {sec.scoreText && (
                  <div className="ms-auto">
                    <Badge bg="white" text="primary" className="border border-primary px-3 py-2 rounded-pill shadow-sm d-flex align-items-center gap-1" style={{ fontSize: "13px" }}>

                      <span className="fw-bold">{sec.scoreText}</span>
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-4" style={{ fontSize: "14.5px", lineHeight: "1.8", letterSpacing: "-0.3px" }}>
                {renderContent(sec.content)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return <div className="result-text-block">{text}</div>;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportRes, resumeRes] = await Promise.all([
          axios.get(`/resumes/${resumeId}/reports/${reportId}`),
          axios.get(`/resumes/${resumeId}`),
        ]);

        const report = reportRes.data.data;
        if (report.status !== "COMPLETED") {
          navigate(`/resumes/${resumeId}/reports/${reportId}/progress`, {
            replace: true,
          });
          return;
        }

        setReportData(report);
        setOriginalResume(parseResumeContent(resumeRes.data.data.content));
      } catch (error) {
        console.error("데이터 조회 실패:", error);
        alert("분석 결과 데이터를 불러오는 데 실패했습니다.");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [resumeId, reportId, navigate]);

  if (isLoading || !reportData) {
    return (
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner
          animation="border"
          variant="primary"
          style={{ width: "3rem", height: "3rem" }}
        />
        <h5 className="mt-4 fw-bold text-muted">
          분석 데이터를 불러오는 중입니다...
        </h5>
      </Container>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "correction":
        return reportData.sentenceCorrections?.trim() &&
          reportData.sentenceCorrections !== "[]" ? (
          <div className="p-4 rounded-4 bg-light">
            <h5 className="fw-bold mb-4 text-dark">📝 세부 문장 교정 포인트</h5>
            {formatSentenceCorrections(reportData.sentenceCorrections)}
          </div>
        ) : (
          <EmptyState message="세부 교정 결과가 없습니다." />
        );

      case "summary":
        return reportData.paragraphSummaries?.trim() &&
          reportData.paragraphSummaries !== "[]" ? (
          <div className="p-4 rounded-4 bg-light">
            <h5 className="fw-bold mb-4 text-dark">📑 핵심 문단 요약</h5>
            {formatParagraphSummaries(reportData.paragraphSummaries)}
          </div>
        ) : (
          <EmptyState message="문단 요약 결과가 없습니다." />
        );

      case "revised":
        return reportData.revisedFullContent?.trim() ? (
          <div className="p-4 rounded-4 bg-white border shadow-sm">
            <h5 className="fw-bold mb-4 text-dark border-bottom pb-3">
              ✨ AI 최종 교정 완성본
            </h5>
            <div className="result-text-block">
              {reportData.revisedFullContent}
            </div>
          </div>
        ) : (
          <EmptyState message="최종 완성본 결과가 없습니다." />
        );

      case "overall":
        return reportData.overallFeedback?.trim() ? (
          <div className="p-4 rounded-4 bg-light">
            <h5 className="fw-bold mb-4 text-primary">💡 종합 방향성 피드백</h5>
            <div className="result-text-block bg-white p-4 rounded-4 shadow-sm border">
              {reportData.overallFeedback}
            </div>
          </div>
        ) : (
          <EmptyState message="종합 피드백 결과가 없습니다." />
        );

      case "match":
        return (
          <div className="p-4 rounded-4 bg-white border shadow-sm">
            {/* 상단: 매칭 점수 헤더 */}
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <h5 className="fw-bold m-0 text-success">
                🎯 직무 적합도(JD) 매칭 결과
              </h5>
              <div className="text-end text-success bg-success bg-opacity-10 px-3 py-2 rounded-3 border border-success">
                <span className="small fw-bold d-block">AI 매칭 점수</span>
                <h3 className="fw-bold m-0">{reportData.matchScore}점</h3>
              </div>
            </div>

            {/* 👇 기존에 있던 '분석 기준 채용공고 정보' 회색 박스는 삭제했습니다! 👇 */}

            {/* 중단: 상세 매칭 피드백 (항목별 박스 UI) */}
            {reportData.matchingFeedback?.trim() && (
              <div
                className="mb-4 p-4 rounded-4"
                style={{ backgroundColor: "#f1f5f9" }}
              >
                <h6 className="fw-bold text-dark mb-3 border-bottom pb-2">
                  💡 상세 매칭 피드백
                </h6>
                {formatMatchingFeedback(reportData.matchingFeedback)}
              </div>
            )}

            {/* 하단: 핵심 키워드 분석 */}
            {reportData.keywordAnalysis?.trim() && (
              <div>
                <h6 className="fw-bold text-secondary mb-2">
                  핵심 키워드 분석
                </h6>
                {formatKeywordAnalysis(reportData.keywordAnalysis)}
              </div>
            )}
          </div>
        );

      case "interview":
        return reportData.expectedQuestions?.trim() ? (
          <div className="p-4 rounded-4 bg-light">
            <h5 className="fw-bold mb-4 text-dark border-bottom pb-3">
              🎙️ 자소서 기반 예상 면접 질문
            </h5>
            {formatExpectedQuestions(reportData.expectedQuestions)}
          </div>
        ) : (
          <EmptyState message="예상 면접 질문 결과가 없습니다." />
        );

      default:
        return null;
    }
  };

  return (
    <Container
      fluid
      className="py-4 px-lg-5"
      style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <Badge
            bg={reportData.analysisType === "FIT_MATCH" ? "success" : "primary"}
            className="px-3 py-2 mb-2 rounded-pill shadow-sm"
            style={{ fontSize: "13px" }}
          >
            {reportData.analysisType === "FIT_MATCH"
              ? "맞춤형 직무 매칭 분석"
              : "일반 자소서 첨삭"}
          </Badge>
          <h3 className="fw-bold m-0 text-dark">AI 자소서 분석 리포트</h3>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            className="fw-bold rounded-pill shadow-sm bg-white"
            onClick={() => navigate(-1)}
          >
            수정하러 가기
          </Button>
          <Button
            variant="dark"
            className="fw-bold rounded-pill shadow-sm"
            onClick={() => navigate("/")}
          >
            메인으로
          </Button>
        </div>
      </div>

      <Row className="g-4" style={{ height: "calc(100vh - 160px)" }}>
        {/* 왼쪽: 원본 자소서 */}
        <Col lg={5} className="h-100">
          <Card className="shadow-sm border-0 rounded-4 h-100 d-flex flex-column">
            <Card.Header className="bg-white border-bottom pb-3 pt-4 px-4">
              <h5 className="fw-bold m-0 text-secondary">
                📄 내가 작성한 자기소개서
              </h5>
            </Card.Header>
            <Card.Body
              className="px-4 pb-4 pt-4 custom-scrollbar"
              style={{ overflowY: "auto", backgroundColor: "#f8fafc" }}
            >
              {originalResume.map((item, idx) => (
                <div
                  key={idx}
                  className="mb-4 p-4 rounded-4 bg-white shadow-sm border"
                >
                  {item.subtitle && (
                    <h6 className="fw-bold text-dark mb-3">
                      [{item.subtitle}]
                    </h6>
                  )}
                  <div className="result-text-block">{item.content}</div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* 오른쪽: AI 분석 탭 */}
        <Col lg={7} className="h-100">
          <Card className="shadow-sm border-0 rounded-4 h-100 d-flex flex-column">
            <Card.Header className="bg-white border-bottom pt-4 pb-3 px-4">
              <h5 className="fw-bold mb-3 text-dark">
                ✨ AI 첨삭 및 피드백 결과
              </h5>
              <Nav
                variant="pills"
                className="gap-2 d-flex flex-wrap custom-nav-pills"
              >
                <Nav.Item>
                  <Nav.Link
                    eventKey="correction"
                    active={activeTab === "correction"}
                    onClick={() => setActiveTab("correction")}
                  >
                    세부 교정
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="summary"
                    active={activeTab === "summary"}
                    onClick={() => setActiveTab("summary")}
                  >
                    문단 요약
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="revised"
                    active={activeTab === "revised"}
                    onClick={() => setActiveTab("revised")}
                  >
                    최종 완성본
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="overall"
                    active={activeTab === "overall"}
                    onClick={() => setActiveTab("overall")}
                  >
                    종합 피드백
                  </Nav.Link>
                </Nav.Item>
                {reportData.analysisType === "FIT_MATCH" && (
                  <>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="match"
                        active={activeTab === "match"}
                        onClick={() => setActiveTab("match")}
                        className={
                          activeTab === "match" ? "bg-success text-white" : ""
                        }
                      >
                        매칭 결과
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="interview"
                        active={activeTab === "interview"}
                        onClick={() => setActiveTab("interview")}
                        className={
                          activeTab === "interview"
                            ? "bg-warning text-dark"
                            : ""
                        }
                      >
                        예상 질문
                      </Nav.Link>
                    </Nav.Item>
                  </>
                )}
              </Nav>
            </Card.Header>
            <Card.Body
              className="px-4 pb-4 pt-4 custom-scrollbar"
              style={{ overflowY: "auto" }}
            >
              {renderTabContent()}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style type="text/css">
        {`
          .custom-scrollbar::-webkit-scrollbar { width: 8px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
          .custom-nav-pills .nav-link { font-weight: 600; padding: 8px 18px; border-radius: 50px; color: #64748b; background-color: #f1f5f9; transition: 0.2s; }
          .custom-nav-pills .nav-link:hover:not(.active) { background-color: #e2e8f0; color: #0f172a; }
          .custom-nav-pills .nav-link.active { background-color: #0d6efd; color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .result-text-block { white-space: pre-wrap; line-height: 1.8; font-size: 14.5px; color: #475569; }
        `}
      </style>
    </Container>
  );
};

// 텅 빈 결과를 표시하는 헬퍼 컴포넌트
const EmptyState = ({ message }) => (
  <div
    className="text-center p-5 text-muted mt-5 bg-light rounded-4 border"
    style={{ borderStyle: "dashed !important" }}
  >
    {message}
  </div>
);

export default ResumeResult;
