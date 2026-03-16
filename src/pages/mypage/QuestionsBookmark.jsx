import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './QuestionBookmark.css';

// 💡 [수정 1] USE_MOCK 변수를 아예 바깥으로 뺐습니다. (의존성 경고 해결)
const USE_MOCK = true;

const QuestionBookmark = () => {
    const navigate = useNavigate();

    const [bookmarks, setBookmarks] = useState([]);
    const [activeCategory, setActiveCategory] = useState('전체');
    const [isLoading, setIsLoading] = useState(false);

    const categories = ['전체', '직무 역량', '인성/태도', '기술 면접', '창의성'];

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                if (USE_MOCK) {
                    const mockData = [
                        {
                            questionId: 1,
                            sessionId: 101,
                            category: "직무 역량",
                            title: "본인의 강점과 약점에 대해 설명해주세요.",
                            myAnswer: `"저의 강점은 철저한 분석을 통한 문제 해결 능력입니다. 이전 프로젝트에서 발생한 서버 과부하 원인을 데이터 로그 분석을 통해 파악하여 해결한 경험이 있습니다. 반면 약점은 한 가지 문제에 너무 몰입하는 경향이 있다는 점인데, 이를 보완하기 위해 업무 타임라인을 정해두고 규칙적인 피드백 세션을 갖고 있습니다."`,
                            feedbackType: "ai",
                            feedbackText: "답변의 구조가 매우 논리적입니다. STAR 기법을 활용하여 구체적인 수치나 결과를 함께 언급했다면 더 완벽했을 것입니다. 약점을 보완하려는 구체적인 실천 방안(타임라인 설정)이 신뢰감을 줍니다.",
                            tags: [
                                { label: "전달력 우수", color: "blue" },
                                { label: "논리성 높음", color: "dark" }
                            ],
                            isAnswered: true
                        },
                        {
                            questionId: 2,
                            sessionId: 102,
                            category: "인성/태도",
                            title: "협업 중 갈등이 발생했을 때 어떻게 대처하시나요?",
                            myAnswer: `"먼저 감정적인 대응을 지양하고 상대방의 입장을 경청합니다. 의견 차이가 발생하는 근본적인 원인이 목표의 차이인지, 방식의 차이인지 분석합니다. 그 후 데이터와 객관적인 기준을 바탕으로 팀의 이익을 최우선으로 하는 합의점을 도출합니다."`,
                            feedbackType: "ai",
                            feedbackText: "갈등 관리 프로세스가 체계적으로 정립되어 있음이 잘 드러납니다. 다만, 실제 겪었던 갈등 사례를 하나 예로 들어 답변을 구성했다면 훨씬 설득력이 있었을 것입니다. '데이터'를 강조한 점은 직무에 따라 큰 강점이 될 수 있습니다.",
                            tags: [],
                            isAnswered: true
                        },
                        {
                            questionId: 3,
                            sessionId: null,
                            category: "기술 면접",
                            title: "React의 Virtual DOM 작동 방식에 대해 설명해주세요.",
                            myAnswer: null,
                            feedbackType: "tip",
                            feedbackText: "Virtual DOM이 실제 DOM과의 차이점을 계산(Diffing)하고 효율적으로 업데이트하는 과정(Reconciliation)을 중심으로 설명해 보세요. 성능 최적화 측면에서의 이점을 강조하는 것이 좋습니다.",
                            tags: [],
                            isAnswered: false
                        }
                    ];
                    setBookmarks(mockData);
                } else {
                    const response = await api.get('/mypage/bookmarks');
                    setBookmarks(response.data?.data?.content || []);
                }
            } catch (error) {
                console.error('데이터 조회 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // 💡 [수정 2] void를 붙여서 프로미스 무시 경고 해결!
        void fetchData();
    }, []);

    const handleToggleBookmark = (questionId) => {
        if (USE_MOCK) {
            setBookmarks(prev => prev.filter(b => b.questionId !== questionId));
        } else {
            // 실제 API 연동 로직
            console.log("API 호출: 북마크 해제", questionId);
        }
        // 💡 [수정 3] 불필요한 return; 코드를 삭제했습니다.
    };

    const handleViewReport = (sessionId) => {
        if (!sessionId) {
            alert("원본 면접 기록이 존재하지 않는 질문입니다.");
            return;
        }
        navigate(`/mypage/interviews/${sessionId}`);
    };

    // 💡 [수정 4] 사용하지 않는 getCategoryColor 함수는 완전히 삭제했습니다!

    return (
        <div className="bookmark-page-wrapper w-100 pb-5">
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>

                <header className="mb-4 border-bottom pb-4">
                    <h2 className="fw-bold mb-2" style={{ color: '#212529' }}>저장된 면접 질문 모음</h2>
                    <p className="text-muted mb-4" style={{ color: '#6C757D' }}>북마크한 핵심 질문들과 AI가 분석한 피드백을 한눈에 확인하세요.</p>

                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                        <div className="d-flex gap-2 overflow-auto">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="d-flex gap-2">
                            <button className="btn fw-bold px-3 btn-filter">
                                ≡ 필터링
                            </button>
                            <button className="btn fw-bold px-4 btn-new-interview" onClick={() => navigate('/interview')}>
                                + 새 면접 시작
                            </button>
                        </div>
                    </div>
                </header>

                {isLoading ? (
                    <div className="text-center p-5 text-muted">데이터를 불러오는 중입니다...</div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {bookmarks.map((item, idx) => (
                            <div key={item.questionId} className="question-report-card shadow-sm">

                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="fw-bold small" style={{ color: '#1976D2' }}>
                                        {item.category}
                                    </span>
                                    <button
                                        className="btn-bookmark border-0 bg-transparent p-0"
                                        onClick={() => handleToggleBookmark(item.questionId)}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1976D2" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 5C5 3.89543 5.89543 3 7 3H17C18.1046 3 19 3.89543 19 5V21L12 17.5L5 21V5Z" />
                                        </svg>
                                    </button>
                                </div>

                                <h4 className="fw-bold mb-4 text-dark">
                                    {idx + 1}. {item.title}
                                </h4>

                                <div className="answer-section mb-3">
                                    <span className="section-label">나의 답변</span>
                                    {item.isAnswered ? (
                                        <p className="answer-text mb-0">{item.myAnswer}</p>
                                    ) : (
                                        <p className="answer-text text-muted fst-italic mb-0">(작성된 답변이 없습니다. 연습을 시작해보세요.)</p>
                                    )}
                                </div>

                                <div className={`feedback-section ${item.feedbackType === 'ai' ? 'bg-ai' : 'bg-tip'}`}>
                                    <h6 className="fw-bold mb-2" style={{ color: item.feedbackType === 'ai' ? '#1976D2' : '#212529' }}>
                                        {item.feedbackType === 'ai' ? '🤖 AI 피드백' : '💡 모범 답변 팁'}
                                    </h6>
                                    <p className="feedback-text mb-0">{item.feedbackText}</p>

                                    {item.tags && item.tags.length > 0 && (
                                        <div className="d-flex gap-3 mt-3">
                                            {item.tags.map((tag, i) => (
                                                <span key={i} className="feedback-tag">
                                                    <span className={`dot ${tag.color}`}></span>
                                                    {tag.label}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="text-end mt-4 pt-3 border-top" style={{ borderColor: '#DEE2E6' }}>
                                    <button
                                        className="btn btn-link detail-link text-decoration-none small fw-bold p-0"
                                        onClick={() => handleViewReport(item.sessionId)}
                                    >
                                        {item.sessionId ? '면접 리포트 보기 →' : '답변 작성하러 가기 →'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-5">
                    <button className="btn btn-more border rounded-pill px-4 py-2 fw-bold shadow-sm">
                        더 많은 질문 불러오기
                    </button>
                </div>

            </div>
        </div>
    );
};

export default QuestionBookmark;