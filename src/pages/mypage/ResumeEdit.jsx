import React, { useState } from 'react'; // 💡 useEffect 제거됨
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import './ResumeEdit.css';

const ResumeEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 💡 에디터 제목 상태 관리
    const [title, setTitle] = useState("마케팅 매니저 지원서_AI 첨삭본");

    // 💡 에디터 내용 초기값 세팅 (useEffect 대신 직접 입력)
    const [content, setContent] = useState(`혁신적인 협업 문화와 기술적 가치에 깊이 공감하며, 커뮤니케이션 시장의 패러다임을 바꾸는 여정에 마케팅 매니저로서 기여하고 싶습니다. 지난 5년간 IT 스타트업에서 B2B 마케팅을 담당하며 200% 이상의 리드 성장을 이끌어낸 경험이 있습니다. 특히 복잡한 기술적 개념을 대중이 이해하기 쉬운 언어로 번역하여 브랜드 인지도를 높이는 데 탁월한 능력을 보유하고 있습니다.

[프로젝트 관리 및 성과]
프로젝트 관리 도구인 'SyncFlow'의 마케팅 전략을 수립하고 진행하며 사용자 10만 명을 유치했습니다. 데이터 기반의 의사결정 프로세스를 구축하여 캠페인 효율을 극대화했으며, 글로벌 시장 확장을 위해 영어권 국가 타겟팅 광고 캠페인을 성공적으로 런칭한 경험이 있습니다.`);

    // 💡 AI 피드백 데이터 초기값 세팅 (useEffect 대신 직접 입력)
    // 💡 setFeedbackList를 지우고 feedbackList만 남깁니다!
    const [feedbackList] = useState([
        { id: 1, type: 'professional', title: '"협업 문화" 표현 수정', desc: '단순히 "공감한다"는 표현보다 본인이 기여할 수 있는 구체적인 가치를 연결하세요.' },
        { id: 2, type: 'grammar', title: '불필요한 미사여구 축소', desc: '"정교한 결합을 통해"와 같은 표현은 간결하게 "결합하여"로 수정하는 것이 흐름상 좋습니다.' },
        { id: 3, type: 'clarity', title: '술어 활용 구체화', desc: '구축한 자동화 알림 봇이 어떤 비즈니스 임팩트를 주었는지 1문장 추가해보세요.' }
    ]);

    // 내용이 변경될 때마다 실행 (글자 수 계산용)
    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleSave = () => {
        alert("성공적으로 저장되었습니다!");
        // 여기서 백엔드로 PUT/PATCH 요청을 보냅니다.
        navigate(`/mypage/resumes/${id}`); // 저장 후 다시 리포트 화면으로 이동
    };

    // 글자 수 및 단어 수 계산
    const textLength = content.length;
    const wordCount = content.trim() === "" ? 0 : content.trim().split(/\s+/).length;

    return (
        <div className="resume-editor-wrapper" style={{ backgroundColor: '#f5f7fa', minHeight: '100vh', paddingBottom: '50px' }}>

            {/* 상단 툴바 (고정) */}
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
                    <Badge bg="primary-subtle" text="primary" className="px-2 py-1">수정 중</Badge>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-secondary" className="fw-bold px-4 rounded-pill bg-white">
                        임시 저장
                    </Button>
                    <Button variant="primary" className="fw-bold px-4 rounded-pill" onClick={handleSave}>
                        💾 변경사항 저장
                    </Button>
                </div>
            </div>

            <Container className="pt-4">
                <Row className="g-4">

                    {/* 좌측: AI 가이드라인 / 피드백 패널 */}
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

                    {/* 우측: 실제 텍스트 에디터 영역 */}
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden d-flex flex-column">

                            {/* 에디터 툴바 (모양만 구현) */}
                            <div className="formatting-toolbar bg-light px-4 py-2 border-bottom d-flex gap-2">
                                <Button variant="white" className="border-0 text-dark fw-bold px-3">B</Button>
                                <Button variant="white" className="border-0 text-dark fst-italic px-3">I</Button>
                                <Button variant="white" className="border-0 text-dark text-decoration-underline px-3">U</Button>
                                <div className="vr mx-1"></div>
                                <Button variant="white" className="border-0 text-dark px-3">≡</Button>
                                <Button variant="white" className="border-0 text-dark px-3">•</Button>
                            </div>

                            {/* 텍스트 입력 영역 */}
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

                            {/* 하단 글자 수 상태바 */}
                            <div className="editor-statusbar bg-white border-top px-4 py-3 d-flex justify-content-between align-items-center">
                                <div className="text-muted small fw-bold">
                                    <span className="me-3">단어 수: {wordCount}</span>
                                    <span>글자 수(공백 포함): {textLength}자</span>
                                </div>
                                <Button variant="light" className="text-muted small fw-bold px-3 rounded-pill border">
                                    ✨ AI 다시 돌리기
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ResumeEdit;