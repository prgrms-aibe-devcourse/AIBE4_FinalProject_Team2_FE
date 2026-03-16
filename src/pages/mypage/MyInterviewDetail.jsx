import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Button, Container, Spinner } from 'react-bootstrap';
import api from "../../api/axios.js";
import './MyInterviewDetail.css';

const MyInterviewDetail = () => {
    const { id } = useParams();
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
            const USE_MOCK = true;
            let rawData;

            if (USE_MOCK) {
                // UI 테스트를 위한 5개의 풍부한 가짜 데이터
                rawData = {
                    sessionId: id,
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
                        habitDetails: ["어.. (3회)", "그니까 (2회)", "빠른 말 속도"]
                    },
                    turnScripts: [
                        {
                            turnSequence: 1,
                            questionText: "본인이 경험한 가장 기술적으로 어려웠던 문제는 무엇이며, 어떻게 해결했나요?",
                            answerText: "제가 생각하는 가장 중요한 역량은 문제 해결 능력입니다. 이전 프로젝트에서 대규모 데이터 렌더링 시 발생하는 성능 저하 문제를 해결한 경험이 있습니다. 초반에는 렌더링 최적화 개념이 부족했지만...",
                            aiFeedback: "STAR 기법에 맞춰 상황과 해결책을 논리적으로 잘 설명했습니다. 다만, 해결 과정에서 본인이 구체적으로 어떤 '고민'을 했는지 더 강조했다면 문제 해결 역량이 더욱 돋보였을 것입니다.",
                            evaluationScore: 92,
                            isBookmarked: false
                        },
                        {
                            turnSequence: 2,
                            questionText: "팀원과 의견 충돌이 발생했을 때 본인만의 대처 방식은 무엇인가요?",
                            answerText: "먼저 상대방의 의견을 끝까지 경청하고 공감하는 자세를 가집니다. 의견 차이가 발생하는 근본적인 원인이 '목표'에 대한 이해 차이인지, '방법론'의 차이인지를 먼저 파악합니다...",
                            aiFeedback: "갈등 해결을 위한 체계적인 접근법(목표와 방법론 분리)을 제시한 점이 아주 훌륭합니다. 실제 경험했던 짧은 사례를 덧붙이면 훨씬 설득력이 높아질 것입니다.",
                            evaluationScore: 88,
                            isBookmarked: true
                        },
                        {
                            turnSequence: 3,
                            questionText: "React에서 상태 관리(State Management)를 위해 어떤 도구를 사용해 보셨으며, 그 이유는 무엇인가요?",
                            answerText: "주로 Redux와 Recoil을 사용해 보았습니다. 초기 프로젝트에서는 Redux를 채택하여 예측 가능한 상태 업데이트 흐름을 유지하려 했으나, 보일러플레이트(Boilerplate) 코드가 많아지는 단점을 느꼈습니다. 그래서 최근에는...",
                            aiFeedback: "사용해 본 기술에 대한 장단점을 명확히 인지하고 비교 분석한 점이 매우 좋습니다. 프로젝트의 규모와 특성에 맞춰 최적의 도구를 선택할 수 있는 판단력을 잘 보여주었습니다.",
                            evaluationScore: 95,
                            isBookmarked: false
                        },
                        {
                            turnSequence: 4,
                            questionText: "개발 일정을 지키지 못할 뻔했거나, 실제로 지연되었던 경험이 있나요? 어떻게 대처하셨나요?",
                            answerText: "네, 이전 팀 프로젝트에서 API 명세서 변경으로 인해 프론트엔드 연동 일정이 지연된 적이 있습니다. 이때 저는 당황하지 않고 핵심 기능(Core Feature)과 부가 기능을 나누어 우선순위를 다시 설정했습니다...",
                            aiFeedback: "위기 상황에서의 대처 능력이 잘 드러나는 답변입니다. 다만, 일정 지연의 근본적인 원인을 백엔드 탓으로 돌리기보다는, 사전에 소통 비용을 어떻게 줄일 수 있었을지에 대한 회고가 들어갔다면 완벽했을 것입니다.",
                            evaluationScore: 78,
                            isBookmarked: true
                        },
                        {
                            turnSequence: 5,
                            questionText: "브라우저 주소창에 www.google.com을 입력했을 때, 화면이 렌더링되기까지의 과정을 설명해 주세요.",
                            answerText: "먼저 DNS 서버를 통해 도메인 이름을 IP 주소로 변환합니다. 그 IP 주소로 HTTP 요청을 보내고, 서버로부터 HTML 문서를 응답받습니다. 브라우저는 이 HTML을 파싱하여 DOM 트리를 만들고...",
                            aiFeedback: "웹 동작 원리에 대한 전반적인 흐름(네트워크 요청부터 파싱까지)을 잘 이해하고 있습니다. 렌더링 파이프라인(Rendering Pipeline) 과정에서 리플로우(Reflow)와 리페인트(Repaint)의 개념을 추가로 설명한다면 더 전문적으로 보일 것입니다.",
                            evaluationScore: 84,
                            isBookmarked: false
                        }
                    ]
                };
            } else {
                // USE_MOCK이 false일 때 실행되는 실제 API 통신 로직
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
                    interviewType: rawData.interviewType || "일반",
                    interviewMode: rawData.interviewMode || "VOICE",
                    createdAt: rawData.createdAt || "2026-03-15T15:00:00",
                    finalScore: rawData.totalScore || 0,
                    overallFeedback: rawData.overallFeedback || "등록된 총평이 없습니다.",

                    metrics: [
                        { name: "명확성", score: rawData.logicAndStructure?.clarityScore || 0 },
                        { name: "설득력", score: rawData.logicAndStructure?.persuasivenessScore || 0 },
                        { name: "일관성", score: rawData.logicAndStructure?.consistencyScore || 0 }
                    ],

                    speechHabits: {
                        words: rawData.speechAnalysis?.keywords || [],
                        warnings: rawData.speechAnalysis?.habitDetails || []
                    },

                    qnaList: (rawData.turnScripts || []).map(turn => ({
                        questionId: turn.id || turn.turnSequence,
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

                <div className="d-flex justify-content-between align-items-end mb-5 border-bottom pb-4">
                    <div>
                        <h2 className="fw-bold mb-2">AI 면접 상세 리포트</h2>
                        <span className="text-muted">
                            {reportData.createdAt ? reportData.createdAt.replace('T', ' ').substring(0, 16) : ""} 진행된 {reportData.interviewType} 면접 결과입니다.
                        </span>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="outline-secondary" className="fw-bold px-4 bg-white d-flex align-items-center gap-2">
                            🔗 공유하기
                        </Button>
                        <Button variant="primary" className="fw-bold px-4 d-flex align-items-center gap-2" style={{ backgroundColor: '#1976D2', border: 'none' }}>
                            📥 PDF 다운로드
                        </Button>
                    </div>
                </div>

                <Row className="g-4 mb-5">
                    <Col md={12}>
                        <Card className="border-0 shadow-sm rounded-4 p-4">
                            <h5 className="fw-bold mb-3 text-primary">🏆 면접 총평</h5>
                            <p className="text-dark mb-0" style={{ lineHeight: '1.7', fontSize: '15px' }}>
                                {reportData.overallFeedback}
                            </p>
                        </Card>
                    </Col>
                </Row>

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
                                    <span className="badge badge-type ms-2">역량 질문</span>
                                </div>
                                <Button
                                    variant="link"
                                    className="p-0 text-decoration-none border-0 fs-5"
                                    onClick={() => handleBookmarkToggle(qna.questionId, idx)}
                                    style={{ color: qna.isBookmarked ? '#1976D2' : '#ced4da' }}
                                >
                                    {qna.isBookmarked ? '★' : '☆'}
                                </Button>
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
                                        <div className="score-area">
                                            <div className="score-item">
                                                <div className="score-label-wrap">
                                                    <span>답변 논리성</span>
                                                    <span className="score-value text-primary">우수 ({qna.score}/100)</span>
                                                </div>
                                                <div className="progress-bar-bg">
                                                    <div className="progress-bar-fill" style={{ width: `${qna.score}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="score-item">
                                                <div className="score-label-wrap">
                                                    <span>직무 지식 활용</span>
                                                    <span className="score-value text-muted">보통 (75/100)</span>
                                                </div>
                                                <div className="progress-bar-bg">
                                                    <div className="progress-bar-fill" style={{ width: '75%', backgroundColor: '#6C757D' }}></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="feedback-area border-start ps-4">
                                            <h4 className="feedback-label">AI 피드백</h4>
                                            <p className="feedback-text">
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