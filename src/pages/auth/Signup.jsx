import React, { useState, useEffect } from 'react';
import {Container, Row, Col, Form, Button, InputGroup} from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { EyeSlash } from 'react-bootstrap-icons'; // 아이콘 패키지 설치 필요
import axios from '../../api/axios.js';

const Signup = () => {
  const navigate = useNavigate();

  // 비밀번호 확인
  const [passwordCheck, setPasswordCheck] = useState('');

  // 인증 코드
  const [code, setCode] = useState('');

  // 인증 코드 발송 여부
  const [isSent, setIsSent] = useState(false);

  // 인증 성공 여부
  const [verified, setVerified] = useState(false);

  // 인증 제한 시간
  const [timer, setTimer] = useState(600); // 10분 (600초)

  // 타이머 로직
  useEffect(() => {
    let interval;
    if (isSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && !verified) {
      clearInterval(interval);
      alert('인증 시간이 만료되었습니다. 다시 시도해주세요.');
    }
    return () => clearInterval(interval);
  }, [isSent, timer]);

  // 초를 분:초 형식으로 변환
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

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

    // 약관 동의 확인
    if (!formData.agreed) {
      alert("이용약관에 동의해주세요.");
      return;
    }

    // 비밀번호 일치 확인
    if (passwordCheck !== formData.password) {
      alert("비밀번호가 일치하지 않습니다.")
      return;
    }

    // 이메일 인증 여부 확인
    if (!verified) {
      alert("이메일 인증이 되지 않았습니다.")
      return;
    }

    try {
      // 작성하신 백엔드 API 주소로 데이터 전송
      const response = await axios.post('/auth/signup', {
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

  // 1. 인증번호 요청
  const handleRequestCode = async () => {
    if (formData.email == null || formData.email === '') {
      alert("이메일을 입력해주세요.")
      return;
    }

    try {
      const response = await axios.post('/auth/email/request', { email: formData.email });
      setIsSent(true);
      setTimer(600); // 타이머 리셋
      alert(response.data);
    } catch (error) {
      setIsSent(false);
      alert(error.response?.data || error.message);
    }
  };

  // 2. 인증번호 확인
  const handleVerifyCode = async () => {
    if (code == null || code === '') {
      alert("인증 코드를 입력해주세요.")
      return;
    }
    try {
      const response = await axios.post('/auth/email/verify', { email: formData.email, code: code });
      if (response.data.success) {
        setVerified(true);
        setIsSent(false)
        setTimer(0)
        alert(response.data.message);
      }
    } catch (error) {
      setIsSent(false)
      alert(error.response?.data?.message || '인증에 실패했습니다.');
    }
  };

  // return (
  //     <Container fluid className="vh-100 p-0">
  //       <Row className="h-100 g-0">
  //         {/* 왼쪽 홍보 섹션 (생략 가능, 이전 코드와 동일) */}
  //         <Col md={5} className="bg-light d-none d-md-flex flex-column justify-content-center p-5 position-relative">
  //           <div className="mb-5 px-4">
  //             <h5 className="text-primary fw-bold">SyncTalk</h5>
  //             <h1 className="display-5 fw-bold mt-5">AI와 함께 면접 스킬을 마스터하세요.</h1>
  //             <p className="text-muted mt-4">맞춤형 자기소개서와 실전 같은 모의 면접으로 꿈의 직장에 합격한 10,000명 이상의 지원자들과 함께하세요.</p>
  //           </div>
  //           <div className="card shadow-sm border-0 p-4 mx-4 mt-5 bg-white rounded-4">
  //             <p className="small text-warning">★★★★★</p>
  //             <p className="small">"SyncTalk 덕분에 PM 직무 면접 답변을 완벽하게 다듬을 수 있었어요. 면접장에 들어갈 때 자신감이 훨씬 넘쳤습니다."</p>
  //             <div className="d-flex align-items-center mt-3">
  //               <div className="bg-secondary rounded-circle me-3" style={{width: '40px', height: '40px'}}></div>
  //               <div>
  //                 <p className="mb-0 fw-bold small">김지수</p>
  //                 <p className="mb-0 text-muted x-small">TechCorp PM</p>
  //               </div>
  //             </div>
  //           </div>
  //         </Col>
  //
  //         {/* 오른쪽 가입 폼 섹션 */}
  //         <Col md={7} className="d-flex flex-column justify-content-center p-5 bg-white">
  //           <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
  //             <h2 className="fw-bold mb-4">계정 만들기</h2>
  //
  //             <Form onSubmit={handleSubmit}>
  //               <Form.Group className="mb-3">
  //                 <Form.Label className="small fw-bold">이름 (닉네임)</Form.Label>
  //                 <Form.Control
  //                     name="nickname"
  //                     type="text"
  //                     placeholder="예: 홍길동"
  //                     onChange={handleChange}
  //                     required
  //                 />
  //               </Form.Group>
  //
  //               <Form.Group className="mb-3">
  //                 <Form.Label className="small fw-bold">이메일</Form.Label>
  //                 <Form.Control
  //                     name="email"
  //                     type="email"
  //                     placeholder="name@company.com"
  //                     onChange={handleChange}
  //                     required
  //                 />
  //               </Form.Group>
  //
  //               <Form.Group className="mb-4">
  //                 <Form.Label className="small fw-bold">비밀번호</Form.Label>
  //                 <Form.Control
  //                     name="password"
  //                     type="password"
  //                     placeholder="최소 8자 이상"
  //                     onChange={handleChange}
  //                     required
  //                 />
  //               </Form.Group>
  //
  //               <Form.Check className="mb-4 small">
  //                 <Form.Check.Input
  //                     type="checkbox"
  //                     name="agreed"
  //                     onChange={handleChange}
  //                     required
  //                 />
  //                 <Form.Check.Label>이용약관 및 개인정보 처리방침에 동의합니다.</Form.Check.Label>
  //               </Form.Check>
  //
  //               <Button variant="primary" className="w-100 py-2 fw-bold" type="submit">
  //                 회원가입 완료
  //               </Button>
  //             </Form>
  //           </div>
  //         </Col>
  //       </Row>
  //     </Container>
  // );

  return (
      <Container fluid className="vh-100 p-0">
        <Row className="g-0 h-100">
          {/* 왼쪽: 홍보 섹션 */}
          <Col md={5} className="d-none d-md-flex flex-column justify-content-between p-5"
               style={{ backgroundColor: '#E3F2FD', background: 'linear-gradient(135deg, #E3F2FD 0%, #FFFFFF 100%)' }}>
            <div>
              <h4 className="fw-bold text-primary mb-5">SyncTalk</h4>
              <div className="mt-5">
                <h1 className="display-5 fw-bold mb-4">AI와 함께 면접 스킬을<br />마스터하세요.</h1>
                <p className="text-muted fs-5">
                  맞춤형 자기소개서와 실전 같은 모의 면접으로 꿈의<br />
                  직장에 합격한 10,000명 이상의 지원자들과 함께하세요.
                </p>
              </div>
            </div>

            {/* 리뷰 카드 */}
            <div className="bg-white p-4 rounded-4 shadow-sm mb-4" style={{ maxWidth: '400px' }}>
              <div className="text-warning mb-2">★★★★★</div>
              <p className="small text-secondary mb-3">
                "SyncTalk 덕분에 PM 직무 면접 답변을 완벽하게 다듬을 수 있었어요. 면접장에 들어갈 때 자신감이 훨씬 넘쳤습니다."
              </p>
              <div className="d-flex align-items-center">
                <div className="bg-secondary rounded-circle me-2" style={{ width: '40px', height: '40px' }}></div>
                <div>
                  <div className="fw-bold small">김지수</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>TechCorp PM</div>
                </div>
              </div>
            </div>
          </Col>

          {/* 오른쪽: 회원가입 폼 섹션 */}
          <Col md={7} className="bg-light d-flex align-items-center justify-content-center p-5">
            <div style={{ maxWidth: '450px', width: '100%' }}>
              <div className="mb-4">
                <h2 className="fw-bold">계정 만들기</h2>
                <p className="text-muted">꿈의 직장으로 가는 여정을 오늘 시작하세요.</p>
              </div>

              {/*<div className="mb-4">*/}
              {/*    <div className="d-flex justify-content-between small mb-1">*/}
              {/*        <span>1단계 / 2단계</span>*/}
              {/*        <span className="text-muted">계정 정보</span>*/}
              {/*    </div>*/}
              {/*    <ProgressBar now={50} style={{ height: '6px' }} />*/}
              {/*</div>*/}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="row mb-2">
                  <Form.Label className="col-sm-3 col-form-label small fw-semibold">닉네임</Form.Label>
                  <div className="col-sm-9">
                    <Form.Control name="nickname" type="text" placeholder="사용할 별명을 입력하세요." onChange={handleChange} required/>
                  </div>
                </Form.Group>

                <Form.Group className="row mb-2">
                  <Form.Label className="col-sm-3 col-form-label small fw-semibold">이메일</Form.Label>
                  <div className="col-sm-9">
                    <InputGroup>
                      <Form.Control name="email" type="email" placeholder="로그인 시 ID로 사용됩니다." onChange={handleChange} required/>
                      <Button
                          onClick={handleRequestCode}
                          // disabled={isSent && timer > 0}
                      >{isSent ? '재발송' : '코드 보내기'}</Button>
                    </InputGroup>
                  </div>
                </Form.Group>

                <Form.Group className="row mb-2">
                  <Form.Label className="col-sm-3 col-form-label small fw-semibold">인증 코드 입력</Form.Label>
                  <div className="col-sm-9">

                    <InputGroup
                    >
                      <Form.Control
                          disabled={!isSent}
                          type="text"
                          onChange={(e) => setCode(e.target.value)} />
                      <Button disabled={!isSent} onClick={handleVerifyCode} > 확인
                      </Button>
                    </InputGroup>
                    <small>남은 시간: {formatTime(timer)}</small>
                  </div>
                </Form.Group>

                <Form.Group className="row mb-2">
                  <Form.Label className="col-sm-3 col-form-label small fw-semibold">비밀번호</Form.Label>
                  <div className="col-sm-9">
                    <InputGroup>
                      <Form.Control name="password" type="password" placeholder="최소 8자 이상" onChange={handleChange} required/>
                      <InputGroup.Text className="bg-white border-start-0">
                        <EyeSlash className="text-muted" />
                      </InputGroup.Text>
                    </InputGroup>
                  </div>
                </Form.Group>

                <Form.Group className="row mb-2">
                  <Form.Label className="col-sm-3 col-form-label small fw-semibold">비밀번호 확인</Form.Label>
                  <div className="col-sm-9">
                    <InputGroup>
                      <Form.Control type="password" placeholder="입력한 비밀번호와 일치해야 합니다."
                                    onChange={(e) => setPasswordCheck(e.target.value)} required/>
                      <InputGroup.Text className="bg-white border-start-0">
                        <EyeSlash className="text-muted" />
                      </InputGroup.Text>
                    </InputGroup>
                  </div>
                </Form.Group>

                {/*<div className="text-center my-4 position-relative">*/}
                {/*    <hr />*/}
                {/*    <span className="position-absolute top-50 start-50 translate-middle bg-light px-2 text-muted small">커리어 선호도</span>*/}
                {/*</div>*/}

                <Form.Group className="row mb-2">
                  <Form.Label className="col-sm-3 col-form-label small fw-semibold">관심직무</Form.Label>
                  <div className="col-sm-9">
                    <Form.Select className="text-muted">
                      <option>직무를 선택하세요.</option>
                    </Form.Select>
                  </div>
                </Form.Group>

                {/*<div className="mb-4">*/}
                {/*    <Form.Label className="small fw-semibold">희망 산업군</Form.Label>*/}
                {/*    <div className="d-flex gap-2">*/}
                {/*        {['IT/기술', '금융', '헬스케어', '교육'].map((item) => (*/}
                {/*            <Button key={item} variant="outline-secondary" size="sm" className="rounded-pill px-3">*/}
                {/*                {item}*/}
                {/*            </Button>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<Form.Group className="mb-4" controlId="terms">*/}
                {/*    <Form.Check onChange={handleChange} name="agreed" required type="checkbox" label={<span className="small"><span className="text-primary text-decoration-underline">이용약관</span> 및 <span className="text-primary text-decoration-underline">개인정보 처리방침</span>에 동의합니다.</span>} />*/}
                {/*</Form.Group>*/}

                <Form.Check className="mb-4 small">
                  <Form.Check.Input
                      type="checkbox"
                      name="agreed"
                      onChange={handleChange}
                      required
                  />
                  <Form.Check.Label>이용약관 및 개인정보 처리방침에 동의합니다.</Form.Check.Label>
                </Form.Check>

                <Button variant="primary" className="w-100 py-2 mb-4 fw-bold" style={{ backgroundColor: '#1976D2' }} type="submit">
                  회원가입 완료
                </Button>
              </Form>

              {/*<div className="text-center mb-4 position-relative">*/}
              {/*    <hr />*/}
              {/*    <span className="position-absolute top-50 start-50 translate-middle bg-light px-2 text-muted small">또는 소셜 계정으로 시작</span>*/}
              {/*</div>*/}

              {/*<Row className="g-2">*/}
              {/*    <Col>*/}
              {/*        <Button variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-center gap-2">*/}
              {/*            <Google /> Google*/}
              {/*        </Button>*/}
              {/*    </Col>*/}
              {/*    <Col>*/}
              {/*        <Button variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-center gap-2">*/}
              {/*            <Linkedin className="text-info" /> LinkedIn*/}
              {/*        </Button>*/}
              {/*    </Col>*/}
              {/*</Row>*/}

              <div className="text-center mt-4 small">
                이미 계정이 있으신가요? <Link to="/login" className="text-primary fw-bold text-decoration-none">로그인</Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
  );
};

export default Signup;