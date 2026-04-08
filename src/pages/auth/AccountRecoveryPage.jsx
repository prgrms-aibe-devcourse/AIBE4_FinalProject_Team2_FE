import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Nav, TabContent, TabPane } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';

const AccountRecoveryPage = () => {
    const [activeTab, setActiveTab] = useState('email'); // 'email' or 'password'
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [foundEmail, setFoundEmail] = useState('');

    // 이메일 찾기 핸들러
    const handleFindEmail = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get(`/auth/find/email?nickname=${nickname}`);
            setFoundEmail(response.data);
        } catch (error) {
            alert(error.response?.data?.message || "일치하는 정보를 찾을 수 없습니다.");
        }
    };

    // 비밀번호 재설정(임시비번) 핸들러
    const handleFindPassword = async (e) => {
        e.preventDefault();
        try {
           await api.get(`/auth/find/password?email=${email}`);
            alert("입력하신 이메일로 임시 비밀번호가 발송되었습니다.");
        } catch (error) {
            alert(error.response?.data?.message || "오류가 발생했습니다.");
        }
    };

    return (
        <Container fluid className="vh-100 p-0 overflow-hidden" style={{ backgroundColor: '#F8F9FA' }}>
            <Row className="g-0 h-100 justify-content-center align-items-center">
                <Col md={5} lg={4} className="bg-white p-5 rounded-4 shadow-sm" style={{ border: '1px solid #DEE2E6' }}>
                    <div className="text-center mb-4">
                        <h2 className="fw-bold" style={{ color: '#212529' }}>계정 찾기</h2>
                        <p style={{ color: '#6C757D', fontSize: '14px' }}>SyncTalk 가입 정보를 입력해주세요.</p>
                    </div>

                    {/* 커스텀 탭 스타일 */}
                    <div className="d-flex mb-4" style={{ borderBottom: '2px solid #DEE2E6' }}>
                        <button
                            className={`flex-fill py-2 btn ${activeTab === 'email' ? 'fw-bold' : ''}`}
                            style={{
                                color: activeTab === 'email' ? '#1976D2' : '#6C757D',
                                borderBottom: activeTab === 'email' ? '2px solid #1976D2' : 'none',
                                borderRadius: 0
                            }}
                            onClick={() => setActiveTab('email')}
                        >이메일 찾기</button>
                        <button
                            className={`flex-fill py-2 btn ${activeTab === 'password' ? 'fw-bold' : ''}`}
                            style={{
                                color: activeTab === 'password' ? '#1976D2' : '#6C757D',
                                borderBottom: activeTab === 'password' ? '2px solid #1976D2' : 'none',
                                borderRadius: 0
                            }}
                            onClick={() => setActiveTab('password')}
                        >비밀번호 찾기</button>
                    </div>

                    {activeTab === 'email' ? (
                        <Form onSubmit={handleFindEmail}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold" style={{ color: '#212529' }}>닉네임</Form.Label>
                                <Form.Control
                                    type="text" placeholder="가입 시 등록한 닉네임"
                                    value={nickname} onChange={(e) => setNickname(e.target.value)}
                                    style={{ borderColor: '#DEE2E6', padding: '12px' }}
                                />
                            </Form.Group>
                            <Button type="submit" className="w-100 border-0 mb-3" style={{ backgroundColor: '#1976D2', padding: '12px' }}>이메일 찾기</Button>

                            {foundEmail && (
                                <div className="p-3 text-center rounded-3 mb-3" style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}>
                                    가입된 이메일: <strong>{foundEmail}</strong>
                                </div>
                            )}
                        </Form>
                    ) : (
                        <Form onSubmit={handleFindPassword}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold" style={{ color: '#212529' }}>이메일</Form.Label>
                                <Form.Control
                                    type="email" placeholder="가입한 이메일 주소"
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    style={{ borderColor: '#DEE2E6', padding: '12px' }}
                                />
                            </Form.Group>
                            <Button type="submit" className="w-100 border-0 mb-3" style={{ backgroundColor: '#1976D2', padding: '12px' }}>임시 비밀번호 발송</Button>
                        </Form>
                    )}

                    <div className="text-center mt-4 small">
                        <Link to="/login" style={{ color: '#6C757D', textDecoration: 'none' }}>로그인 화면으로 돌아가기</Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AccountRecoveryPage;