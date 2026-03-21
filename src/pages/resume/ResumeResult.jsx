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

  // 🌟 원본 자소서 파싱 로직 ("문항" 등 임의의 글자 없이 소제목만 추출)
  const parseResumeContent = (text) => {
    if (!text) return [];
    
    const blocks = text.split(/(?=\n*\[.*?\]\n)/).filter(Boolean);
    
    return blocks.map((block) => {
      const match = block.trim().match(/^\[(.*?)\]\n([\s\S]*)$/);
      if (match) {
        return { subtitle: match[1].trim(), content: match[2].trim() };
      }
      return { subtitle: "", content: block.trim() }; // 소제목이 없으면 비워둠
    });
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

  // 👉 우측 탭 렌더링 (좌우측 CSS 디자인 완벽 통일)
  const renderTabContent = () => {
    switch (activeTab) {
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
        
      case "correction":
        const hasCorrection = reportData.sentenceCorrections?.trim();
        const hasSummary = reportData.paragraphSummaries?.trim();
        const hasRevised = reportData.revisedFullContent?.trim();

        if (!hasCorrection && !hasSummary && !hasRevised) {
          return <div className="text-center p-5 text-muted mt-5 bg-light rounded-4">해당 항목에 대한 분석 결과가 없습니다.</div>;
        }

        return (
          <div className="d-flex flex-column gap-4">
            {hasCorrection && (
              <div className="p-4 rounded-4 bg-light border-0">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
                  📝 세부 문장 교정 포인트
                </h5>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "14.5px", color: "#495057" }}>
                  {reportData.sentenceCorrections}
                </div>
              </div>
            )}

            {hasSummary && (
              <div className="p-4 rounded-4 bg-light border-0">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
                  📑 핵심 문단 요약
                </h5>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "14.5px", color: "#495057" }}>
                  {reportData.paragraphSummaries}
                </div>
              </div>
            )}

            {hasRevised && (
              <div className="p-4 rounded-4 bg-white border shadow-sm">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark border-bottom pb-3">
                  ✨ AI 최종 교정 완성본
                </h5>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.9", fontSize: "15px", color: "#212529" }}>
                  {reportData.revisedFullContent}
                </div>
              </div>
            )}
          </div>
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
          <Badge bg={reportData.analysisType === "FIT_MATCH" ? "success" : "primary"} className="px-3 py-2 mb-2 rounded-pill shadow-sm" style={{ fontSize: "13px", fontWeight: "600" }}>
            {reportData.analysisType === "FIT_MATCH" ? "맞춤형 직무 매칭 분석" : "일반 자소서 첨삭"}
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

      {/* ↔️ 좌우 레이아웃 영역 */}
      <Row className="g-4" style={{ height: "calc(100vh - 160px)" }}>
        
        {/* 👈 좌측 원본 자소서 (우측과 디자인 통일: bg-light, p-4, rounded-4) */}
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
              <Nav variant="pills" className="gap-2 mb-2 custom-nav-pills">
                <Nav.Item>
                  <Nav.Link 
                    eventKey="correction" 
                    active={activeTab === "correction"} 
                    onClick={() => setActiveTab("correction")}
                    className={`fw-bold rounded-pill px-4 py-2 ${activeTab === 'correction' ? 'bg-primary text-white shadow-sm' : 'text-secondary bg-light'}`}
                  >
                    세부 교정 및 완성본
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
                {reportData.analysisType === "FIT_MATCH" && (
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
          .custom-nav-pills .nav-link { transition: all 0.2s ease-in-out; cursor: pointer; border: 1px solid transparent; }
          .custom-nav-pills .nav-link:not(.active):hover { background-color: #e2e8f0 !important; border-color: #cbd5e1; }
        `}
      </style>
    </Container>
  );
};

export default ResumeResult;