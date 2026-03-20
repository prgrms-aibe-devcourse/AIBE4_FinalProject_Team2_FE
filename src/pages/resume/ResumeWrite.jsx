import { Container, Card, Form, Button, Badge } from 'react-bootstrap';

const Correction = () => {
    return (
        <Container className="py-5" style={{ maxWidth: '850px' }}>
            <div className="text-center mb-5">
                <h2 className="fw-bold">AI 자소서 첨삭</h2>
                <p className="text-muted small">지원하려는 직무 공고와 작성 중인 자기소개서를 입력해주세요.</p>
            </div>

            <Card className="shadow-sm border-0 rounded-4 mb-4 p-4">
                <div className="d-flex justify-content-between mb-3">
                    <h6 className="fw-bold m-0">💼 채용 공고 (선택 사항)</h6>
                    <Button variant="link" className="text-decoration-none p-0 small text-primary">공고 불러오기</Button>
                </div>
                <Form.Control as="textarea" rows={4} className="bg-light border-0" placeholder="직무 설명(JD)이나 주요 자격 요건을 입력하세요." />
            </Card>

            <Card className="shadow-sm border-0 rounded-4 p-4">
                <div className="d-flex justify-content-between mb-3">
                    <h6 className="fw-bold m-0">📄 자기소개서 본문</h6>
                    <span className="text-muted small">0자 / 2,000자</span>
                </div>
                <div className="border rounded-3 p-3 bg-light">
                    <div className="d-flex gap-3 mb-2 border-bottom pb-2 text-muted">
                        <span className="fw-bold">B</span> <i>I</i> <u>U</u> <span className="ms-2">≡</span>
                    </div>
                    <Form.Control as="textarea" rows={12} className="bg-transparent border-0 p-0" placeholder="내용을 이곳에 입력해주세요." />
                </div>
                <div className="d-flex justify-content-between mt-4">
                    <small className="text-success fw-bold">✓ 최종 저장: 방금 전</small>
                    <div className="d-flex gap-2">
                        <Button variant="outline-secondary">임시 저장</Button>
                        <Button variant="primary" className="px-4">✨ AI 첨삭 받기</Button>
                    </div>
                </div>
            </Card>
        </Container>
    );
};

export default Correction;