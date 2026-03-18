import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form, Spinner } from 'react-bootstrap';
import './ResumeEdit.css';
import api from '../../api/axios';

const USE_MOCK = false;

const ResumeEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [feedbackList, setFeedbackList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 💡 [변경 부분 1] 데이터 불러오기 로직 (GET 요청)
    useEffect(() => {
        const fetchResumeData = async () => {
            setIsLoading(true);

            try {
                if (USE_MOCK) { // 💡 상수를 바로 사용
                    setTimeout(() => {
                        setTitle("[Mock] 마케팅 매니저 지원서_AI 첨삭본");
                        setContent("혁신적인 협업 문화와 기술적 가치에 깊이 공감하며...");
                        setFeedbackList([
                            { id: 1, type: 'professional', title: '"협업 문화" 표현 수정', desc: '단순히 "공감한다"는 표현보다 본인이 기여할 수 있는 구체적인 가치를 연결하세요.' }
                        ]);
                        setIsLoading(false);
                    }, 500);
                } else {
                    // [실제 API 연동 모드]
                    const response = await api.get(`/api/v1/resumes/${id}`);
                    const result = response.data;

                    if (result.success) {
                        setTitle(result.data.title);
                        setContent(result.data.content);
                    }
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("데이터 로드 실패:", error);
                alert("데이터를 불러오는데 실패했습니다.");
                setIsLoading(false);
            }
        };

        fetchResumeData();
    }, [id]); // 💡 의존성 배열에서도 제거 (상수는 변하지 않으므로)

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleSave = async () => {
        if (USE_MOCK) { // 💡 상수를 바로 사용
            alert("[Mock] 성공적으로 저장되었습니다!");
            navigate(`/mypage/resumes/${id}`);
            return;
        }

        try {
            await api.patch(`/api/v1/resumes/${id}`, {
                title: title,
                content: content
            });

            alert("성공적으로 저장되었습니다!");
            navigate(`/mypage/resumes/${id}`);
        } catch (error) {
            console.error("저장 중 오류:", error);
            alert("저장에 실패했습니다.");
        }
    };

    const textLength = content.length;
    const wordCount = content.trim() === "" ? 0 : content.trim().split(/\s+/).length;

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f5f7fa' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="resume-editor-wrapper" style={{ backgroundColor: '#f5f7fa', minHeight: '100vh', paddingBottom: '50px' }}>
            {/* 상단 툴바 */}
            <div className="editor-topbar bg-white border-bottom sticky-top px-4 py-3 d-flex justify-content-between align-items-center shadow-sm">
                <div className="d-flex align-items-center gap-3">
                    <Button variant="light" className="rounded-circle d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px' }} onClick={() => navigate(-1)}>
                        ←
                    </Button>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="fw-bold border-0 bg-light fs-5 title-input"
                        style={{ width: '350px' }}
                    />
                    {/* 💡 배지 내용도 상수에 따라 바뀌도록 심플하게 유지 */}
                    <Badge bg={USE_MOCK ? "warning" : "primary-subtle"} text={USE_MOCK ? "dark" : "primary"} className="px-2 py-1">
                        {USE_MOCK ? "Mock 테스트 중" : "실제 연동 중"}
                    </Badge>
                </div>

                <div className="d-flex align-items-center gap-3">
                    {/* 💡 복잡한 스위치 UI 코드 삭제됨! */}
                    <Button variant="outline-secondary" className="fw-bold px-4 rounded-pill bg-white">
                        임시 저장
                    </Button>
                    <Button variant="primary" className="fw-bold px-4 rounded-pill" onClick={handleSave}>
                        💾 변경사항 저장
                    </Button>
                </div>
            </div>

            <Container className="pt-4">
                {/* ... (하단 레이아웃 코드는 기존과 100% 동일하므로 생략 없이 그대로 쓰시면 됩니다!) ... */}
                <Row className="g-4">
                    <Col lg={4}>
                        <div className="sticky-top" style={{ top: '90px' }}>
                            <Card className="border-0 shadow-sm rounded-4 p-4">
                                <h6 className="fw-bold mb-3 text-primary">💡 AI 개선 가이드</h6>
                                <p className="text-muted small mb-4">우측 에디터에서 아래 제안 사항들을 반영하여 자소서를 다듬어보세요.</p>
                                <div className="d-flex flex-column gap-3">
                                    {feedbackList.map((sg) => (
                                        <div key={sg.id} className={`suggestion-item p-3 rounded-3 ${sg.type}`}>
                                            <p className="fw-bold mb-1 small">{sg.title}</p>
                                            <p className="text-muted xs-small mb-0">{sg.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden d-flex flex-column">
                            <div className="p-0 flex-grow-1">
                                <Form.Control
                                    as="textarea"
                                    className="editor-textarea border-0 p-5 h-100"
                                    value={content}
                                    onChange={handleContentChange}
                                    placeholder="자기소개서 내용을 입력해주세요."
                                    style={{ minHeight: '600px', resize: 'none' }}
                                />
                            </div>
                            <div className="editor-statusbar bg-white border-top px-4 py-3 d-flex justify-content-between align-items-center">
                                <div className="text-muted small fw-bold">
                                    <span className="me-3">단어 수: {wordCount}</span>
                                    <span>글자 수(공백 포함): {textLength}자</span>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ResumeEdit;