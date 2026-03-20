import React from 'react';
import { Col } from 'react-bootstrap';

const LoginSidebar = () => {
    return (
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
    );
};

export default LoginSidebar;