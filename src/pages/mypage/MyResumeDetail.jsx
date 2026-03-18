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

            // 💡 [개발용 스위치] 화면 렌더링 테스트 중에는 true, 실제 백엔드 연동 시에는 false
            const USE_MOCK = false;
            let rawData;

            try {
                if (USE_MOCK) {
                    rawData = {
                        analysisId: id,
                        title: "마케팅 매니저 지원서_AI 첨삭본", // 프론트엔드 UI를 위해 추가 유지
                        totalScore: 88,
                        overallFeedback: "상위 5% 수준의 우수한 자기소개서입니다. 논리적인 전개가 돋보입니다.",
                        matchingFeedback: "해당 직무의 핵심 요구사항과 지원자의 경험이 잘 매칭됩니다.",
                        evaluationSummary: {
                            readabilityLevel: "High",
                            matchedKeywordCount: 3,
                            isStarStructureApplied: true
                        },
                        keywordStats: {
                            matchedKeywords: ["B2B 마케팅", "리드 성장", "브랜드 인지도"],
                            missingKeywords: ["데이터 분석", "전략적 기획"]
                        },
                        sentenceCorrections: [
                            {
                                original: "네이버의 엄청난 트래픽을 감당해보고 싶어서 지원했습니다.",
                                corrected: "대규모 트래픽 환경에서의 경험을 바탕으로 네이버의 서비스 운영에 기여하고자 지원했습니다.",
                                reason: "지원 동기를 보다 전문적이고 직무 중심적인 언어로 순화했습니다."
                            },
                            {
                                original: "마케팅을 열심히 담당하며 성장했습니다.",
                                corrected: "마케팅 캠페인을 기획하고 실행하며 200%의 리드 성장을 달성했습니다.",
                                reason: "단순한 서술 대신 구체적인 수치(200%)와 역할을 명시하여 신뢰도를 높였습니다."
                            }
                        ],
                        revisedFullContent: "혁신적인 협업 문화와 기술적 가치에 깊이 공감하며, 커뮤니케이션 시장의 패러다임을 바꾸는 여정에 마케팅 매니저로서 기여하고 싶습니다.\n\n지난 5년간 IT 스타트업에서 B2B 마케팅을 담당하며 200% 이상의 리드 성장을 이끌어낸 경험이 있습니다. 특히 복잡한 기술적 개념을 대중이 이해하기 쉬운 언어로 번역하여 브랜드 인지도를 높이는 데 탁월한 능력을 보유하고 있습니다.\n\n대규모 트래픽 환경에서의 경험을 바탕으로 네이버의 안정적인 서비스 운영에 기여하고자 지원했습니다.",
                        analyzedAt: "2026-03-16T14:30:00"
                    };
                } else {
                    const response = await api.get(`/mypage/resumes/analysis/${id}`);
                    rawData = response.data?.data || response.data;
                }

                if (rawData) {
                    let parsedDate = '';
                    let parsedTime = '';

                    if (rawData.analyzedAt) {
                        const dateObj = new Date(rawData.analyzedAt);

                        // 💡 2. 한국 지역(ko-KR)에 맞는 날짜 및 시간 포맷으로 자동 변환
                        parsedDate = dateObj.toLocaleDateString('ko-KR');
                        parsedTime = dateObj.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
                    }

                    const mappedData = {
                        ...rawData,
                        formattedDate: parsedDate,
                        formattedTime: parsedTime
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
            <Container className="py-5">

                {/* 상단 네비게이션 헤더 */}
                <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom">
                    <div className="d-flex align-items-center gap-3">
                        <Button variant="white" className="rounded-circle border shadow-sm p-0 d-flex align-items-center justify-content-center" onClick={() => navigate(-1)} style={{ width: '40px', height: '40px' }}>
                            ←
                        </Button>
                        <h4 className="fw-bold mb-0 text-dark">{reportData.title || `리포트 #${reportData.analysisId}`}</h4>
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
                                <span className="text-muted small mb-3 display-block">
                                    분석 일시: {reportData.formattedDate} {reportData.formattedTime}
                                </span>

                                {/* ✅ DTO 맞춤: totalScore 및 overallFeedback 반영 */}
                                <div className="score-box mb-4 pb-3 border-bottom">
                                    <h6 className="fw-bold text-muted small mb-2">종합 평점</h6>
                                    <div className="d-flex align-items-end gap-1">
                                        <h1 className="fw-bold text-primary mb-0">{reportData.totalScore || '-'}</h1>
                                        <span className="text-muted fs-5 pb-1">/ 100점</span>
                                    </div>
                                    <p className="text-muted small mt-2 mb-0">{reportData.overallFeedback}</p>
                                    {reportData.matchingFeedback && (
                                        <p className="text-primary small fw-bold mt-2 mb-0">🎯 {reportData.matchingFeedback}</p>
                                    )}
                                </div>

                                {/* ✅ DTO 맞춤: evaluationSummary 및 keywordStats 반영 */}
                                <div className="core-feedback mb-2">
                                    <h6 className="fw-bold mb-3">핵심 피드백 요약</h6>

                                    <div className="d-flex align-items-start gap-2 mb-3">
                                        <span>📊</span>
                                        <div>
                                            <p className="fw-bold mb-0 small">STAR 기법 적용</p>
                                            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                                                {reportData.evaluationSummary?.isStarStructureApplied ? '적용 완료 (논리적 구조 우수)' : '보완 필요 (구체적인 상황/결과 추가 권장)'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-start gap-2 mb-3">
                                        <span>✅</span>
                                        <div>
                                            <p className="fw-bold mb-1 small">매칭된 강점 키워드</p>
                                            <div className="d-flex flex-wrap gap-1">
                                                {reportData.keywordStats?.matchedKeywords?.map((kw, i) => (
                                                    <Badge key={i} bg="primary-subtle" text="primary" className="fw-normal">{kw}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-start gap-2">
                                        <span>💡</span>
                                        <div>
                                            <p className="fw-bold mb-1 small">추천 보완 키워드</p>
                                            <div className="d-flex flex-wrap gap-1">
                                                {reportData.keywordStats?.missingKeywords?.map((kw, i) => (
                                                    <Badge key={i} bg="secondary" className="fw-normal text-white">{kw}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* ✅ DTO 맞춤: sentenceCorrections 배열 반영 */}
                            <Card className="border-0 shadow-sm rounded-4 p-4">
                                <h6 className="fw-bold mb-3">문장별 교정 상세 내역</h6>
                                <div className="d-flex flex-column gap-3">
                                    {reportData.sentenceCorrections?.length > 0 ? (
                                        reportData.sentenceCorrections.map((correction, idx) => (
                                            <div key={idx} className="suggestion-item p-3 rounded-3" style={{ backgroundColor: '#F8F9FA', borderLeft: '4px solid #1976D2' }}>
                                                <p className="text-danger mb-1" style={{ fontSize: '0.8rem', textDecoration: 'line-through' }}>
                                                    {correction.original}
                                                </p>
                                                <p className="fw-bold text-dark mb-2 small">
                                                    ✨ {correction.corrected}
                                                </p>
                                                <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                                                    <strong>💡 교정 이유:</strong> {correction.reason}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted small">교정된 문장이 없습니다.</p>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </Col>

                    {/* 우측: 리포트 본문 확인 영역 */}
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm rounded-4 p-5 h-100 d-flex flex-column">
                            <div className="report-header mb-5 pb-3 border-bottom">
                                <h6 className="text-primary fw-bold small mb-2">FINAL REVIEW</h6>
                                <h2 className="fw-bold text-dark">완성된 자기소개서</h2>
                                <p className="text-muted small mt-2">AI의 첨삭 결과를 확인하고, 필요하다면 에디터로 이동하여 내용을 직접 수정할 수 있습니다.</p>
                            </div>

                            {/* ✅ DTO 맞춤: revisedFullContent 문자열 렌더링 */}
                            <div className="report-body flex-grow-1" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.9', color: '#333', fontSize: '1.05rem' }}>
                                {reportData.revisedFullContent || '본문 내용이 없습니다.'}
                            </div>

                            <div className="report-footer mt-5 pt-4 border-top d-flex justify-content-between align-items-center">
                                <div className="text-muted small">
                                    글자 수: {reportData.revisedFullContent?.replace(/\s/g, '').length || 0}자 (공백 제외)
                                </div>
                                <Button
                                    variant="primary"
                                    className="fw-bold px-4 py-2 rounded-pill shadow-sm"
                                    style={{ backgroundColor: '#1976D2', border: 'none' }}
                                    onClick={() => navigate(`/mypage/resume/edit/${id}`)}
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