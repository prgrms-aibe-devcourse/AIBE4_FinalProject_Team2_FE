import { Row, Col, Card, Nav, Button, Container } from 'react-bootstrap';

const Dashboard = () => {
    return (
        <Container fluid className="p-0 d-flex">
            {/* Sidebar - image_ea6446의 왼쪽 메뉴 */}
            <div className="bg-white border-end p-4 vh-100 d-none d-md-block" style={{ width: '260px' }}>
                <h5 className="fw-bold text-primary mb-5">SyncTalk</h5>
                <Nav className="flex-column gap-3">
                    <Nav.Link className="text-muted small">대시보드</Nav.Link>
                    <Nav.Link className="active bg-primary bg-opacity-10 text-primary rounded-3 small">내 자소서/이력서</Nav.Link>
                    <Nav.Link className="text-muted small">면접 결과</Nav.Link>
                    <Nav.Link className="text-muted small">프로필 설정</Nav.Link>
                </Nav>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 p-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h3 className="fw-bold m-0">내 자소서/이력서 📄</h3>
                    <Button variant="primary" className="rounded-pill px-4">+ 새 문서 작성</Button>
                </div>

                <Row className="g-4">
                    {['Software_Engineer_Resume', 'Frontend_Dev_Portfolio', 'Marketing_Manager'].map((title, i) => (
                        <Col xl={4} md={6} key={i}>
                            <Card className="border-0 shadow-sm rounded-4 h-100 p-3">
                                <div className="bg-light rounded-3 text-center py-5 mb-3 position-relative">
                                    <span className="badge bg-white text-muted border position-absolute top-0 end-0 m-2">PDF</span>
                                    <div className="display-6 text-secondary opacity-25">📄</div>
                                </div>
                                <Card.Title className="fw-bold small mb-1">{title}</Card.Title>
                                <Card.Text className="text-muted x-small">Last Updated: 2023. 10. 20</Card.Text>
                                <hr className="my-2 opacity-10" />
                                <div className="d-flex justify-content-between">
                                    <Button variant="link" className="text-decoration-none text-muted small p-0">Download</Button>
                                    <Button variant="link" className="text-decoration-none text-muted small p-0">Edit</Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                    <Col xl={4} md={6}>
                        <Card className="border-dashed h-100 d-flex flex-column justify-content-center align-items-center py-5 bg-transparent" style={{ border: '2px dashed #dee2e6' }}>
                            <div className="fs-1 text-muted opacity-50">+</div>
                            <p className="text-muted small">Upload New Resume</p>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Container>
    );
};

export default Dashboard;