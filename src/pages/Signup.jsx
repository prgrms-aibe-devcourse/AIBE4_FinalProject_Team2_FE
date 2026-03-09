import { useState, useEffect } from 'react';
import api from '../api/axios'; // 기존에 만든 axios 설정 파일
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  
  // 1. 상태 관리 (입력값 및 상태)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  });

  const [isEmailSent, setIsEmailSent] = useState(false); // 인증번호 발송 여부
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 인증 완료 여부
  const [timer, setTimer] = useState(300); // 5분 타이머 (초 단위)

  // 2. 타이머 로직
  useEffect(() => {
    let interval;
    if (isEmailSent && timer > 0 && !isEmailVerified) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isEmailSent, timer, isEmailVerified]);

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = time % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // 3. 핸들러 함수들
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 이메일 인증번호 요청
  const handleEmailRequest = async () => {
    try {
      await api.post(`/auth/email/request?email=${formData.email}`);
      setIsEmailSent(true);
      setTimer(300);
      alert("인증번호가 발송되었습니다.");
    } catch (error) {
      alert(error.response?.data || "메일 발송에 실패했습니다.");
    }
  };

  // 이메일 인증번호 확인
  const handleEmailVerify = async () => {
    try {
      await api.post(`/auth/email/verify?email=${formData.email}&code=${formData.verificationCode}`);
      setIsEmailVerified(true);
      alert("이메일 인증에 성공했습니다.");
    } catch (error) {
      alert("인증번호가 틀렸거나 만료되었습니다.");
    }
  };

  // 최종 회원가입 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmailVerified) return alert("이메일 인증을 완료해주세요.");
    if (formData.password !== formData.confirmPassword) return alert("비밀번호가 일치하지 않습니다.");

    try {
      await api.post('/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      alert("회원가입이 완료되었습니다!");
      navigate('/login');
    } catch (error) {
      alert(error.response?.data || "회원가입 실패");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        {/* 아이디 */}
        <input name="username" placeholder="아이디" onChange={handleChange} required />
        
        {/* 이메일 및 인증 */}
        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
          <input name="email" type="email" placeholder="이메일" onChange={handleChange} disabled={isEmailVerified} required />
          <button type="button" onClick={handleEmailRequest} disabled={isEmailVerified}>
            {isEmailSent ? '재전송' : '인증요청'}
          </button>
        </div>

        {isEmailSent && !isEmailVerified && (
          <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
            <input name="verificationCode" placeholder="인증번호 6자리" onChange={handleChange} required />
            <button type="button" onClick={handleEmailVerify}>확인</button>
            <span style={{ color: 'red' }}>{formatTime(timer)}</span>
          </div>
        )}

        {isEmailVerified && <p style={{ color: 'blue', fontSize: '12px' }}>✓ 이메일 인증 완료</p>}

        {/* 비밀번호 */}
        <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} style={{ marginTop: '10px', width: '100%' }} required />
        <input name="confirmPassword" type="password" placeholder="비밀번호 확인" onChange={handleChange} style={{ marginTop: '10px', width: '100%' }} required />
        
        {formData.password !== formData.confirmPassword && formData.confirmPassword && (
          <p style={{ color: 'red', fontSize: '12px' }}>비밀번호가 일치하지 않습니다.</p>
        )}

        <button type="submit" style={{ marginTop: '20px', width: '100%', height: '40px' }} disabled={!isEmailVerified}>
          가입하기
        </button>
      </form>
    </div>
  );
}

export default Signup;