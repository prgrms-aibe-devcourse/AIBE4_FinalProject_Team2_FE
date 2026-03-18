import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './InterviewsList.css';

const interviewModeMap = {
    'NORMAL': '일반 면접',
    'FOLLOW_UP': '심층 면접',
    'STRESS': '압박 면접'
};

const InterviewsList = () => {
    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const [searchInput, setSearchInput] = useState("");
    const [activeKeyword, setActiveKeyword] = useState("");
    const [filterType, setFilterType] = useState("");

    useEffect(() => {
        const fetchInterviews = async () => {
            setIsLoading(true);

            const USE_MOCK = false;

            if (USE_MOCK) {
                console.log("🚧 MOCK 데이터를 렌더링합니다.");

                const mockContent = [
                    {
                        sessionId: 1,
                        resumeTitle: "2026 카카오 공채 자소서",
                        companyName: "카카오",
                        jobTitle: "백엔드 개발자",
                        interviewMode: "NORMAL",
                        interviewType: "VOICE",
                        status: "COMPLETED",
                        finalScore: 88,
                        createdAt: "2026-03-13T10:00:00"
                    },
                    {
                        sessionId: 2,
                        resumeTitle: "선택된 자기소개서 없음",
                        companyName: "자유 면접",
                        jobTitle: "-",
                        interviewMode: "STRESS",
                        interviewType: "TEXT",
                        status: "IN_PROGRESS",
                        finalScore: null,
                        createdAt: "2026-03-12T15:30:00"
                    },
                    {
                        sessionId: 3,
                        resumeTitle: "네이버 신입 자소서",
                        companyName: "네이버",
                        jobTitle: "프론트엔드 개발자",
                        interviewMode: "FOLLOW_UP",
                        interviewType: "VOICE",
                        status: "COMPLETED",
                        finalScore: 92,
                        createdAt: "2026-03-10T11:00:00"
                    }
                ];

                let filteredData = mockContent;
                if (filterType) {
                    filteredData = filteredData.filter(item => item.interviewType === filterType);
                }
                if (activeKeyword) {
                    filteredData = filteredData.filter(item =>
                        item.companyName.includes(activeKeyword) || item.jobTitle.includes(activeKeyword)
                    );
                }

                setInterviews(filteredData);
                setTotalPages(1);
                setIsLoading(false);
                return;
            }

            try {
                const response = await api.get(`/mypage/interviews`, {
                    params: {
                        page: page,
                        size: 8,
                        type: filterType || undefined,
                        keyword: activeKeyword || undefined
                    }
                });

                const data = response.data?.data || response.data;
                setInterviews(data.content || []);
                setTotalPages(data.totalPages || 0);

                // 실제 API에 통계 엔드포인트가 있다면 여기서 호출해서 setStats 적용
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchInterviews();
    }, [page, filterType, activeKeyword]);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            setActiveKeyword(searchInput);
            setPage(0);
        }
    };

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        setPage(0);
    };

    const handleCardClick = (id) => {
        navigate(`/mypage/interviews/${id}`);
    };

    return (
        <main className="main-content">
            {/* 💡 자소서 페이지와 동일한 헤더 구조 적용 */}
            <div className="page-header d-flex justify-content-between align-items-end mb-4">
                <div>
                    <h1 className="fw-bold mb-2 text-dark">면접 이력 조회 🎙️</h1>
                    <p className="text-muted mb-0">진행한 면접 연습 기록들을 확인하고, 상세 피드백을 받아보세요.</p>
                </div>
                <button className="btn-primary-custom" onClick={() => navigate('/interview')}>
                    + 새 면접 시작
                </button>
            </div>

            {/* 필터 섹션 */}
            <div className="filter-section pb-3 border-bottom mb-4">
                <input
                    type="text"
                    placeholder="면접 기록 검색 후 엔터..."
                    className="search-bar"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                />
                <select className="type-filter" value={filterType} onChange={handleFilterChange}>
                    <option value="">전체 방식</option>
                    <option value="VOICE">음성 면접</option>
                    <option value="TEXT">채팅 면접</option>
                </select>
            </div>

            {/* 💡 자소서 페이지와 동일한 그리드 적용 */}
            <section className="tab-content">
                {isLoading ? (
                    <div className="loading-text text-center p-5 text-muted">데이터를 불러오는 중입니다...</div>
                ) : (
                    <div className="card-grid">
                        {interviews.map((item) => {
                            const formattedDate = item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString('ko-KR')
                                : '날짜 미상';

                            // 뱃지 색상 분기
                            let badgeClass = "badge-normal";
                            if (item.interviewMode === 'FOLLOW_UP') badgeClass = "badge-followup";
                            if (item.interviewMode === 'STRESS') badgeClass = "badge-stress";

                            return (
                                <div key={item.sessionId} className="unified-card">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div className={`card-badge ${badgeClass}`}>
                                            {interviewModeMap[item.interviewMode] || item.interviewMode || '일반 면접'}
                                        </div>
                                        {item.status !== 'COMPLETED' && (
                                            <span className="status-dot">진행 중</span>
                                        )}
                                    </div>

                                    <h3 className="card-title text-truncate" title={`${item.companyName} / ${item.jobTitle}`}>
                                        {item.companyName} <span className="text-muted fw-normal text-sm">/ {item.jobTitle}</span>
                                    </h3>

                                    <div className="card-desc">
                                        <p className="mb-1">유형: <strong>{item.interviewType === 'VOICE' ? '음성 면접' : item.interviewType === 'TEXT' ? '채팅 면접' : '미상'}</strong></p>
                                        <p className="mb-0">점수: <strong className="text-primary">{item.finalScore ?? '-'}점</strong></p>
                                    </div>

                                    <div className="card-footer">
                                        <span className="card-date">{formattedDate}</span>
                                        <button className="btn-outline-small" onClick={() => handleCardClick(item.sessionId)}>
                                            상세 보기
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <div className="pagination">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                    &lt; 이전
                </button>
                <span className="page-indicator">
                    현재 페이지: {page + 1} / {totalPages === 0 ? 1 : totalPages}
                </span>
                <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1 || totalPages === 0}>
                    다음 &gt;
                </button>
            </div>
        </main>
    );
};

export default InterviewsList;