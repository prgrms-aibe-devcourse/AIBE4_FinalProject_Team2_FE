import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge, Spinner, Nav } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const ResumeResult = () => {
  const { resumeId, reportId } = useParams();
  const navigate = useNavigate();

  const [reportData, setReportData] = useState(null);
  const [originalResume, setOriginalResume] = useState([]);
  const [activeTab, setActiveTab] = useState("correction"); 
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 원본 자소서 파싱 로직
  const parseResumeContent = (text) => {
    if (!text) return [];
    
    const blocks = text.split(/(?=\n*\[.*?\]\n)/).filter(Boolean);
    
    return blocks.map((block) => {
      const match = block.trim().match(/^\[(.*?)\]\n([\s\S]*)$/);
      if (match) {
        return { subtitle: match[1].trim(), content: match[2].trim() };
      }
      return { subtitle: "", content: block.trim() }; 
    }).filter(item => item.content.length > 0); 
  };

  // 🌟 AI 원시 데이터 파싱 헬퍼 함수
  const tryParseJSON = (text) => {
    try {
      const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      
      if (Array.isArray(parsed)) return parsed;
      
      if (typeof parsed === 'object' && parsed !== null) {
        for (const key in parsed) {
          if (Array.isArray(parsed[key])) return parsed[key];
        }
      }
      return null;
    } catch (e) {
      return null; 
    }
  };

  // 📝 세부 문장 교정 렌더러
  const formatSentenceCorrections = (text) => {
    if (!text) return null;

    const jsonData = tryParseJSON(text);
    
    if (jsonData) {
      return jsonData.map((item, idx) => {
        const targetOriginal = item.original || item.Original || "";
        
        let qLabel = null;
        if (targetOriginal && originalResume.length > 0) {
          const cleanTarget = targetOriginal.replace(/\s+/g, '');
          const foundIdx = originalResume.findIndex(resume => 
            resume.content.replace(/\s+/g, '').includes(cleanTarget)
          );
          
          if (foundIdx !== -1) {
            qLabel = originalResume[foundIdx].subtitle || `문항 ${foundIdx + 1}`;
          }
        }

        return (
          <Card key={idx} className="mb-4 border-0 shadow-sm rounded-4 overflow-hidden">
            {qLabel && (
              <div className="px-3 py-2 border-bottom d-flex align-items-center gap-2" style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}>
                <Badge bg="secondary" className="rounded-pill shadow-sm">대상 문항</Badge>
                <span className="fw-bold" style={{ fontSize: "13.5px", color: "#475569" }}>
                  {qLabel}
                </span>
              </div>
            )}

            <div className="p-3" style={{ backgroundColor: "#fff1f2", borderBottom: "1px dashed #ffe4e6" }}>
              <Badge bg="danger" className="mb-2 px-2 py-1 shadow-sm">수정 전</Badge>
              <div style={{ color: "#be123c", fontSize: "14.5px", textDecoration: "line-through", lineHeight: "1.6" }}>
                {targetOriginal}
              </div>
            </div>
            <div className="p-3" style={{ backgroundColor: "#f0fdf4", borderBottom: "1px dashed #dcfce7" }}>
              <Badge bg="success" className="mb-2 px-2 py-1 shadow-sm">수정 후</Badge>
              <div style={{ color: "#166534", fontSize: "14.5px", fontWeight: "600", lineHeight: "1.6" }}>
                {item.corrected || item.Corrected}
              </div>
            </div>
            <div className="p-3 bg-white">
              <Badge bg="secondary" className="mb-2 px-2 py-1 shadow-sm">💡 교정 이유</Badge>
              <div style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6" }}>
                {item.reason || item.Reason}
              </div>
            </div>
          </Card>
        );
      });
    }

    return <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "14.5px", color: "#495057" }}>{text}</div>;
  };

  // 📑 문단 요약 렌더러
  const formatParagraphSummaries = (text) => {
    if (!text) return null;

    const jsonData = tryParseJSON(text);

    if (jsonData) {
      return jsonData.map((item, idx) => (
        <div key={idx} className="mb-3 p-3 bg-white rounded-4 border shadow-sm d-flex gap-3 align-items-start">
          <Badge bg="dark" className="rounded-circle d-flex justify-content-center align-items-center flex-shrink-0 shadow-sm" style={{ width: "28px", height: "28px", fontSize: "13px" }}>
            {item.paragraphNumber || item.ParagraphNumber || (idx + 1)}
          </Badge>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.7", fontSize: "14.5px", color: "#334155", marginTop: "2px" }}>
            {item.summary || item.Summary}
          </div>
        </div>
      ));
    }

    return <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "14.5px", color: "#495057" }}>{text}</div>;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportRes, resumeRes] = await Promise.all([
          axios.get(`/resumes/${resumeId}/reports/${reportId}`),
          axios.get(`/resumes/${resumeId}`)
        ]);

        const report = reportRes.data.data;
        
        if (report.status !== "COMPLETED") {
          navigate(`/resumes/${resumeId}/reports/${reportId}/progress`, { replace: true });
          return;
        }

        setReportData(report);
        const rawContent = resumeRes.data.data.content;
        setOriginalResume(parseResumeContent(rawContent));

      } catch (error) {
        console.error("데이터 조회 실패:", error);
        alert("분석 결과 데이터를 불러오는 데 실패했습니다. 서버 상태를 확인해주세요.");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [resumeId, reportId, navigate]);

  if (isLoading || !reportData) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
          <h5 className="mt-4 fw-bold text-muted">분석 데이터를 불러오는 중입니다...</h5>
        </div>
      </Container>
    );
  }

  // 🔥 하드코딩 제거: "MATCH" 글자가 포함되어 있으면 무조건 직무 분석으로 간주
  const isMatchAnalysis = reportData.analysisType && reportData.analysisType.includes("MATCH");

  // 👉 탭 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      
      case "correction":
        const hasCorrection = reportData.sentenceCorrections?.trim();
        if (!hasCorrection) {
          return <div className="text-center p-5 text-muted mt-5 bg-light rounded-4">세부 교정 결과가 없습니다.</div>;
        }
        return (
          <div className="p-4 rounded-4 bg-light border-0">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark">
              📝 세부 문장 교정 포인트
            </h5>
            {formatSentenceCorrections(reportData.sentenceCorrections)}
          </div>
        );

      case "summary":
        const hasSummary = reportData.paragraphSummaries?.trim();
        if (!hasSummary) {
          return <div className="text-center p-5 text-muted mt-5 bg-light rounded-4">문단 요약 결과가 없습니다.</div>;
        }
        return (
          <div className="p-4 rounded-4 bg-light border-0">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark">
              📑 핵심 문단 요약
            </h5>
            {formatParagraphSummaries(reportData.paragraphSummaries)}
          </div>
        );

      case "revised":
        const hasRevised = reportData.revisedFullContent?.trim();
        if (!hasRevised) {
          return <div className="text-center p-5 text-muted mt-5 bg-light rounded-4">최종 완성본 결과가 없습니다.</div>;
        }
        return (
          <div className="p-4 rounded-4 bg-white border shadow-sm">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark border-bottom pb-3">
              ✨ AI 최종 교정 완성본
            </h5>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.9", fontSize: "15px", color: "#212529" }}>
              {reportData.revisedFullContent}
            </div>
          </div>
        );

      case "overall":
        return reportData.overallFeedback?.trim() ? (
          <div className="p-4 rounded-4 bg-light border-0">
            <h5 className="fw-bold mb-4 text-primary d-flex align-items-center gap-2">
              💡 전체적인 방향성 피드백
            </h5>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "14.5px", color: "#495057" }}>
              {reportData.overallFeedback}
            </div>
          </div>
        ) : (
          <div className="text-center p-5 text-muted mt-5 bg-light rounded-4">해당 항목에 대한 분석 결과가 없습니다.</div>
        );
        
      case "match":
        return (
          <div className="p-4 rounded-4 bg-white border shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <h5 className="fw-bold m-0 text-success d-flex align-items-center gap-2">
                🎯 직무 적합도(JD) 매칭 결과
              </h5>
              <div className="text-end">
                <span className="text-muted small d-block mb-1">AI 매칭 점수</span>
                <h2 className="fw-bold text-success m-0">{reportData.matchScore}점</h2>
              </div>
            </div>
            
            {reportData.matchingFeedback?.trim() && (
              <div className="mb-4">
                <h6 className="fw-bold text-secondary mb-3">상세 매칭 피드백</h6>
                <div className="p-4 rounded-4 bg-light" style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "14.5px", color: "#495057" }}>
                  {reportData.matchingFeedback}
                </div>
              </div>
            )}
            
            {reportData.keywordAnalysis?.trim() && (
              <div>
                <h6 className="fw-bold text-secondary mb-3">핵심 키워드 분석</h6>
                <div className="p-4 rounded-4 bg-light" style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "14.5px", color: "#495057" }}>
                  {reportData.keywordAnalysis}
                </div>
              </div>
            )}
            
            {!reportData.matchingFeedback?.trim() && !reportData.keywordAnalysis?.trim() && (
               <div className="text-center p-4 text-muted bg-light rounded-4">상세 매칭 데이터가 제공되지 않았습니다.</div>
            )}
          </div>
        );
        
      case "interview":
        return reportData.expectedQuestions?.trim() ? (
          <div className="p-4 rounded-4 bg-light border-0">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark border-bottom pb-3">
              🎙️ 자소서 기반 예상 면접 질문
            </h5>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "14.5px", color: "#495057" }}>
              {reportData.expectedQuestions}
            </div>
          </div>
        ) : (
           <div className="text-center p-5 text-muted mt-5 bg-light rounded-4">해당 항목에 대한 분석 결과가 없습니다.</div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Container fluid className="py-4 px-lg-5" style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      
      {/* 🔝 상단 헤더 및 네비게이션 */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div className="d-flex flex-column align-items-start">
          {/* 🔥 뱃지도 유동적으로 변경되도록 연동 */}
          <Badge bg={isMatchAnalysis ? "success" : "primary"} className="px-3 py-2 mb-2 rounded-pill shadow-sm" style={{ fontSize: "13px", fontWeight: "600" }}>
            {isMatchAnalysis ? "맞춤형 직무 매칭 분석" : "일반 자소서 첨삭"}
          </Badge>
          <h3 className="fw-bold m-0 text-dark">AI 자소서 분석 리포트</h3>
        </div>
        <div className="d-flex gap-3">
          <Button variant="outline-secondary" className="fw-bold px-4 py-2 rounded-pill bg-white shadow-sm" onClick={() => navigate(-1)}>
            수정하러 가기
          </Button>
          <Button variant="dark" className="fw-bold px-4 py-2 rounded-pill shadow-sm" onClick={() => navigate("/")}>
            메인으로 이동
          </Button>
        </div>
      </div>

      <Row className="g-4" style={{ height: "calc(100vh - 160px)" }}>
        
        {/* 👈 좌측 원본 자소서 */}
        <Col lg={5} className="h-100">
          <Card className="shadow-sm border-0 rounded-4 h-100 d-flex flex-column" style={{ backgroundColor: "#ffffff" }}>
            <Card.Header className="bg-transparent border-0 pt-4 pb-3 px-4">
              <h5 className="fw-bold m-0" style={{ color: "#475569" }}>📄 내가 작성한 자기소개서</h5>
            </Card.Header>
            <Card.Body className="px-4 pb-4 pt-0 custom-scrollbar" style={{ overflowY: "auto" }}>
              {originalResume.map((item, idx) => (
                <div key={idx} className="mb-4 p-4 rounded-4 bg-light border-0">
                  {item.subtitle && (
                    <h6 className="fw-bold text-dark mb-3" style={{ fontSize: "15px", lineHeight: "1.5" }}>
                      [{item.subtitle}]
                    </h6>
                  )}
                  <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "14.5px", color: "#495057" }}>
                    {item.content}
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* 👉 우측 AI 첨삭 결과 */}
        <Col lg={7} className="h-100">
          <Card className="shadow-sm border-0 rounded-4 h-100 d-flex flex-column" style={{ backgroundColor: "#ffffff" }}>
            <Card.Header className="bg-transparent border-0 pt-4 pb-2 px-4">
              <h5 className="fw-bold mb-3 text-dark">✨ AI 첨삭 및 피드백 결과</h5>
              
              <Nav variant="pills" className="gap-2 mb-2 custom-nav-pills d-flex flex-wrap">
                <Nav.Item>
                  <Nav.Link 
                    eventKey="correction" 
                    active={activeTab === "correction"} 
                    onClick={() => setActiveTab("correction")}
                    className={`fw-bold rounded-pill px-4 py-2 ${activeTab === 'correction' ? 'bg-primary text-white shadow-sm' : 'text-secondary bg-light'}`}
                  >
                    세부 문장 교정
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    eventKey="summary" 
                    active={activeTab === "summary"} 
                    onClick={() => setActiveTab("summary")}
                    className={`fw-bold rounded-pill px-4 py-2 ${activeTab === 'summary' ? 'bg-primary text-white shadow-sm' : 'text-secondary bg-light'}`}
                  >
                    핵심 문단 요약
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    eventKey="revised" 
                    active={activeTab === "revised"} 
                    onClick={() => setActiveTab("revised")}
                    className={`fw-bold rounded-pill px-4 py-2 ${activeTab === 'revised' ? 'bg-primary text-white shadow-sm' : 'text-secondary bg-light'}`}
                  >
                    최종 교정 완성본
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    eventKey="overall" 
                    active={activeTab === "overall"} 
                    onClick={() => setActiveTab("overall")}
                    className={`fw-bold rounded-pill px-4 py-2 ${activeTab === 'overall' ? 'bg-primary text-white shadow-sm' : 'text-secondary bg-light'}`}
                  >
                    종합 피드백
                  </Nav.Link>
                </Nav.Item>
                
                {/* 🔥 조건문 업데이트 완료! MATCH 글자가 있으면 탭 활성화 */}
                {isMatchAnalysis && (
                  <>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="match" 
                        active={activeTab === "match"} 
                        onClick={() => setActiveTab("match")}
                        className={`fw-bold rounded-pill px-4 py-2 ${activeTab === 'match' ? 'bg-success text-white shadow-sm' : 'text-secondary bg-light'}`}
                      >
                        직무 적합도 분석
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        eventKey="interview" 
                        active={activeTab === "interview"} 
                        onClick={() => setActiveTab("interview")}
                        className={`fw-bold rounded-pill px-4 py-2 ${activeTab === 'interview' ? 'bg-warning text-dark shadow-sm' : 'text-secondary bg-light'}`}
                      >
                        예상 면접 질문
                      </Nav.Link>
                    </Nav.Item>
                  </>
                )}
              </Nav>
            </Card.Header>
            <Card.Body className="px-4 pb-4 pt-3 custom-scrollbar" style={{ overflowY: "auto" }}>
              {renderTabContent()}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style type="text/css">
        {`
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
          .custom-nav-pills .nav-link { transition: all 0.2s ease-in-out; cursor: pointer; border: 1px solid transparent; margin-bottom: 5px; }
          .custom-nav-pills .nav-link:not(.active):hover { background-color: #e2e8f0 !important; border-color: #cbd5e1; }
        `}
      </style>
    </Container>
  );
};

export default ResumeResult;