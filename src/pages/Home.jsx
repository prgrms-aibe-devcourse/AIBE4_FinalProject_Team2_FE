import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Search, FileEarmarkTextFill, MicFill, BarChartLineFill, PencilSquare, RocketTakeoffFill } from 'react-bootstrap-icons';
import {useNavigate} from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const stPrimary = '#1976D2'; // SyncTalk 브랜드 블루

    return (
        <div className="bg-white min-vh-100 font-korean">

            {/* 2. Hero Section */}
            <section className="py-5 py-lg-10 text-center bg-gradient-light" style={{ background: 'linear-gradient(to bottom, #f8faff, #ffffff)' }}>
                <Container>
                    <Badge bg="primary" className="bg-opacity-10 text-primary mb-4 px-3 py-2 fw-normal rounded-pill">
                        ● AI 기반 취업 성공 솔루션
                    </Badge>
                    <h1 className="display-4 fw-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
                        AI와 함께하는 맞춤형<br />
                        취업 솔루션, <span style={{ color: stPrimary }}>SyncTalk</span>
                    </h1>
                    <p className="text-muted mx-auto mb-5" style={{ maxWidth: '600px', lineHeight: '1.8' }}>
                        채용 공고에 맞춘 맞춤형 자기소개서 첨삭과 실전 같은 AI 모의 면접을 즉시 경험해보세요.
                        치열한 경쟁 속에서 확실한 경쟁력을 만들어 드립니다.
                    </p>

                    {/* Feature Quick Links */}
                    <div className="d-flex justify-content-center gap-3">
                        <Button variant="white" className="btn btn-primary shadow-sm border border-light py-2 px-4 rounded-3 fw-bold d-flex align-items-center gap-2" onClick={() => navigate('/interview')}>
                            AI 모의 면접 시작
                        </Button>
                        <Button variant="white" className="btn btn-primary shadow-sm border border-light py-2 px-4 rounded-3 fw-bold d-flex align-items-center gap-2" onClick={() => navigate('/resume')}>
                            AI 자기소개서 분석
                        </Button>
                    </div>
                </Container>
            </section>

            {/* 3. Logo Cloud */}
            <section className="py-5 border-top border-bottom border-light overflow-hidden">
                <Container className="text-center">
                    <p className="text-muted small fw-bold mb-4 opacity-50 text-uppercase" style={{ letterSpacing: '0.1em' }}>합격자 배출 기업</p>
                    <div className="d-flex justify-content-center align-items-center gap-5 grayscale opacity-50 flex-wrap">
                        {['삼성전자', '네이버', '카카오', '쿠팡', '현대자동차'].map(brand => (
                            <span key={brand} className="h5 fw-bold m-0">{brand}</span>
                        ))}
                    </div>
                </Container>
            </section>

            {/* 4. Features Section */}
            <section className="py-5 py-lg-10">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="fw-bold mb-3">취업 성공을 위한 모든 것</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '560px' }}>
                            인사 담당자가 원하는 것이 무엇인지 고민하지 마세요. 서류부터 면접까지 AI가 완벽하게 가이드해 드립니다.
                        </p>
                    </div>
                    <Row className="g-4">
                        {[
                            { icon: FileEarmarkTextFill, title: 'AI 자소서 첨삭', text: '작성한 초안을 업로드하면 직무에 맞춘 즉각적인 피드백을 제공합니다.' },
                            { icon: MicFill, title: '실시간 AI 모의 면접', text: '실제 직무 설명서를 기반으로 질문하는 AI 면접관과 연습하세요.' },
                            { icon: BarChartLineFill, title: '맞춤형 상세 피드백', text: '답변 내용, 목소리 톤, 말하기 속도에 대한 상세 분석을 받아보세요.' }
                        ].map((f, i) => (
                            <Col md={4} key={i}>
                                <Card className="h-100 border-0 shadow-sm rounded-4 p-4 hover-up transition">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 mb-4 w-fit" style={{ width: 'fit-content' }}>
                                        <f.icon className="text-primary" size={24} />
                                    </div>
                                    <h5 className="fw-bold mb-3">{f.title}</h5>
                                    <p className="text-muted small m-0" style={{ lineHeight: '1.7' }}>{f.text}</p>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* 5. Process Section */}
            <section className="py-5 py-lg-10 bg-light">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="fw-bold mb-3">이용 방법</h2>
                        <p className="text-muted small">꿈의 직장에 합격하기 위한 3단계</p>
                    </div>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div className="d-flex flex-column gap-5">
                                {[
                                    { icon: Search, title: '채용 공고 찾기', text: '지원하고자 하는 채용 공고의 URL을 입력하세요. AI가 핵심 요구사항을 분석합니다.' },
                                    { icon: PencilSquare, title: '이력서 업로드', text: '현재 이력서를 등록하여 AI가 지원자의 배경을 이해할 수 있도록 도와주세요.' },
                                    { icon: RocketTakeoffFill, title: '준비 완료', text: '즉시 자소서 첨삭을 받고 실전 모의 면접을 시작하세요.' }
                                ].map((step, i) => (
                                    <div key={i} className="d-flex gap-4">
                                        <div className="bg-white border rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                                            <step.icon className="text-primary" size={20} />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-2">{step.title}</h6>
                                            <p className="text-muted small m-0">{step.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <style>{`
        .font-korean { font-family: 'Pretendard', 'Noto Sans KR', sans-serif; }
        .hover-up:hover { transform: translateY(-5px); }
        .transition { transition: all 0.3s ease; }
        .grayscale { filter: grayscale(100%); }
        @media (min-width: 992px) { .py-lg-10 { padding-top: 6rem; padding-bottom: 6rem; } }
      `}</style>
        </div>
    );
};

export default Home;