import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

const EmailVerification = ({ email, isSent, verified, timer, onEmailChange, onCodeChange, onRequestCode, onVerifyCode, formatTime }) => {
    return (
        <>
            <Form.Group className="row mb-2">
                <Form.Label className="col-sm-3 col-form-label small fw-semibold">이메일</Form.Label>
                <div className="col-sm-9">
                    <InputGroup>
                        <Form.Control name="email" type="email" value={email} placeholder="로그인 시 ID로 사용됩니다." onChange={onEmailChange} required disabled={verified} />
                        <Button onClick={onRequestCode} disabled={verified}>
                            {isSent ? '재발송' : '코드 보내기'}
                        </Button>
                    </InputGroup>
                </div>
            </Form.Group>

            <Form.Group className="row mb-2">
                <Form.Label className="col-sm-3 col-form-label small fw-semibold">인증 코드</Form.Label>
                <div className="col-sm-9">
                    <InputGroup>
                        <Form.Control disabled={!isSent || verified} type="text" onChange={onCodeChange} placeholder="6자리 코드 입력" />
                        <Button disabled={!isSent || verified} onClick={onVerifyCode}>확인</Button>
                    </InputGroup>
                    {isSent && !verified && (
                        <p className="text-danger small mt-1">남은 시간: {formatTime(timer)}</p>
                    )}
                    {verified && <p className="text-success small mt-1">인증이 완료되었습니다.</p>}
                </div>
            </Form.Group>
        </>
    );
};

export default EmailVerification;