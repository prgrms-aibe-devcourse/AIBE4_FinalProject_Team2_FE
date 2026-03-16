import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Badge, Button, Row, Col, Card } from 'react-bootstrap';
import api from "../../api/axios.js";
import './MyResumeDetail.css';

const MyResumeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReportDetail = async () => {
            setIsLoading(true);
            const USE_MOCK = true;
            let rawData;

            try {
                if (USE_MOCK) {
                    rawData = {
                        id: id,
                        title: "마케팅 매니저 지원서_AI 첨삭본",
                        createdAt: "2024-05-24T14:30:00",
                        finalScore: 88,
                        scoreDesc: "상위 5% 수준의 우수한 자기소개서입니다.",

                        // 리포트에서 보여줄 본문 및 강조 토큰
                        contentTokens: [
                            { text: "혁신적인 협업 문화와 기술적 가치에 깊이 공감하며, 커뮤니케이션 시장의 패러다임을 바꾸는 여정에 마케팅 매니저로서 기여하고 싶습니다. 지난 5년간 IT 스타트업에서 B2B 마케팅을 담당하며 ", highlighted: false },
                            { text: "200% 이상의 리드 성장을 이끌어낸 경험", highlighted: true, feedbackId: 'fb1' },
                            { text: "이 있습니다. 특히 복잡한 기술적 개념을 대중이 이해하기 쉬운 언어로 번역하여 브랜드 인지도를 높이는 데 탁월한 능력을 보유하고 있습니다.\n\n[지원 동기]\n네이버의 엄청난 트래픽을 감당해보고 싶어서 지원했습니다.", highlighted: false }
                        ],

                        suggestionList: [
                            { id: 'sg1', type: 'professional', title: '"협업 문화" 표현 수정', desc: '단순히 "공감한다"는 표현보다 본인이 기여할 수 있는 구체적인 가치를 연결하세요.' },
                            { id: 'sg2', type: 'grammar', title: '불필요한 미사여구 축소', desc: '"정교한 결합을 통해"와 같은 표현은 간결하게 "결합하여"로 수정하는 것이 흐름상 좋습니다.' },
                            { id: 'sg3', type: 'clarity', title: '술어 활용 구체화', desc: '구축한 자동화 알림 봇이 어떤 비즈니스 임팩트를 주었는지 1문장 추가해보세요.' }
                        ]
                    };
                } else {
                    const response = await api.get(`/mypage/resumes/${id}`);
                    rawData = response.data?.data || response.data;
                }

                if (rawData) {
                    const mappedData = {
                        ...rawData,
                        formattedDate: rawData.createdAt ? rawData.createdAt.substring(0, 10).replace(/-/g, '. ') : '',
                        coreFeedbacks: [
                            { type: 'good', title: '구체적인 성과 지표 활용', desc: '200% 리드 성장 등 수치 중심의 성과 기술이 매우 설득력 있습니다.' },
                            { type: 'warn', title: '직무 역량 키워드 보완 필요', desc: '"전략적 기획" 및 "데이터 분석" 키워드를 더 명시적으로 노출할 것을 권장합니다.' }
                        ]
                    };
                    setReportData(mappedData);
                }
            } catch (error) {
                console.error("리포트 조회 실패:", error);
                setReportData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReportDetail();
    }, [id]);

    if (isLoading) return <Container className="p-5 text-center"><Spinner animation="border" variant="primary" /></Container>;
    if (!reportData) return <Container className="p-5 text-center text-muted">리포트 데이터를 찾을 수 없습니다.</Container>;

    return (
        <div className="resume-report-wrapper w-100" style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            <Container py={5}>

                {/* 상단 네비게이션 헤더 */}
                <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom">
                    <div className="d-flex align-items-center gap-3">
                        <Button variant="white" className="rounded-circle border shadow-sm p-0 d-flex align-items-center justify-content-center" onClick={() => navigate(-1)} style={{ width: '40px', height: '40px' }}>
                            ←
                        </Button>
                        <h4 className="fw-bold mb-0 text-dark">{reportData.title}</h4>
                    </div>
                    <div className="d-flex gap-2">
                        <Button variant="white" className="fw-bold px-3 rounded-pill border shadow-sm text-muted small">
                            📥 PDF 다운로드
                        </Button>
                    </div>
                </div>

                <Row className="g-5">

                    {/* 좌측: AI 분석 결과 서머리 영역 */}
                    <Col lg={4}>
                        <div className="sticky-top" style={{ top: '30px' }}>
                            <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <Badge bg="primary-subtle" text="primary" className="p-2 rounded-2">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#1976D2"/>
                                        </svg>
                                    </Badge>
                                    <h5 className="fw-bold mb-0">AI 첨삭 리포트</h5>
                                </div>
                                <span className="text-muted small mb-3 display-block">생성 시간: {reportData.formattedDate} {reportData.createdAt?.substring(11, 16)}</span>

                                <div className="score-box mb-4 pb-3 border-bottom">
                                    <h6 className="fw-bold text-muted small mb-2">종합 평점</h6>
                                    <div className="d-flex align-items-end gap-1">
                                        <h1 className="fw-bold text-primary mb-0">{reportData.finalScore}</h1>
                                        <span className="text-muted fs-5 pb-1">/ 100점</span>
                                    </div>
                                    <p className="text-muted small mt-2 mb-0">{reportData.scoreDesc}</p>
                                </div>

                                <div className="core-feedback mb-4">
                                    <h6 className="fw-bold mb-3">핵심 피드백</h6>
                                    <div className="d-flex flex-column gap-3">
                                        {reportData.coreFeedbacks.map((fb, idx) => (
                                            <div key={idx} className="d-flex align-items-start gap-2">
                                                <span>{fb.type === 'good' ? '✅' : 'ℹ️'}</span>
                                                <div>
                                                    <p className="fw-bold mb-0 small">{fb.title}</p>
                                                    <p className="text-muted mb-0 xs-small">{fb.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>

                            <Card className="border-0 shadow-sm rounded-4 p-4">
                                <h6 className="fw-bold mb-3">문항별 개선 제안</h6>
                                <div className="d-flex flex-column gap-3">
                                    {reportData.suggestionList.map((sg) => (
                                        <div key={sg.id} className={`suggestion-item p-3 rounded-3 ${sg.type}`}>
                                            <p className="fw-bold mb-1 small">{sg.title}</p>
                                            <p className="text-muted xs-small mb-0">{sg.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </Col>

                    {/* 💡 우측: 리포트 본문 확인 영역 (에디터 툴바 제거) */}
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm rounded-4 p-5 h-100 d-flex flex-column">
                            <div className="report-header mb-5 pb-3 border-bottom">
                                <h6 className="text-primary fw-bold small mb-2">FINAL REVIEW</h6>
                                <h2 className="fw-bold text-dark">완성된 자기소개서</h2>
                                <p className="text-muted small mt-2">AI의 첨삭 결과를 확인하고, 필요하다면 에디터로 이동하여 내용을 직접 수정할 수 있습니다.</p>
                            </div>

                            <div className="report-body flex-grow-1" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.9', color: '#333' }}>
                                {reportData.contentTokens?.map((token, idx) => (
                                    <span key={idx} className={token.highlighted ? 'highlighted-text' : ''}>
                                        {token.text}
                                    </span>
                                ))}
                            </div>

                            {/* 💡 하단: 에디터 이동 버튼으로 교체 */}
                            <div className="report-footer mt-5 pt-4 border-top d-flex justify-content-between align-items-center">
                                <div className="text-muted small">842 단어 / 1,450 자</div>
                                <Button
                                    variant="primary"
                                    className="fw-bold px-4 py-2 rounded-pill shadow-sm"
                                    style={{ backgroundColor: '#1976D2', border: 'none' }}
                                    onClick={() => navigate(`/mypage/resume/edit/${id}`)} // 💡 에디터 페이지 경로로 이동
                                >
                                    ✍️ 내용 수정하러 가기
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default MyResumeDetail;