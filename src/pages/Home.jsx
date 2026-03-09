import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="main-page">
            {/* 1. Hero Section */}
            <section className="hero-section text-center py-5 bg-light">
                <Container className="py-5">
                    <span className="badge rounded-pill bg-primary mb-3 px-3 py-2">AI 기반 취업 성공 솔루션</span>
                    <h1 className="fw-bold display-4 mb-4">
                        AI와 함께하는 맞춤형<br />
                        취업 솔루션, <span className="text-primary">SyncTalk</span>
                    </h1>
                    <p className="text-muted mb-5">
                        채용 공고에 맞춘 맞춤형 자기소개서 첨삭과 실전 같은 AI 모의 면접을 즉시 경험해보세요.<br />
                        치열한 경쟁 속에서 확실한 경쟁력을 만들어 드립니다.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Button variant="outline-dark" size="lg" onClick={() => navigate('/interview')}>
                            AI 모의 면접 시작
                        </Button>
                        <Button variant="dark" size="lg" onClick={() => navigate('/resume')}>
                            AI 자기소개서 분석
                        </Button>
                    </div>
                    {/* 기업 로고 영역 (슬라이더 등으로 대체 가능) */}
                    <div className="mt-5 pt-4 text-muted small">
                        합격자 배출 기업: 삼성전자 | 네이버 | 카카오 | 쿠팡 | 현대자동차
                    </div>
                </Container>
            </section>

            {/* 2. Features Section */}
            <section className="features-section py-5">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">취업 성공을 위한 모든 것</h2>
                        <p className="text-muted">인사 담당자가 원하는 것이 무엇인지 고민하지 마세요. AI가 가이드해 드립니다.</p>
                    </div>
                    <Row className="g-4">
                        {[
                            { title: 'AI 자소서 첨삭', desc: '직무에 맞춘 즉각적인 피드백을 제공하고 합격률을 높여드립니다.', icon: '📝' },
                            { title: '실시간 AI 모의 면접', desc: '실제 직무 설정 기반으로 질문하는 AI 면접관과 연습하세요.', icon: '🎤' },
                            { title: '맞춤형 상세 피드백', desc: '답변 내용, 목소리 톤, 속도에 대한 상세 점수를 받아보세요.', icon: '📊' }
                        ].map((item, idx) => (
                            <Col md={4} key={idx}>
                                <Card className="h-100 border-0 shadow-sm p-4 text-center">
                                    <div className="fs-1 mb-3">{item.icon}</div>
                                    <Card.Title className="fw-bold mb-3">{item.title}</Card.Title>
                                    <Card.Text className="text-muted small">{item.desc}</Card.Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* 3. Steps Section (이용 방법) */}
            <section className="steps-section py-5 bg-white">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">이용 방법</h2>
                        <p className="text-muted">꿈의 직장에 합격하기 위한 3단계</p>
                    </div>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <div className="ps-lg-5">
                                <div className="mb-5">
                                    <h5 className="fw-bold text-primary">01. 채용 공고 찾기</h5>
                                    <p className="text-muted">지원하고자 하는 채용 공고의 URL을 입력하세요. AI가 핵심 요구사항을 추출합니다.</p>
                                </div>
                                <div className="mb-5">
                                    <h5 className="fw-bold text-primary">02. 이력서 업로드</h5>
                                    <p className="text-muted">현재 이력서를 등록하여 AI가 지원자의 배경을 이해할 수 있도록 도와주세요.</p>
                                </div>
                                <div>
                                    <h5 className="fw-bold text-primary">03. 준비 완료</h5>
                                    <p className="text-muted">즉시 자소서 첨삭을 받고 실전 모의 면접을 시작하세요.</p>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6} className="text-center mt-5 mt-lg-0">
                            {/* 이미지 영역: 실제 작업 시 일러스트나 스크린샷 배치 */}
                            <div className="bg-light rounded-4 p-5 shadow-inner" style={{ minHeight: '300px' }}>
                                <div className="display-1">🚀</div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default Home;