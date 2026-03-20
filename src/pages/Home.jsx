import React from 'react';
import HeroSection from '../components/global/home/HeroSection.jsx';
import LogoMarquee from '../components/global/home/LogoMarquee.jsx';
import FeatureSection from '../components/global/home/FeatureSection.jsx';
import ProcessSection from '../components/global/home/ProcessSection.jsx';

const Home = () => {
    return (
        <div className="bg-white min-vh-100 font-korean">
            {/* 1. Hero & Quick Links */}
            <HeroSection />

            {/* 2. Infinite Rolling Banner */}
            <LogoMarquee />

            {/* 3. Features Section */}
            <FeatureSection />

            {/* 4. Process Step Section */}
            <ProcessSection />

            <style>{`
                .font-korean { font-family: 'Pretendard', 'Noto Sans KR', sans-serif; }
                .hover-up:hover { transform: translateY(-5px); }
                .transition { transition: all 0.3s ease; }
                @media (min-width: 992px) { .py-lg-10 { padding-top: 6rem; padding-bottom: 6rem; } }
            `}</style>
        </div>
    );
};

export default Home;