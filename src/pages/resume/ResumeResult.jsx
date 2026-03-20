import React, { useEffect, useState } from "react";
import { Container, Card, Spinner, Button, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const ResumeResult = () => {
  const { resumeId, reportId } = useParams(); // URL 파라미터에서 ID 추출
  const navigate = useNavigate();
  
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysisResult = async () => {
      try {
        // 백엔드의 AnalysisController GET 엔드포인트 호출
        const response = await axios.get(`/api/v1/resumes/${resumeId}/reports/${reportId}`);
        setReportData(response.data.data);
      } catch (error) {
        console.error("분석 결과 조회 실패:", error);
        alert("결과를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysisResult();
  }, [resumeId, reportId]);

  if (isLoading) {
    return (
      <Container className="py-5 text-center" style={{ marginTop: "100px" }}>
        <Spinner animation="border" variant="primary" />
        <h5 className="mt-3 fw-bold text-muted">AI가 분석한 결과를 불러오고 있습니다...</h5>
      </Container>
    );
  }

  if (!reportData) {
    return (
      <Container className="py-5 text-center">
        <h5 className="text-danger fw-bold">결과 데이터를 찾을 수 없습니다.</h5>
        <Button variant="outline-primary" onClick={() => navigate(-1)} className="mt-3">
          이전으로 돌아가기
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: "900px" }}>
      <div className="text-center mb-5">
        <Badge bg="primary" className="px-3 py-2 mb-2 rounded-pill shadow-sm">
          {reportData.analysisType === "MATCH" ? "맞춤형 직무 분석" : "일반 첨삭 분석"}
        </Badge>
        <h2 className="fw-bold">AI 자소서 첨삭 결과</h2>
        <p className="text-muted small">AI가 분석한 상세 피드백과 교정된 자기소개서를 확인해 보세요.</p>
      </div>

      {/* 1. 종합 피드백 영역 */}
      {reportData.overallFeedback && (
        <Card className="shadow-sm border-0 rounded-4 mb-4 p-4" style={{ backgroundColor: "#f8f9fa" }}>
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
            💡 종합 피드백
          </h5>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "15px", color: "#495057" }}>
            {reportData.overallFeedback}
          </div>
        </Card>
      )}

      {/* 2. 채용공고 매칭 결과 (MATCH 타입일 경우만 표시) */}
      {reportData.analysisType === "MATCH" && (
        <Card className="shadow-sm border-0 rounded-4 mb-4 p-4 border-top border-3 border-success">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold m-0 d-flex align-items-center gap-2 text-success">
              🎯 직무 적합도 매칭 결과
            </h5>
            <h4 className="fw-bold text-success m-0">{reportData.matchScore}점</h4>
          </div>
          
          <div className="mb-4">
            <h6 className="fw-bold text-secondary">매칭 피드백</h6>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6", fontSize: "14px" }}>
              {reportData.matchingFeedback}
            </div>
          </div>

          <div className="mb-4">
            <h6 className="fw-bold text-secondary">키워드 분석</h6>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6", fontSize: "14px" }}>
              {reportData.keywordAnalysis}
            </div>
          </div>

          <div>
            <h6 className="fw-bold text-secondary">예상 면접 질문</h6>
            <div className="p-3 bg-light rounded-3" style={{ whiteSpace: "pre-wrap", lineHeight: "1.6", fontSize: "14px" }}>
              {reportData.expectedQuestions}
            </div>
          </div>
        </Card>
      )}

      {/* 3. 문장별 교정 및 요약 */}
      <Card className="shadow-sm border-0 rounded-4 mb-4 p-4">
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
          📝 세부 문장 교정
        </h5>
        <div className="p-3 mb-4 rounded-3 border" style={{ backgroundColor: "#fff", whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "14px" }}>
          {reportData.sentenceCorrections || "세부 교정 내용이 없습니다."}
        </div>

        {reportData.paragraphSummaries && (
          <>
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 mt-4">
              📑 문단 요약
            </h5>
            <div className="p-3 rounded-3 bg-light" style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "14px" }}>
              {reportData.paragraphSummaries}
            </div>
          </>
        )}
      </Card>

      {/* 4. 최종 완성본 영역 */}
      <Card className="shadow-sm border-0 rounded-4 mb-4 p-4" style={{ backgroundColor: "#fdfdfd", border: "1px solid #e9ecef" }}>
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-dark">
          ✨ 최종 교정 완성본
        </h5>
        <div className="p-4 rounded-3" style={{ backgroundColor: "#fff", border: "1px solid #dee2e6", whiteSpace: "pre-wrap", lineHeight: "1.9", fontSize: "15px", color: "#212529" }}>
          {reportData.revisedFullContent || "최종 완성본이 생성되지 않았습니다."}
        </div>
      </Card>

      <div className="text-center mt-5 mb-5">
        <Button variant="secondary" size="lg" className="me-3 fw-bold px-4 rounded-pill" onClick={() => navigate(-1)}>
          수정하러 가기
        </Button>
        <Button variant="primary" size="lg" className="fw-bold px-4 rounded-pill" onClick={() => navigate("/")}>
          메인으로 이동
        </Button>
      </div>
    </Container>
  );
};

export default ResumeResult;