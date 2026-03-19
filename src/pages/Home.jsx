import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Search, FileEarmarkTextFill, MicFill, BarChartLineFill, PencilSquare, RocketTakeoffFill } from 'react-bootstrap-icons';
import {useNavigate} from "react-router-dom";
import SyncTalkLogo from "../assets/SyncTalk_Logo.png";

import CoverLetter from "../assets/buttons/cover_letter.png";
import Interview from "../assets/buttons/interview.png";
import Coaching from "../assets/buttons/coaching.png";

import Samsung from "../assets/logos/samsung.jpg";
import Naver from "../assets/logos/naver.png";
import Coupang from "../assets/logos/coupang.png";
import Kakao from "../assets/logos/kakao.png";
import Baemin from "../assets/logos/beamin.png";

const Home = () => {
    const navigate = useNavigate();

    // 샘플 로고 데이터 (이미지 9의 기업 리스트 반영)
    const logos = [
        { name: 'Samsung', url: Samsung },
        { name: 'Samsung', url: Naver },
        { name: 'Samsung', url: Coupang },
        { name: 'Samsung', url: Kakao },
        { name: 'Samsung', url: Baemin },
    ];

    // 무한 루프를 위해 배열을 복제
    const duplicatedLogos = [...logos, ...logos];

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
                    <h3 className="mx-auto mb-15" style={{ maxWidth: '600px', lineHeight: '2.0' }}>
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
                            <h3 className="fw-bold text-dark mt-2">AI 모의 면접 시작</h3>
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

            {/* 3. Logo Cloud */}
            <div className="py-5" style={{ backgroundColor: 'var(--st-bg-light)', overflow: 'hidden' }}>
                <style>{marqueeKeyframes}</style>

                <div className="container mb-4 text-center">
                    <p className="text-secondary small fw-bold" style={{ letterSpacing: '2px' }}>
                        합격자 배출 기업
                    </p>
                </div>

                <div className="d-flex position-relative w-100" style={{ overflow: 'hidden' }}>
                    {/* 애니메이션이 적용된 로고 컨테이너 */}
                    <div
                        className="d-flex align-items-center"
                        style={{
                            animation: 'marquee 30s linear infinite',
                            whiteSpace: 'nowrap',
                            display: 'flex'
                        }}
                    >
                        {duplicatedLogos.map((logo, index) => (
                            <div
                                key={index}
                                className="px-5 d-flex align-items-center justify-content-center"
                                style={{ flex: '0 0 auto' }}
                            >
                                <img
                                    src={logo.url}
                                    alt={logo.name}
                                    style={{
                                        height: '2rem',
                                        filter: 'grayscale(100%) brightness(150%)', // 로고 톤 통일
                                        opacity: 0.7,
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.filter = 'grayscale(0%) brightness(100%)';
                                        e.currentTarget.style.opacity = 1;
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.filter = 'grayscale(100%) brightness(150%)';
                                        e.currentTarget.style.opacity = 0.7;
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

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