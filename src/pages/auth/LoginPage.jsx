import { FcGoogle } from "react-icons/fc"; // 구글 아이콘
import { RiKakaoTalkFill } from "react-icons/ri"; // 카카오 아이콘
import { FaGithub } from "react-icons/fa"; // 깃허브 아이콘

import React, { useState } from 'react';
import {Container, Row, Col, Form, Button, InputGroup} from 'react-bootstrap';
import { EyeSlash, Envelope, Lock } from 'react-bootstrap-icons';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../api/axios.js';

const LoginPage = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', loginData);

            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('email', response.data.email);
            localStorage.setItem('nickname', response.data.nickname);

            alert("로그인 성공!");
            navigate('/');
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleSocialLogin = (provider) => {
        // 백엔드 서버 주소 (Spring Security 기본 엔드포인트)
        // provider: google, kakao, naver
        const backendUrl = `http://localhost:8081/oauth2/authorization/${provider}`;

        // 현재 창의 주소를 백엔드로 이동시켜 인증 프로세스 시작
        window.location.href = backendUrl;
    };

    return (
        <Container fluid className="vh-100 p-0 overflow-hidden">
            <Row className="g-0 h-100">
                {/* 왼쪽: 홍보 섹션 (기존 디자인 유지) */}
                <Col md={5} className="d-none d-md-flex flex-column justify-content-between p-5 bg-gradient-sidebar">
                    <div>
                        <h4 className="fw-bold text-primary mb-5">SyncTalk</h4>
                        <div className="mt-5">
                            <h1 className="display-5 fw-bold mb-4">다시 오신 것을<br />환영합니다!</h1>
                            <p className="text-muted fs-5">
                                로그인하여 AI와 함께 면접 준비를 이어가고<br />
                                당신의 커리어 목표에 한 걸음 더 다가가세요.
                            </p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="small text-secondary">© 2026 SyncTalk. All rights reserved.</p>
                    </div>
                </Col>

                {/* 오른쪽: 로그인 폼 섹션 (첨부 이미지 스타일 + 컬러 스키마) */}
                <Col md={7} className="bg-light d-flex align-items-center justify-content-center p-4 p-lg-5">
                    <div style={{ maxWidth: '420px', width: '100%' }}>
                        <div className="mb-5 text-center text-md-start">
                            <h2 className="fw-bold">로그인</h2>
                            <p className="text-muted small">등록된 계정 정보를 입력해주세요.</p>
                        </div>

                        <Form onSubmit={handleLogin}>
                            {/* 이메일 입력 (세로형 라벨 + 아이콘) */}
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-semibold text-dark">이메일</Form.Label>
                                <InputGroup className="bg-white rounded border">
                                    <InputGroup.Text className="bg-white border-0">
                                        <Envelope className="text-muted" size={18} />
                                    </InputGroup.Text>
                                    <Form.Control name="email" type="email" placeholder="name@company.com" className="border-0" onChange={handleChange} />
                                </InputGroup>
                            </Form.Group>

                            {/* 비밀번호 입력 (세로형 라벨 + 아이콘 + 비밀번호 가리기) */}
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-semibold text-dark">비밀번호</Form.Label>
                                <InputGroup className="bg-white rounded border">
                                    <InputGroup.Text className="bg-white border-0">
                                        <Lock className="text-muted" size={18} />
                                    </InputGroup.Text>
                                    <Form.Control name="password" type="password" placeholder="비밀번호를 입력하세요" className="border-0 border-end-0" onChange={handleChange} />
                                    <InputGroup.Text className="bg-white border-0">
                                        <EyeSlash className="text-muted" size={18} />
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>

                            {/* 로그인 상태 유지 및 비밀번호 찾기 (이미지 요소 유지) */}
                            {/*<div className="d-flex justify-content-between align-items-center mb-4">*/}
                            {/*    <Form.Check*/}
                            {/*        type="checkbox"*/}
                            {/*        id="remember-me"*/}
                            {/*        label={<span className="text-muted" style={{ fontSize: '0.8rem' }}>로그인 상태 유지</span>}*/}
                            {/*    />*/}
                            {/*    <a href="/forgot-password" style={{ fontSize: '0.8rem' }} className="fw-bold text-primary text-decoration-none">비밀번호를 잊으셨나요?</a>*/}
                            {/*</div>*/}

                            {/* 로그인 버튼 (Primary 블루 적용) */}
                            <Button type="submit" variant="primary" className="mt-4 w-100 py-2 fw-bold mb-4 shadow-sm">
                                로그인하기
                            </Button>
                        </Form>

                        {/* 구분선 (이미지 스타일 유지) */}
                        <div className="text-center mb-4 position-relative">
                            <hr className="text-border" />
                            <span className="position-absolute top-50 start-50 translate-middle bg-light px-3 text-muted" style={{ fontSize: '0.75rem' }}>
                  또는 소셜 계정으로 로그인
                </span>
                        </div>

                        {/* 소셜 로그인 아이콘 버튼 영역 (가로 배치) */}
                        <div className="d-flex justify-content-center gap-3 mb-4">
                            {/* Google - 심플한 테두리 원형 */}
                            <button className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center m-2"
                                    style={{ width: '60px', height: '60px', backgroundColor: "white", border: "none" }}
                                    title="Google 로그인"
                                    type="button"
                                    onClick={() => handleSocialLogin('google')}>
                                <FcGoogle size={24} />
                            </button>

                            {/* Kakao - 브랜드 컬러 원형 */}
                            <button className="btn rounded-circle p-0 d-flex align-items-center justify-content-center m-2"
                                    style={{ width: '60px', height: '60px', backgroundColor: '#FEE500', color: '#191919', border: 'none' }}
                                    title="카카오 로그인"
                                    type="button"
                                    onClick={() => handleSocialLogin('kakao')}>
                                <RiKakaoTalkFill size={26} />
                            </button>

                            {/* GitHub - 다크 모드 원형 */}
                            <button className="btn btn-dark rounded-circle p-0 d-flex align-items-center justify-content-center border-secondary m-2"
                                    style={{ width: '60px', height: '60px', backgroundColor: '#24292f', borderColor: '#30363d' }}
                                    title="GitHub 로그인"
                                    type="button"
                                    onClick={() => handleSocialLogin('github')}>
                                <FaGithub size={24} className="text-white" />
                            </button>
                        </div>

                        {/* 회원가입 링크 (Primary 블루 적용) */}
                        <div className="text-center small">
                            아직 회원이 아니신가요? <Link to="/signup" className="fw-bold text-primary text-decoration-none">지금 회원가입</Link>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;