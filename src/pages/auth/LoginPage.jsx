import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api, { setAuthToken } from '../../api/axios.js';
import LoginSidebar from '../../components/auth/loginPage/LoginSidebar.jsx';
import LoginForm from '../../components/auth/loginPage/LoginForm.jsx';
import SocialLoginGroup from '../../components/auth/loginPage/SocialLoginGroup.jsx';

const LoginPage = ({onLoginSuccess}) => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', loginData);
            const payload = response.data.data ?? response.data;

            localStorage.setItem('accessToken', payload.accessToken ?? "");
            localStorage.setItem('refreshToken', payload.refreshToken ?? "");
            localStorage.setItem('role', payload.role ?? "");
            localStorage.setItem('email', payload.email ?? "");
            localStorage.setItem('nickname', payload.nickname ?? "");

            if (payload.accessToken) setAuthToken(payload.accessToken);
            if (onLoginSuccess) onLoginSuccess();

            alert(`${payload.nickname || '사용자'}님, 환영합니다!`);
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || "로그인에 실패했습니다.");
        }
    };

    const handleSocialLogin = (provider) => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/${provider}`;
    };

    return (
        <Container fluid className="vh-100 p-0 overflow-hidden">
            <Row className="g-0 h-100">
                <LoginSidebar />
                <Col md={7} className="bg-light d-flex align-items-center justify-content-center p-4 p-lg-5">
                    <div style={{ maxWidth: '420px', width: '100%' }}>
                        <div className="mb-5 text-center text-md-start">
                            <h2 className="fw-bold">로그인</h2>
                            <p className="text-muted small">등록된 계정 정보를 입력해주세요.</p>
                        </div>

                        <LoginForm onLogin={handleLogin} onChange={handleChange} />

                        <SocialLoginGroup onSocialLogin={handleSocialLogin} />

                        <div className="text-center small mt-4">
                            이메일 또는 비밀번호를 잊었나요? <Link to="/find" className="fw-bold text-primary">계정 찾기</Link> <br/><br/>
                            아직 회원이 아니신가요? <Link to="/signup" className="fw-bold text-primary">지금 회원가입</Link>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;