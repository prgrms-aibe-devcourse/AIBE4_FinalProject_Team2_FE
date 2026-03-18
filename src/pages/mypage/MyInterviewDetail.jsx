import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Container, Spinner, Badge, ProgressBar } from 'react-bootstrap';
import api from "../../api/axios.js";
import './MyInterviewDetail.css';

const MyInterviewDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleBookmarkToggle = async (questionId, index) => {
        if (!questionId) {
            alert("질문 정보가 없어 북마크할 수 없습니다.");
            return;
        }

        try {
            const response = await api.post(`/mypage/questions/${questionId}/bookmarks`);
            const isBookmarkedNow = response.data?.data ?? response.data;

            setReportData(prev => {
                const newQnaList = prev.qnaList.map((qna, i) =>
                    i === index ? { ...qna, isBookmarked: isBookmarkedNow } : qna
                );
                return { ...prev, qnaList: newQnaList };
            });
        } catch (error) {
            console.error("북마크 처리 실패:", error);
            alert("북마크 처리에 실패했습니다.");
        }
    };

    useEffect(() => {
        const fetchInterviewReport = async () => {
            setIsLoading(true);

            // 💡 [개발용 스위치] 화면 테스트 중에는 true, 백엔드 연동할 때는 false로 바꾸세요!
            const USE_MOCK = false;
            let rawData;

            if (USE_MOCK) {
                // 💡 [수정] 백엔드 DTO 구조와 100% 동일하게 맞춘 가짜 데이터
                rawData = {
                    sessionId: id,
                    interviewType: "VOICE",
                    interviewMode: "NORMAL",
                    createdAt: "2026-03-17T14:30:00",
                    totalScore: 85,
                    overallFeedback: "직무에 대한 열정과 논리적인 답변 전개가 매우 인상적입니다. 다만, 일부 질문에서 결론을 먼저 말하는 두괄식 표현(Top-down approach)을 사용한다면 훨씬 더 명확한 인상을 줄 수 있습니다.",
                    logicAndStructure: {
                        clarityScore: 80,
                        persuasivenessScore: 90,
                        consistencyScore: 85
                    },
                    speechAnalysis: {
                        avgWpm: 120,
                        totalSilenceCount: 3,
                        avgSttAccuracy: 98.5,
                        emotionSummary: { happy: 60, neutral: 40 },
                        frequentWords: ["프로젝트", "최적화", "사용자"],
                        habitDetails: ["어.. (3회)", "그니까 (2회)", "빠른 말 속도"]
                    },
                    turnScripts: [
                        {
                            turnSequence: 1,
                            recordId: 101, // 💡 [중요] 북마크를 위해 백엔드에서 내려줘야 할 고유 질문 ID
                            questionText: "본인이 경험한 가장 기술적으로 어려웠던 문제는 무엇이며, 어떻게 해결했나요?",
                            answerText: "제가 생각하는 가장 중요한 역량은 문제 해결 능력입니다. 이전 프로젝트에서 대규모 데이터 렌더링 시 발생하는 성능 저하 문제를 해결한 경험이 있습니다.",
                            aiFeedback: "STAR 기법에 맞춰 상황과 해결책을 논리적으로 잘 설명했습니다.",
                            evaluationScore: 92,
                            isBookmarked: false
                        },
                        {
                            turnSequence: 2,
                            recordId: 102,
                            questionText: "팀원과 의견 충돌이 발생했을 때 본인만의 대처 방식은 무엇인가요?",
                            answerText: "먼저 상대방의 의견을 끝까지 경청하고 공감하는 자세를 가집니다.",
                            aiFeedback: "갈등 해결을 위한 체계적인 접근법을 제시한 점이 아주 훌륭합니다.",
                            evaluationScore: 88,
                            isBookmarked: true
                        }
                    ]
                };
            } else {
                try {
                    const response = await api.get(`/mypage/interviews/${id}`);
                    rawData = response.data?.data || response.data;
                } catch (error) {
                    console.error("면접 리포트 조회 실패:", error);
                    setReportData(null);
                }
            }

            // 데이터 매핑 로직
            if (rawData) {
                const mappedData = {
                    ...rawData,
                    interviewType: rawData.interviewType === 'VOICE' ? '음성' : '채팅',
                    interviewMode: rawData.interviewMode || "NORMAL",
                    createdAt: rawData.createdAt || "",
                    finalScore: rawData.totalScore || 0,
                    overallFeedback: rawData.overallFeedback || "등록된 총평이 없습니다.",

                    // 💡 [수정] 백엔드 DTO에서 논리 구조 점수 가져오기
                    metrics: [
                        { name: "명확성", score: rawData.logicAndStructure?.clarityScore || 0 },
                        { name: "설득력", score: rawData.logicAndStructure?.persuasivenessScore || 0 },
                        { name: "일관성", score: rawData.logicAndStructure?.consistencyScore || 0 }
                    ],

                    // 💡 [수정] 백엔드 DTO 변수명(frequentWords) 오타 수정 완료
                    speechHabits: {
                        words: rawData.speechAnalysis?.frequentWords || [],
                        warnings: rawData.speechAnalysis?.habitDetails || [],
                        wpm: rawData.speechAnalysis?.avgWpm || 0
                    },

                    // 💡 [수정] 북마크 고유 ID(recordId) 매핑 버그 수정 완료
                    qnaList: (rawData.turnScripts || []).map(turn => ({
                        questionId: turn.recordId || turn.turnSequence, // 백엔드에서 recordId를 안 주면 임시로 순서번호 사용
                        question: turn.questionText,
                        answer: turn.answerText,
                        feedback: turn.aiFeedback,
                        score: turn.evaluationScore || 0,
                        isBookmarked: turn.isBookmarked || false
                    }))
                };
                setReportData(mappedData);
            }

            setIsLoading(false);
        };

        void fetchInterviewReport();
    }, [id]);

    if (isLoading) {
        return (
            <Container className="p-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">면접 분석 리포트를 불러오는 중입니다...</p>
            </Container>
        );
    }

    if (!reportData) {
        return (
            <Container className="p-5 text-center text-muted">
                리포트 데이터를 찾을 수 없습니다.
            </Container>
        );
    }

    return (
        <div className="w-100 pb-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>

                {/* 헤더 영역 */}
                <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-4">
                    <div className="d-flex align-items-center gap-3">
                        {/* 💡 [신규 추가] 자소서 상세 페이지와 통일된 뒤로 가기 버튼 */}
                        <Button
                            variant="white"
                            className="rounded-circle border shadow-sm p-0 d-flex align-items-center justify-content-center"
                            onClick={() => navigate('/mypage/interviews')}
                            style={{ width: '40px', height: '40px' }}
                        >
                            ←
                        </Button>
                        <div>
                            <h2 className="fw-bold mb-1">AI 면접 상세 리포트</h2>
                            <span className="text-muted small">
                {reportData.createdAt ? reportData.createdAt.replace('T', ' ').substring(0, 16) : ""} 진행된 {reportData.interviewType} 면접 결과입니다.
            </span>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="primary" className="fw-bold px-4 d-flex align-items-center gap-2" style={{ backgroundColor: '#1976D2', border: 'none' }}>
                            📥 PDF 다운로드
                        </Button>
                    </div>
                </div>

                {/* 면접 총평 영역 */}
                <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0 text-primary">🏆 면접 종합 평가</h5>
                        <h3 className="fw-bold text-primary mb-0">{reportData.finalScore}점</h3>
                    </div>
                    <p className="text-dark mb-0" style={{ lineHeight: '1.7', fontSize: '15px' }}>
                        {reportData.overallFeedback}
                    </p>
                </Card>

                {/* 💡 [신규 추가 UI] 논리 통계 및 발화 습관 영역 */}
                <Row className="g-4 mb-5">
                    {/* 논리 및 구조 (프로그레스 바 형태) */}
                    <Col md={6}>
                        <Card className="border-0 shadow-sm rounded-4 p-4 h-100">
                            <h6 className="fw-bold mb-4">🧠 답변 논리 및 구조</h6>
                            <div className="d-flex flex-column gap-3">
                                {reportData.metrics.map((metric, idx) => (
                                    <div key={idx}>
                                        <div className="d-flex justify-content-between small mb-1">
                                            <span className="fw-bold text-muted">{metric.name}</span>
                                            <span className="fw-bold text-dark">{metric.score}점</span>
                                        </div>
                                        <ProgressBar now={metric.score} variant="primary" style={{ height: '8px' }} />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </Col>

                    {/* 발화 습관 및 비언어적 통계 (뱃지 형태) */}
                    <Col md={6}>
                        <Card className="border-0 shadow-sm rounded-4 p-4 h-100">
                            <h6 className="fw-bold mb-4">🗣️ 발화 습관 분석</h6>

                            <div className="mb-3">
                                <span className="d-block small fw-bold text-muted mb-2">자주 사용한 단어</span>
                                <div className="d-flex flex-wrap gap-2">
                                    {reportData.speechHabits.words.length > 0 ? (
                                        reportData.speechHabits.words.map((word, idx) => (
                                            <Badge key={idx} bg="light" text="dark" className="border fw-normal px-2 py-1">
                                                {String(word)}
                                            </Badge>
                                        ))
                                    ) : <span className="small text-muted">분석된 단어가 없습니다.</span>}
                                </div>
                            </div>

                            <div>
                                <span className="d-block small fw-bold text-muted mb-2">주의가 필요한 습관 (WPM: {reportData.speechHabits.wpm})</span>
                                <div className="d-flex flex-wrap gap-2">
                                    {reportData.speechHabits.warnings.length > 0 ? (
                                        reportData.speechHabits.warnings.map((warn, idx) => (
                                            <Badge key={idx} bg="danger-subtle" text="danger" className="fw-normal px-2 py-1">
                                                {String(warn)}
                                            </Badge>
                                        ))
                                    ) : <span className="small text-muted">발견된 나쁜 습관이 없습니다. 훌륭합니다!</span>}
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* 개별 질문 상세 분석 영역 */}
                <div className="d-flex justify-content-between align-items-end mb-4 mt-5">
                    <h4 className="fw-bold mb-0">질문별 상세 분석</h4>
                    <span className="text-muted small fw-bold">총 {reportData.qnaList.length}개 질문</span>
                </div>

                {reportData.qnaList.length > 0 ? (
                    reportData.qnaList.map((qna, idx) => (
                        <div key={idx} className="question-card">
                            <div className="badge-group d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="badge badge-question">QUESTION {String(idx + 1).padStart(2, '0')}</span>
                                </div>
                                <button
                                    className="btn-bookmark border-0 bg-transparent p-0"
                                    onClick={() => handleBookmarkToggle(qna.questionId, idx)}
                                    style={{ transition: 'transform 0.2s', cursor: 'pointer' }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill={qna.isBookmarked ? "#1976D2" : "none"} stroke={qna.isBookmarked ? "#1976D2" : "#CED4DA"} strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17.5L5 21V5Z" />
                                    </svg>
                                </button>
                            </div>

                            <h3 className="question-title">
                                "{qna.question}"
                            </h3>

                            <div className="answer-box">
                                <span className="answer-label">나의 답변</span>
                                <p className="answer-text">
                                    "{qna.answer}"
                                </p>
                            </div>

                            {qna.feedback && (
                                <div className="analysis-section">
                                    <div className="analysis-header">
                                        <span className="analysis-title">✨ AI 상세 분석 결과</span>
                                    </div>

                                    <div className="analysis-body">
                                        <div className="score-area d-flex align-items-center justify-content-center">
                                            <div className="text-center">
                                                <h2 className="fw-bold text-primary mb-0">{qna.score}</h2>
                                                <span className="small text-muted fw-bold">/ 100점</span>
                                            </div>
                                        </div>

                                        <div className="feedback-area border-start ps-4">
                                            <h5 className="fw-bold mb-2" style={{ fontSize: '15px' }}>AI 피드백</h5>
                                            <p className="feedback-text mb-0" style={{ lineHeight: '1.6' }}>
                                                {qna.feedback}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted p-5 bg-white rounded-4 border">
                        분석된 대화 내역이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyInterviewDetail;