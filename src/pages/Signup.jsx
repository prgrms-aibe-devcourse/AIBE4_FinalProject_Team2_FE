import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
  const navigate = useNavigate();

  // 백엔드 MemberDTO 구조에 맞게 상태 설정
  const [formData, setFormData] = useState({
    nickname: '',   // request.getNickname()에 대응
    email: '',      // request.getEmail()에 대응
    password: '',   // request.getPassword()에 대응
    provider: 'LOCAL', // 일반 가입이므로 기본값 설정
    agreed: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 간단한 프론트엔드 방어 로직
    if (!formData.agreed) {
      alert("이용약관에 동의해주세요.");
      return;
    }

    try {
      // 작성하신 백엔드 API 주소로 데이터 전송
      const response = await axios.post('auth/signup', {
        nickname: formData.nickname,
        email: formData.email,
        password: formData.password,
        provider: formData.provider
      });

      if (response.status === 200) {
        alert(response.data); // "회원가입이 완료되었습니다."
        navigate('/login');    // 가입 완료 후 로그인 페이지로 이동
      }
    } catch (error) {
      // 백엔드에서 던지는 400 에러(중복 아이디 등) 처리
      const errorMessage = error.response?.data || "회원가입 중 오류가 발생했습니다.";
      alert(errorMessage);
    }
  };

  return (
      <Container fluid className="vh-100 p-0">
        <Row className="h-100 g-0">
          {/* 왼쪽 홍보 섹션 (생략 가능, 이전 코드와 동일) */}
          <Col md={5} className="bg-light d-none d-md-flex flex-column justify-content-center p-5 position-relative">
            <div className="mb-5 px-4">
              <h5 className="text-primary fw-bold">SyncTalk</h5>
              <h1 className="display-5 fw-bold mt-5">AI와 함께 면접 스킬을 마스터하세요.</h1>
              <p className="text-muted mt-4">맞춤형 자기소개서와 실전 같은 모의 면접으로 꿈의 직장에 합격한 10,000명 이상의 지원자들과 함께하세요.</p>
            </div>
            <div className="card shadow-sm border-0 p-4 mx-4 mt-5 bg-white rounded-4">
              <p className="small text-warning">★★★★★</p>
              <p className="small">"SyncTalk 덕분에 PM 직무 면접 답변을 완벽하게 다듬을 수 있었어요. 면접장에 들어갈 때 자신감이 훨씬 넘쳤습니다."</p>
              <div className="d-flex align-items-center mt-3">
                <div className="bg-secondary rounded-circle me-3" style={{width: '40px', height: '40px'}}></div>
                <div>
                  <p className="mb-0 fw-bold small">김지수</p>
                  <p className="mb-0 text-muted x-small">TechCorp PM</p>
                </div>
              </div>
            </div>
          </Col>

          {/* 오른쪽 가입 폼 섹션 */}
          <Col md={7} className="d-flex flex-column justify-content-center p-5 bg-white">
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
              <h2 className="fw-bold mb-4">계정 만들기</h2>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">이름 (닉네임)</Form.Label>
                  <Form.Control
                      name="nickname"
                      type="text"
                      placeholder="예: 홍길동"
                      onChange={handleChange}
                      required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">이메일</Form.Label>
                  <Form.Control
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      onChange={handleChange}
                      required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold">비밀번호</Form.Label>
                  <Form.Control
                      name="password"
                      type="password"
                      placeholder="최소 8자 이상"
                      onChange={handleChange}
                      required
                  />
                </Form.Group>

                <Form.Check className="mb-4 small">
                  <Form.Check.Input
                      type="checkbox"
                      name="agreed"
                      onChange={handleChange}
                      required
                  />
                  <Form.Check.Label>이용약관 및 개인정보 처리방침에 동의합니다.</Form.Check.Label>
                </Form.Check>

                <Button variant="primary" className="w-100 py-2 fw-bold" type="submit">
                  회원가입 완료
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
  );
};

export default Signup;