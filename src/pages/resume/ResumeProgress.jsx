import React, { useEffect, useState } from "react";
import { Container, Card, Badge, ProgressBar, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const TIPS = [
  "💡 소제목은 핵심을 요약해서 호기심을 유발하도록 작성하세요.",
  "💡 결과보다는 문제 해결 과정과 배운 점을 구체적으로 강조하세요.",
  "💡 지원하는 직무와 가장 연관성 높은 경험을 우선적으로 배치하세요.",
  "💡 추상적인 표현(열심히, 최선을 다해)보다 수치화된 성과를 보여주세요."
];

const ResumeProgress = () => {
  const { resumeId, reportId } = useParams();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  // 1. 대기 화면 애니메이션 (팁 롤링 & 가짜 진행률)
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 4000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 15) return prev + 3; 
        if (prev < 85) return prev + 1; 
        if (prev < 99) return prev + 0.5; 
        return 99; 
      });
    }, 500);

    return () => {
      clearInterval(tipInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // 2. 백엔드 상태 폴링 (Polling)
  useEffect(() => {
    let pollInterval;

    const fetchAnalysisStatus = async () => {
      try {
        const response = await axios.get(`/resumes/${resumeId}/reports/${reportId}`);
        const status = response.data.data.status;

        if (status === "COMPLETED") {
          setProgress(100);
          clearInterval(pollInterval);
          // 완료되면 결과 페이지로 이동 (replace: true 로 뒤로가기 방지)
          setTimeout(() => {
            navigate(`/resumes/${resumeId}/reports/${reportId}`, { replace: true });
          }, 500);
        } 
        else if (status === "FAILED" || status === "CANCELLED") {
          clearInterval(pollInterval);
          alert("AI 첨삭 처리에 실패했습니다. 텍스트를 확인하고 다시 시도해주세요.");
          navigate(-1); 
        }
      } catch (error) {
        console.error("상태 조회 실패:", error);
        clearInterval(pollInterval);
        alert("서버와 연결이 끊겼습니다.");
        navigate(-1);
      }
    };

    fetchAnalysisStatus(); // 접속 시 1회 확인
    pollInterval = setInterval(fetchAnalysisStatus, 3000); // 3초마다 확인

    return () => clearInterval(pollInterval);
  }, [resumeId, reportId, navigate]);

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div style={{ maxWidth: "600px", width: "100%" }} className="text-center">
        <div className="mb-4 d-flex justify-content-center align-items-center gap-3">
          <Spinner animation="grow" variant="primary" style={{ width: '1.2rem', height: '1.2rem' }} />
          <Spinner animation="grow" variant="primary" style={{ width: '1.5rem', height: '1.5rem', animationDelay: '0.15s' }} />
          <Spinner animation="grow" variant="primary" style={{ width: '1.2rem', height: '1.2rem', animationDelay: '0.3s' }} />
        </div>
        
        <h3 className="fw-bold mb-3 text-dark">자기소개서 첨삭이 진행중입니다...</h3>
        <p className="text-muted mb-5" style={{ fontSize: '16px' }}>
          AI가 문맥을 분석하고 교정본을 작성하고 있습니다. <br/>(최대 1분 정도 소요될 수 있습니다)
        </p>

        <ProgressBar 
          animated 
          now={Math.floor(progress)} 
          label={`${Math.floor(progress)}%`} 
          className="mb-5 rounded-pill shadow-sm" 
          style={{ height: '24px', fontSize: '14px', fontWeight: 'bold', backgroundColor: '#e9ecef' }} 
        />

        <Card className="border-0 shadow-sm rounded-4 text-start mx-auto" style={{ backgroundColor: '#f8f9fa' }}>
          <Card.Body className="p-4">
            <div className="d-flex align-items-center mb-3">
              <Badge bg="primary" className="me-2 px-3 py-2 rounded-pill shadow-sm">TIP</Badge>
              <h6 className="fw-bold text-dark m-0">합격 자소서 작성 팁</h6>
            </div>
            <p className="mb-0 text-secondary" style={{ fontSize: '15px', minHeight: '48px', lineHeight: '1.6' }}>
              {TIPS[tipIndex]}
            </p>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default ResumeProgress;