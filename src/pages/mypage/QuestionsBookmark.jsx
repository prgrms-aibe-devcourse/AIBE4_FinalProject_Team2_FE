import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './QuestionBookmark.css';

const USE_MOCK = true;

const QuestionsBookmark = () => {
    const navigate = useNavigate();

    const [bookmarks, setBookmarks] = useState([]);
    const [activeCategory, setActiveCategory] = useState('전체');
    const [isLoading, setIsLoading] = useState(false);

    // 페이지네이션을 위한 상태
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const categories = ['전체', '직무 역량', '인성/태도', '기술 면접', '창의성'];

    useEffect(() => {
        const fetchData = async () => {
            // 첫 페이지(0)를 불러올 때만 전체 화면 로딩을 켭니다.
            if (page === 0) {
                setIsLoading(true);
            }

            try {
                if (USE_MOCK) {
                    const mockData = [
                        {
                            questionId: 1,
                            sessionId: 101,
                            category: "직무 역량",
                            title: "본인의 강점과 약점에 대해 설명해주세요.",
                            myAnswer: `"저의 강점은 철저한 분석을 통한 문제 해결 능력입니다..."`,
                            feedbackType: "ai",
                            feedbackText: "답변의 구조가 매우 논리적입니다.",
                            tags: [{ label: "전달력 우수", color: "blue" }],
                            isAnswered: true
                        },
                        {
                            questionId: 2,
                            sessionId: 102,
                            category: "인성/태도",
                            title: "협업 중 갈등이 발생했을 때 어떻게 대처하시나요?",
                            myAnswer: `"먼저 감정적인 대응을 지양하고 상대방의 입장을 경청합니다."`,
                            feedbackType: "ai",
                            feedbackText: "갈등 관리 프로세스가 체계적으로 정립되어 있습니다.",
                            tags: [],
                            isAnswered: true
                        }
                    ];
                    setBookmarks(mockData);
                    setTotalPages(1);
                } else {
                    // 백엔드에 현재 페이지(page) 데이터를 10개씩 요청합니다.
                    const response = await api.get(`/mypage/bookmarks?page=${page}&size=10`);

                    const newBookmarks = response.data?.data?.content || response.data?.content || [];
                    const total = response.data?.data?.totalPages || response.data?.totalPages || 0;

                    // 핵심: 1페이지면 그냥 넣고, 2페이지부터는 기존 데이터 밑에 이어 붙입니다.
                    if (page === 0) {
                        setBookmarks(newBookmarks);
                    } else {
                        setBookmarks(prev => [...prev, ...newBookmarks]);
                    }

                    setTotalPages(total);
                }
            } catch (error) {
                console.error('데이터 조회 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchData();
    }, [page]); // page 숫자가 바뀔 때마다 이 안의 코드가 다시 실행됩니다.

    const handleToggleBookmark = (questionId) => {
        if (USE_MOCK) {
            setBookmarks(prev => prev.filter(b => b.questionId !== questionId));
        } else {
            console.log("API 호출: 북마크 해제", questionId);
        }
    };

    const handleViewReport = (sessionId) => {
        if (!sessionId) {
            alert("원본 면접 기록이 존재하지 않는 질문입니다.");
            return;
        }
        navigate(`/mypage/interviews/${sessionId}`);
    };

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

                {/* 데이터가 없고 첫 페이지 로딩 중일 때만 이 문구를 보여줍니다. */}
                {isLoading && page === 0 ? (
                    <div className="text-center p-5 text-muted">데이터를 불러오는 중입니다...</div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {bookmarks
                            .filter(item => activeCategory === '전체' || item.category === activeCategory)
                            .map((item, idx) => (
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
                                        {/* 배열의 인덱스가 아니라, 진짜 데이터 번호를 보여주려면 idx를 씁니다 */}
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

                {/* 다음 페이지가 남아있을 때만 이 버튼을 화면에 보여줍니다. */}
                {page < totalPages - 1 && (
                    <div className="text-center mt-5">
                        <button
                            className="btn btn-more border rounded-pill px-4 py-2 fw-bold shadow-sm"
                            onClick={() => setPage(prev => prev + 1)}
                            disabled={isLoading}
                        >
                            {isLoading ? '불러오는 중...' : '더 많은 질문 불러오기'}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default QuestionsBookmark;