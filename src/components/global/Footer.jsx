import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    // 현재 연도를 자동으로 가져와서 업데이트할 수 있게 합니다.
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-5 bg-white border-top mt-auto">
            <div className="container">
                {/* SPA의 핵심: a 태그 대신 Link 컴포넌트 사용 */}
                <div className="d-flex justify-content-center gap-4 mb-3">
                    <Link
                        to="/terms"
                        className="text-secondary text-decoration-none small hover-dark"
                    >
                        이용약관
                    </Link>
                    <Link
                        to="/privacy"
                        className="text-secondary text-decoration-none small hover-dark"
                    >
                        개인정보처리방침
                    </Link>
                    <Link
                        to="/support"
                        className="text-secondary text-decoration-none small hover-dark"
                    >
                        고객센터
                    </Link>
                </div>

                {/* 카피라이트 영역 */}
                <div className="text-center">
                    <p className="text-secondary mb-0" style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                        © {currentYear} SyncTalk. All rights reserved.
                    </p>
                </div>
            </div>

            {/* 단순 호버 효과를 위한 인라인 스타일 (또는 App.css에 추가 가능) */}
            <style>{`
        .hover-dark:hover {
          color: #212529 !important;
          transition: color 0.2s ease-in-out;
        }
      `}</style>
        </footer>
    );
};

export default Footer;