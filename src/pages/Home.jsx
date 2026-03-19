import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Search, FileEarmarkTextFill, MicFill, BarChartLineFill, PencilSquare, RocketTakeoffFill } from 'react-bootstrap-icons';
import {useNavigate} from "react-router-dom";
import SyncTalkLogo from "../assets/SyncTalk_Logo.png";

import CoverLetter from "../assets/buttons/cover_letter.png";
import Interview from "../assets/buttons/interview.png";
import Coaching from "../assets/buttons/coaching.png";

import LogoStrip1 from "../assets/logos/logo1.png";
import LogoStrip2 from "../assets/logos/logo2.png";
import LogoStrip3 from "../assets/logos/logo3.png";

const Home = () => {
    const navigate = useNavigate();

    // 샘플 로고 데이터 (이미지 9의 기업 리스트 반영)
    const logos = [
        { name: 'LogoStrip1', url: LogoStrip1 },
        { name: 'LogoStrip2', url: LogoStrip2 },
        { name: 'LogoStrip3', url: LogoStrip3 },
    ];

    // 무한 루프를 위해 배열을 복제
    const duplicatedLogos = [...logos, ...logos, ...logos, ...logos, ]; 

    // 인라인 키프레임 애니메이션 정의
    const marqueeKeyframes = `
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `;

    const stPrimary = '#1976D2'; // SyncTalk 브랜드 블루

    return (
        <div className="bg-white min-vh-100 font-korean">

            {/* 2. Hero Section */}
            <section className="py-5 py-lg-10 text-center bg-gradient-light" style={{ background: 'linear-gradient(to bottom, #f8faff, #ffffff)' }}>
                <Container>
                    <h1 className="display-4 fw-bold" style={{ letterSpacing: '-0.02em' }}>
                        AI와 함께하는 취업 준비 <span style={{ color: stPrimary }}>SyncTalk</span>
                    </h1>
                    <img src={SyncTalkLogo} alt="Logo" style={{ width: '20rem', height: '10rem', objectFit: 'cover' }} className="my-4"/>
                    <h3 className="fw-bold mb-3 mx-auto" style={{ maxWidth: '600px', lineHeight: '2.0' }}>
                        AI와 함께하는 취업 준비를 경험해보세요
                    </h3>

                    {/* Feature Quick Links */}
                    <div className="d-flex justify-content-center gap-5 mt-5">
                        {/* 1. AI 모의 면접 시작 */}
                        <div
                            className="d-flex flex-column align-items-center cursor-pointer img-btn-wrapper"
                            onClick={() => navigate('/interview')}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="bg-white shadow-sm rounded-4 p-4 mb-3 border border-light transition-hover">
                                <img src={Interview} alt="Interview" style={{ width: '12rem', height: '12rem', objectFit: 'contain' }} />
                            </div>
                            <h3 className="fw-bold text-dark mt-2">AI 모의 면접</h3>
                        </div>

                        {/* 2. AI 자기소개서 분석 */}
                        <div
                            className="d-flex flex-column align-items-center cursor-pointer img-btn-wrapper"
                            onClick={() => navigate('/resume')}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="bg-white shadow-sm rounded-4 p-4 mb-3 border border-light transition-hover">
                                <img src={CoverLetter} alt="CoverLetter" style={{ width: '12rem', height: '12rem', objectFit: 'contain' }} />
                            </div>
                            <h3 className="fw-bold text-dark mt-2">AI 자기소개서 분석</h3>
                        </div>

                        {/* 3. 면접 코칭 컨설턴트 */}
                        <div
                            className="d-flex flex-column align-items-center cursor-pointer img-btn-wrapper"
                            onClick={() => navigate('/job-posting')}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="bg-white shadow-sm rounded-4 p-4 mb-3 border border-light transition-hover">
                                <img src={Coaching} alt="Coaching" style={{ width: '12rem', height: '12rem', objectFit: 'contain' }} />
                            </div>
                            <h3 className="fw-bold text-dark mt-2">면접 코칭 컨설턴트</h3>
                        </div>

                        <style>{`
        .transition-hover {
            transition: all 0.3s ease;
        }
        .img-btn-wrapper:hover .transition-hover {
            transform: translateY(-10px);
            box-shadow: 0 1rem 3rem rgba(0,0,0,.175) !important;
            border-color: #1976D2 !important;
        }
        .img-btn-wrapper:hover h3 {
            color: #1976D2 !important;
        }
    `}</style>
                    </div>
                </Container>
            </section>

           {/* 3. Logo Cloud (프로그래머스 스타일 무한 롤링 배너) */}
            <section style={{ backgroundColor: '#0a0a0a', padding: '1.2rem', overflow: 'hidden' }}>
                <style>{`
                    @keyframes marqueeBanner {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .marquee-track {
                        display: flex;
                        width: max-content;
                        animation: marqueeBanner 40s linear infinite; 
                    }
                    .marquee-img {
                        height: 60px; 
                        width: auto;
                        flex-shrink: 0; 
                        display: block;
                    }
                `}</style>
                <div className="marquee-track">
                    <img src={LogoStrip1} className="marquee-img" alt="합격자 배출 기업 파트너스" />
                    <img src={LogoStrip2} className="marquee-img" alt="합격자 배출 기업 파트너스" />
                    <img src={LogoStrip3} className="marquee-img" alt="합격자 배출 기업 파트너스" />
                    
                </div>
            </section>

            {/* 4. Features Section */}
            <section className="py-5 py-lg-10">
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="fw-bold mb-3">취업 성공을 위한 발걸음</h2>
                        
                        
                        <p 
                            className="text-muted mx-auto" 
                            style={{ 
                                maxWidth: '750px', 
                                fontSize: '1.1rem', 
                                wordBreak: 'keep-all', 
                                lineHeight: '1.3'
                            }}
                        >
                            인사 담당자가 원하는 핵심 면접까지 AI가 완벽한 가이드라인을 제시합니다.
                        </p>
                    </div>
                    <Row className="g-4">
                        {[
                            { 
                                icon: FileEarmarkTextFill,
                                title: 'AI 모의 면접',
                                text: '초안을 업로드하면 직무에 맞춘 즉각적인 피드백을 제공합니다.' },
                            {
                                icon: MicFill,
                                title: 'AI 자기소개서 분석',
                                text: '실제 채용 공고를 기반으로 한 맞춤형 질문으로 실전 감각을 극대화 하세요.' },
                            {
                                icon: BarChartLineFill,
                                title: '면접 코칭 컨설턴트',
                                text: '답변의 논리성부터 목소리 톤까지, 합격을 위한 디테일한 분석 리포트를 받아보세요.' }
                        ].map((f, i) => (
                            <Col md={4} key={i}>
                                <Card className="h-100 border-0 shadow-sm rounded-4 p-4 hover-up transition">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 mb-4 w-fit" style={{ width: 'fit-content' }}>
                                        <f.icon className="text-primary" size={24} />
                                    </div>

                                    <h5 className="fw-bold mb-3" style={{ fontSize: '1.25rem' , letterSpacing: '-0.01em'}}>
                                        {f.title}
                                    </h5>
                                    <p className="text-muted small m-0" style={{ fontSize: '0.95rem', lineHeight: '1.6', wordBreak:'keep-all' }}>{f.text}</p>
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
                        <p className="text-muted mx-auto" style={{ fontSize: '1.1rem' }}>
                            꿈의 직장에 합격하기 위한 <span className="text-primary fw-bold">3단계</span>
                        </p>
                    </div>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div className="d-flex flex-column gap-5">
                                {[
                                    { 
                                        icon: Search, 
                                        title: '1. 채용 공고 분석', 
                                        text: '목표하는 기업의 채용 공고 URL만 입력하세요. AI가 직무의 핵심 요구사항과 키워드를 즉시 파악합니다.' 
                                    },
                                    { 
                                        icon: PencilSquare, 
                                        title: '2. 이력서 및 자소서 등록', 
                                        text: '기존에 작성해둔 이력서나 자소서를 업로드해 주세요. AI가 지원자님의 역량과 강점을 깊이 있게 이해하고 맞춤형 전략을 세웁니다.' 
                                    },
                                    { 
                                        icon: RocketTakeoffFill, 
                                        title: '3. 맞춤형 실전 대비', 
                                        text: '정교한 자소서 첨삭과 실전 같은 AI 모의 면접을 바로 시작해 보세요.' 
                                    }
                                ].map((step, i) => (
                                    <div key={i} className="d-flex align-items-start gap-4 hover-up transition p-3 rounded-4" style={{ cursor: 'default' }}>
                                        <div 
                                            className="bg-white border border-light rounded-circle d-flex align-items-center justify-content-center shadow-sm" 
                                            style={{ width: '56px', height: '56px', flexShrink: 0, marginTop: '2px' }}
                                        >
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