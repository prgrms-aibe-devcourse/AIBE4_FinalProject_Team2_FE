function Footer() {
    return (
        <footer className="bg-light py-5 border-top">
            <div className="container">
                <div className="row">
                    {/* 좌측: 로고 및 설명 */}
                    <div className="col-lg-4 mb-4 mb-lg-0">
                        <div className="d-flex align-items-center mb-3">
                            {/* 실제 로고 이미지가 있다면 <img src="..." /> 로 대체하세요 */}
                            <div
                                className="bg-primary rounded d-flex align-items-center justify-content-center me-2"
                                style={{ width: '32px', height: '32px' }}
                            >
                                <i className="bi bi-chat-dots-fill text-white"></i>
                            </div>
                            <h5 className="fw-bold mb-0">SyncTalk</h5>
                        </div>
                        <p className="text-muted small" style={{ lineHeight: '1.6', maxWidth: '280px' }}>
                            AI 도구를 통해 완벽한 맞춤형 지원서 작성과 자신감 있는 면접 준비를 돕고 구직자에게 힘을 실어줍니다.
                        </p>
                    </div>

                    {/* 우측: 링크 섹션들 */}
                    <div className="col-lg-8">
                        <div className="row">
                            {/* 제품 섹션 */}
                            <div className="col-md-4 mb-4 mb-md-0">
                                <h6 className="fw-bold mb-3">제품</h6>
                                <ul className="list-unstyled small text-muted">
                                    <li className="mb-2"><a href="#" className="text-decoration-none text-reset">자소서 생성기</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none text-reset">AI 모의 면접</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none text-reset">이력서 스캔</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none text-reset">요금제</a></li>
                                </ul>
                            </div>

                            {/* 리소스 섹션 */}
                            <div className="col-md-4 mb-4 mb-md-0">
                                <h6 className="fw-bold mb-3">리소스</h6>
                                <ul className="list-unstyled small text-muted">
                                    <li className="mb-2"><a href="#" className="text-decoration-none text-reset">블로그</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none text-reset">취업 팁</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none text-reset">면접 가이드</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none text-reset">고객센터</a></li>
                                </ul>
                            </div>

                            {/* 법적 고지 섹션 */}
                            <div className="col-md-4">
                                <h6 className="fw-bold mb-3">법적 고지</h6>
                                <ul className="list-unstyled small text-muted">
                                    <li className="mb-2"><a href="#" className="text-decoration-none text-reset">개인정보 처리방침</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none text-reset">이용약관</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none text-reset">쿠키 정책</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 카피라이트 */}
                <div className="mt-5 pt-4 border-top text-center">
                    <p className="text-muted small">
                        &copy; 2023 SyncTalk Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;