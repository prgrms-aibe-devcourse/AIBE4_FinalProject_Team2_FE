import React from 'react';
import LogoStrip1 from "../../../assets/logos/logo1.png";
import LogoStrip2 from "../../../assets/logos/logo2.png";
import LogoStrip3 from "../../../assets/logos/logo3.png";

const LogoMarquee = () => {
    return (
        <section style={{ backgroundColor: '#0a0a0a', padding: '1.2rem', overflow: 'hidden' }}>
            <style>{`
                @keyframes marqueeBanner {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-25%); }
                }
                .marquee-track { display: flex; width: max-content; animation: marqueeBanner 40s linear infinite; }
                .marquee-img { height: 60px; width: auto; flex-shrink: 0; display: block; }
            `}</style>
            <div className="marquee-track">
                {[LogoStrip1, LogoStrip2, LogoStrip3, LogoStrip1, LogoStrip2, LogoStrip3].map((logo, i) => (
                    <img key={i} src={logo} className="marquee-img" alt="Partners" />
                ))}
            </div>
        </section>
    );
};

export default LogoMarquee;