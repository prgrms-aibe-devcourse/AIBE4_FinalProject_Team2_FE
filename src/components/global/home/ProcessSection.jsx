import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Search, PencilSquare, RocketTakeoffFill } from 'react-bootstrap-icons';

const ProcessSection = () => {
    const steps = [
        {
            icon: Search,
            title: '1. 채용 공고 분석',
            text: '목표하는 기업의 채용 공고 URL만 입력하세요. AI가 직무의 핵심 요구사항과 키워드를 즉시 파악합니다.'
        },
        {
            icon: PencilSquare,
            title: '2. 자기소개서 및 자소서 등록',
            text: '기존에 작성해둔 자소서를 업로드해 주세요. AI가 지원자님의 역량과 강점을 깊이 있게 이해하고 맞춤형 전략을 세웁니다.'
        },
        {
            icon: RocketTakeoffFill,
            title: '3. 맞춤형 실전 대비',
            text: '정교한 자소서 첨삭과 실전 같은 AI 모의 면접을 바로 시작해 보세요.'
        }
    ];

    return (
        <section className="py-5 py-lg-10 bg-light">
            <Container>
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-3">이용 방법</h2>
                    <p className="text-muted mx-auto" style={{ fontSize: '1.1rem' }}>
                        꿈의 직장에 합격하기 위한 <span className="text-primary fw-bold">3단계</span>
                    </p>
                </div>
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <div className="d-flex flex-column gap-5">
                            {steps.map((step, i) => (
                                <div key={i} className="d-flex align-items-start gap-4 hover-up transition p-3 rounded-4" style={{ cursor: 'default' }}>
                                    <div className="bg-white border border-light rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                         style={{ width: '56px', height: '56px', flexShrink: 0, marginTop: '2px' }}>
                                        <step.icon className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-2" style={{ fontSize: '1.2rem', letterSpacing: '-0.01em' }}>
                                            {step.title}
                                        </h5>
                                        <p className="text-muted m-0" style={{ fontSize: '0.95rem', lineHeight: '1.6', wordBreak: 'keep-all' }}>
                                            {step.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default ProcessSection;