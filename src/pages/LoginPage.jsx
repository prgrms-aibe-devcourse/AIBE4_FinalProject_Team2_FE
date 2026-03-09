import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { FcGoogle } from 'react-icons/fc'; // 구글 아이콘
import { RiKakaoTalkFill } from 'react-icons/ri'; // 카카오 아이콘
import { SiNaver } from 'react-icons/si'; // 네이버 아이콘
import './LoginPage.css';
import { Link } from 'react-router-dom';

function LoginPage() {
    return (
        <Container fluid className="login-container p-0">
            <Row className="g-0 min-vh-100">
                {/* 좌측 홍보 섹션 */}
                <Col lg={6} className="left-section d-none d-lg-flex flex-column justify-content-end p-5">
                    <div className="brand-logo mb-4">
                        <span className="logo-icon">💬</span>
                        <span className="logo-text ms-2">SYNCTALK</span>
                    </div>
                    <h1 className="display-4 fw-bold text-white mb-3">
                        면접을 완벽하게 준비하세요.<br />
                        합격의 문을 여세요.
                    </h1>
                    <p className="lead text-light-50">
                        AI 기반 면접 준비와 맞춤형 자기소개서 첨삭으로 커리어를 한 단계 높여보세요.
                    </p>
                </Col>

                {/* 우측 로그인 섹션 */}
                <Col lg={6} className="right-section d-flex align-items-center justify-content-center p-4">
                    <div className="login-card p-5">
                        <h2 className="text-white mb-1">환영합니다</h2>
                        <p className="text-secondary mb-4">계속하려면 로그인해주세요</p>

                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label className="text-light-50 small">이메일</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="name@example.com"
                                    className="bg-dark text-white border-secondary"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label className="text-light-50 small">비밀번호</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="비밀번호를 입력하세요"
                                    className="bg-dark text-white border-secondary"
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <Form.Check type="checkbox" label="로그인 상태 유지" className="text-secondary small" />
                                <a href="#" className="text-primary small text-decoration-none">비밀번호를 잊으셨나요?</a>
                            </div>

                            <Button variant="primary" type="submit" className="w-100 py-2 mb-4 btn-login">
                                로그인
                            </Button>

                            <div className="divider mb-4">
                                <span>간편 로그인</span>
                            </div>

                            <div className="d-flex gap-3 mb-4">
                                <Button variant="outline-secondary" className="social-btn flex-grow-1">
                                    <FcGoogle size={20} />
                                </Button>
                                <Button variant="warning" className="social-btn flex-grow-1 kakao-btn">
                                    <RiKakaoTalkFill size={20} />
                                </Button>
                                <Button variant="success" className="social-btn flex-grow-1 naver-btn">
                                    <SiNaver size={14} />
                                </Button>
                            </div>

                            <p className="text-center text-secondary small">
                                계정이 없으신가요? <Link to="/signup" className="text-primary text-decoration-none">회원가입</Link>
                            </p>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;