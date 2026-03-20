import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Envelope, Lock } from 'react-bootstrap-icons';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const LoginForm = ({ onLogin, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Form onSubmit={onLogin}>
            <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-dark">이메일</Form.Label>
                <InputGroup className="bg-white rounded border">
                    <InputGroup.Text className="bg-white border-0">
                        <Envelope className="text-muted" size={18} />
                    </InputGroup.Text>
                    <Form.Control name="email" type="email" placeholder="name@company.com" className="border-0" onChange={onChange} required />
                </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold text-dark">비밀번호</Form.Label>
                <InputGroup className="bg-white rounded border">
                    <InputGroup.Text className="bg-white border-0">
                        <Lock className="text-muted" size={18} />
                    </InputGroup.Text>
                    <Form.Control
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="비밀번호를 입력하세요"
                        className="border-0"
                        onChange={onChange}
                        required
                    />
                    <InputGroup.Text className="bg-white border-0">
                        <button
                            type="button"
                            style={{ background: 'none', border: 'none' }}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                    </InputGroup.Text>
                </InputGroup>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-4 w-100 py-2 fw-bold mb-4 shadow-sm">
                로그인하기
            </Button>
        </Form>
    );
};

export default LoginForm;