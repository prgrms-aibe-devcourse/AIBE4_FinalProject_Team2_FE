import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FileEarmarkTextFill, MicFill, BarChartLineFill } from 'react-bootstrap-icons';

const FeatureSection = () => {
    const features = [
        {
            icon: FileEarmarkTextFill,
            title: 'AI 모의 면접',
            text: '초안을 업로드하면 직무에 맞춘 즉각적인 피드백을 제공합니다.'
        },
        {
            icon: MicFill,
            title: 'AI 자기소개서 분석',
            text: '실제 채용 공고를 기반으로 한 맞춤형 질문으로 실전 감각을 극대화 하세요.'
        },
        {
            icon: BarChartLineFill,
            title: '면접 코칭 컨설턴트',
            text: '답변의 논리성부터 목소리 톤까지, 합격을 위한 디테일한 분석 리포트를 받아보세요.'
        }
    ];

    return (
        <section className="py-5 py-lg-10">
            <Container>
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-3">취업 성공을 위한 발걸음</h2>
                    <p className="text-muted mx-auto"
                       style={{ maxWidth: '750px', fontSize: '1.1rem', wordBreak: 'keep-all', lineHeight: '1.3' }}>
                        인사 담당자가 원하는 핵심 면접까지 AI가 완벽한 가이드라인을 제시합니다.
                    </p>
                </div>
                <Row className="g-4">
                    {features.map((f, i) => (
                        <Col md={4} key={i}>
                            <Card className="h-100 border-0 shadow-sm rounded-4 p-4 hover-up transition">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-3 mb-4 w-fit" style={{ width: 'fit-content' }}>
                                    <f.icon className="text-primary" size={24} />
                                </div>
                                <h5 className="fw-bold mb-3" style={{ fontSize: '1.25rem', letterSpacing: '-0.01em' }}>
                                    {f.title}
                                </h5>
                                <p className="text-muted small m-0" style={{ fontSize: '0.95rem', lineHeight: '1.6', wordBreak:'keep-all' }}>
                                    {f.text}
                                </p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
};

export default FeatureSection;