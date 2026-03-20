import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../api/auth.js';
import SignupSidebar from '../../components/auth/signup/SignupSidebar.jsx';
import EmailVerification from '../../components/auth/signup/EmailVerification.jsx';
import PasswordField from '../../components/auth/signup/PasswordField.jsx';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nickname: '', email: '', password: '', provider: 'LOCAL', agreed: false });
  const [passwordCheck, setPasswordCheck] = useState('');
  const [code, setCode] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(300);

  // 타이머 및 기타 핸들러 로직 (기존과 동일)
  useEffect(() => {
    let interval;
    if (isSent && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && !verified && isSent) {
      alert('인증 시간이 만료되었습니다.');
      setIsSent(false);
    }
    return () => clearInterval(interval);
  }, [isSent, timer, verified]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // 폼 유효성 검사
  const isFormValid = formData.nickname && verified && formData.password.length >= 8 && formData.password === passwordCheck && formData.agreed;

  // API 호출 함수들 (handleRequestCode, handleVerifyCode, handleSubmit 등 기존 로직 유지)
  // 1. 인증번호 요청 핸들러
  const handleRequestCode = async () => {
    if (!formData.email) return alert("이메일을 입력해주세요.");

    try {
      const data = await auth.requestCode(formData.email);
      setIsSent(true);
      setTimer(300);
      alert(data.message);
    } catch (error) {
      setIsSent(false);
      alert(error.response?.data?.message || '오류가 발생했습니다.');
    }
  };

// 2. 인증번호 확인 핸들러
  const handleVerifyCode = async () => {
    try {
      const data = await auth.verifyCode(formData.email, code);
      if (data.success) {
        setVerified(true);
        setIsSent(false);
        setTimer(0);
        alert(data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || '인증에 실패했습니다.');
    }
  };

// 3. 최종 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    // (유효성 검사 로직 생략)
    try {
      const response = await auth.signup({
        nickname: formData.nickname,
        email: formData.email,
        password: formData.password,
        provider: formData.provider
      });

      if (response.status === 200) {
        alert(response.data.message);
        navigate('/login');
      }
    } catch (error) {
      alert(error.response?.data?.message || "회원가입 실패");
    }
  };

  return (
      <Container fluid className="vh-100 p-0">
        <Row className="g-0 h-100">
          <SignupSidebar />
          <Col md={7} className="bg-light d-flex align-items-center justify-content-center p-5">
            <div style={{ maxWidth: '450px', width: '100%' }}>
              <h2 className="fw-bold mb-4">계정 만들기</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="row mb-2">
                  <Form.Label className="col-sm-3 col-form-label small fw-semibold">닉네임</Form.Label>
                  <div className="col-sm-9">
                    <Form.Control name="nickname" placeholder="별명을 입력하세요." onChange={handleChange} required />
                  </div>
                </Form.Group>

                <EmailVerification
                    email={formData.email} isSent={isSent} verified={verified} timer={timer}
                    onEmailChange={handleChange} onCodeChange={(e) => setCode(e.target.value)}
                    onRequestCode={handleRequestCode} onVerifyCode={handleVerifyCode} formatTime={formatTime}
                />

                <PasswordField label="비밀번호" name="password" placeholder="최소 8글자 권장" onChange={handleChange} />
                <PasswordField label="비밀번호 확인" name="passwordCheck" placeholder="다시 입력해주세요." onChange={(e) => setPasswordCheck(e.target.value)} />

                <Form.Check className="mb-4 small mt-3">
                  <Form.Check.Input type="checkbox" name="agreed" onChange={handleChange} required />
                  <Form.Check.Label>이용약관 및 개인정보 처리방침에 동의합니다.</Form.Check.Label>
                </Form.Check>

                <Button disabled={!isFormValid} variant="primary" className="w-100 py-2 fw-bold" style={{ backgroundColor: '#1976D2' }} type="submit">
                  회원가입 완료
                </Button>
              </Form>
              <div className="text-center mt-4 small">
                이미 계정이 있으신가요? <Link to="/login" className="text-primary fw-bold">로그인</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
  );
};

export default Signup;