import { FcGoogle } from "react-icons/fc"; // 구글 아이콘
import { RiKakaoTalkFill } from "react-icons/ri"; // 카카오 아이콘
import { FaGithub } from "react-icons/fa"; // 깃허브 아이콘

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // 백엔드 로그인 API 호출 예시
            const response = await axios.post('/auth/login', loginData);
            localStorage.setItem('token', response.data.token);
            alert("로그인 성공!");
        } catch (error) {
            alert("로그인 실패: 이메일 또는 비밀번호를 확인하세요.\n" + error.message);
        }
    };

    const handleSocialLogin = (provider) => {
        // 백엔드 서버 주소 (Spring Security 기본 엔드포인트)
        // provider: google, kakao, naver
        const backendUrl = `http://localhost:8080/oauth2/authorization/${provider}`;

        // 현재 창의 주소를 백엔드로 이동시켜 인증 프로세스 시작
        window.location.href = backendUrl;
    };

    return (
        <Container fluid className="min-vh-100 p-0" style={{ backgroundColor: '#0a0b10' }}>
            <Row className="flex-grow-1 g-0">

                {/* 왼쪽 섹션: 홍보 문구 */}
                <Col md={6} className="d-none d-md-flex flex-column justify-content-center p-5 text-white position-relative"
                     style={{ background: 'linear-gradient(135deg, #1a1c2e 0%, #0a0b10 100%)' }}>
                    <div className="px-5">
                        <div className="d-flex align-items-center mb-4">
                            <div className="bg-primary rounded-3 p-2 me-2" style={{ width: '40px', height: '40px' }}>
                                <span className="fw-bold">S</span>
                            </div>
                            <h4 className="fw-bold mb-0">SYNCTALK</h4>
                        </div>
                        <h1 className="display-4 fw-bold lh-sm mt-5">
                            면접을 완벽하게 준비하세요.<br />
                            합격의 문을 여세요.
                        </h1>
                        <p className="fs-5 text-secondary mt-4" style={{ color: '#8e919f !important' }}>
                            AI 기반 면접 준비와 맞춤형 자기소개서 첨삭으로 커리어를 한 단계 높여보세요.
                        </p>
                    </div>
                </Col>

                {/* 오른쪽 섹션: 로그인 폼 */}
                <Col md={6} className="d-flex align-items-center justify-content-center p-5">
                    <Card className="border-0 p-4 rounded-4"
                          style={{ backgroundColor: '#161b22', width: '100%', maxWidth: '420px', color: '#e6edf3' }}>
                        <Card.Body>
                            <h2 className="fw-bold mb-1">환영합니다</h2>
                            <p className="text-secondary small mb-5">계속하려면 로그인해주세요</p>

                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="small text-secondary">이메일</Form.Label>
                                    <Form.Control
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        className="bg-dark border-secondary text-white py-2"
                                        style={{ backgroundColor: '#0d1117', borderColor: '#30363d' }}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small text-secondary">비밀번호</Form.Label>
                                    <Form.Control
                                        name="password"
                                        type="password"
                                        placeholder="비밀번호를 입력하세요"
                                        className="bg-dark border-secondary text-white py-2"
                                        style={{ backgroundColor: '#0d1117', borderColor: '#30363d' }}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <Form.Check type="checkbox" label="로그인 상태 유지" className="small text-secondary" />
                                    <a href="#" className="small text-primary text-decoration-none">비밀번호를 잊으셨나요?</a>
                                </div>

                                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold mb-4"
                                        style={{ backgroundColor: '#5856d6', border: 'none' }}>
                                    로그인
                                </Button>

                                {/* "간편하게 시작하기" 텍스트 영역 */}
                                <div className="text-center mt-5 mb-3">
                                    <small className="text-secondary" style={{ fontSize: '0.8rem' }}>간편하게 시작하기</small>
                                </div>

                                {/* 소셜 로그인 아이콘 버튼 영역 (가로 배치) */}
                                <div className="d-flex justify-content-center gap-3 mb-4">
                                    {/* Google - 심플한 테두리 원형 */}
                                    <button className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center" 
                                            style={{ width: '45px', height: '45px', borderColor: '#30363d' }}
                                            onClick={() => handleSocialLogin('google')}
                                            title="Google 로그인">
                                        <FcGoogle size={24} />
                                    </button>

                                    {/* Kakao - 브랜드 컬러 원형 */}
                                    <button className="btn rounded-circle p-0 d-flex align-items-center justify-content-center" 
                                            style={{ width: '45px', height: '45px', backgroundColor: '#FEE500', color: '#191919', border: 'none' }}
                                            onClick={() => handleSocialLogin('kakao')}
                                            title="카카오 로그인">
                                        <RiKakaoTalkFill size={26} />
                                    </button>

                                    {/* GitHub - 다크 모드 원형 */}
                                    <button className="btn btn-dark rounded-circle p-0 d-flex align-items-center justify-content-center border-secondary" 
                                            style={{ width: '45px', height: '45px', backgroundColor: '#24292f', borderColor: '#30363d' }}
                                            onClick={() => handleSocialLogin('github')}
                                            title="GitHub 로그인">
                                        <FaGithub size={24} className="text-white" />
                                    </button>
                                </div>

                                <p className="text-center small text-secondary mt-3">
                                    계정이 없으신가요? <a href="/AIBE4_FinalProject_Team2_FE/signup" className="text-primary text-decoration-none fw-bold">회원가입</a>
                                </p>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;