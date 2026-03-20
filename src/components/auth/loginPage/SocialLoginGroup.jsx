import React from 'react';
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FaGithub } from "react-icons/fa";

const SocialLoginGroup = ({ onSocialLogin }) => {
    const providers = [
        { id: 'google', icon: <FcGoogle size={30} />, bg: 'white' },
        { id: 'kakao', icon: <RiKakaoTalkFill size={32} color="#191919" />, bg: '#FEE500' },
        { id: 'github', icon: <FaGithub size={30} color="white" />, bg: '#24292f' }
    ];

    return (
        <div className="rounded-5 overflow-hidden" style={{ backgroundColor: '#f0f0f0' }}>
            <div className="d-flex align-items-center px-4 pt-3">
                <div className="flex-grow-1" style={{ height: '1px', backgroundColor: '#ccc' }}></div>
                <span className="px-3 text-muted fw-bold" style={{ fontSize: '0.875rem' }}>소셜 계정으로 로그인</span>
                <div className="flex-grow-1" style={{ height: '1px', backgroundColor: '#ccc' }}></div>
            </div>

            <div className="d-flex justify-content-center gap-2 pb-4 pt-4">
                {providers.map((p) => (
                    <button
                        key={p.id}
                        className="mx-2 btn rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                        style={{ width: '60px', height: '60px', backgroundColor: p.bg, border: "none" }}
                        onClick={() => onSocialLogin(p.id)}
                    >
                        {p.icon}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SocialLoginGroup;