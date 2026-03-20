import React from 'react';
import { Col } from 'react-bootstrap';

const SignupSidebar = () => {
    return (
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
    );
};

export default SignupSidebar;