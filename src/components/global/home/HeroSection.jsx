import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SyncTalkLogo from "../../../assets/SyncTalk_Logo.png";
import Interview from "../../../assets/buttons/interview.png";
import CoverLetter from "../../../assets/buttons/cover_letter.png";
import Coaching from "../../../assets/buttons/coaching.png";

const HeroSection = () => {
    const navigate = useNavigate();

    const features = [
        { path: '/interview', img: Interview, title: 'AI 모의 면접' },
        { path: '/resume', img: CoverLetter, title: 'AI 자기소개서 분석' },
        { path: '/job-posting', img: Coaching, title: '면접 코칭 컨설턴트' },
    ];

    return (
        <section className="py-5 py-lg-10 text-center bg-light">
            <Container>
                <h1 className="display-4 fw-bold" style={{ letterSpacing: '-0.02em' }}>
                    AI와 함께하는 취업 준비 플랫폼
                </h1>
                <img src={SyncTalkLogo} alt="Logo" style={{ width: '20rem', height: '10rem', objectFit: 'cover' }} className="my-4" />
                <h3 className="fw-bold mb-3 mx-auto" style={{ maxWidth: '600px', lineHeight: '2.0' }}>
                    AI와 함께하는 취업 준비를 경험해보세요
                </h3>

                <div className="d-flex justify-content-center gap-5 mt-5">
                    {features.map((f, i) => (
                        <div key={i} className="d-flex flex-column align-items-center img-btn-wrapper"
                             onClick={() => navigate(f.path)} style={{ cursor: 'pointer' }}>
                            <div className="bg-white shadow-sm rounded-4 p-4 mb-3 border border-light transition-hover">
                                <img src={f.img} alt={f.title} style={{ width: '12rem', height: '12rem', objectFit: 'contain' }} />
                            </div>
                            <h3 className="fw-bold text-dark mt-2">{f.title}</h3>
                        </div>
                    ))}
                </div>
            </Container>
            <style>{`
                .transition-hover { transition: all 0.3s ease; }
                .img-btn-wrapper:hover .transition-hover {
                    transform: translateY(-10px);
                    box-shadow: 0 1rem 3rem rgba(0,0,0,.175) !important;
                    border-color: #1976D2 !important;
                }
                .img-btn-wrapper:hover h3 { color: #1976D2 !important; }
            `}</style>
        </section>
    );
};

export default HeroSection;