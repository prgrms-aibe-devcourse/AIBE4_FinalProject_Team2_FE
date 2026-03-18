import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './ResumesList.css';

const ResumesList = () => {
    const navigate = useNavigate();

    // 1. 상태: 활성화된 탭 ('AI' 또는 'ORIGINAL')
    const [activeTab, setActiveTab] = useState('AI');

    // 2. 상태: 데이터 보관
    const [aiReports, setAiReports] = useState([]);
    const [originalResumes, setOriginalResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 3. 상태: 상단 대시보드 통계
    const [stats, setStats] = useState({
        aiCount: 0,
        originalCount: 0,
        completedCount: 0
    });

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        setPage(0);
    }, [activeTab]);

    // 4. API 호출 로직
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            // 💡 [개발용 스위치] 화면 렌더링 테스트 중에는 true, 백엔드 연동 시에는 false로 변경하세요.
            const USE_MOCK = false;

            try {
                if (USE_MOCK) {
                    console.log(`🚧 MOCK 데이터를 렌더링합니다. (현재 탭: ${activeTab})`);

                    // [Mock] 통계 데이터 세팅
                    setStats({
                        aiCount: 3,
                        originalCount: 2,
                        completedCount: 5
                    });

                    // [Mock] 탭에 따른 리스트 데이터 분기
                    if (activeTab === 'AI') {
                        const mockAiReports = [
                            {
                                analysisId: 1,
                                title: "네이버 클라우드 백엔드 엔지니어 지원",
                                matchScore: 92,
                                createdAt: "2026-03-15T10:00:00"
                            },
                            {
                                analysisId: 2,
                                title: "카카오페이 서버 개발자 채용 연계형",
                                matchScore: 85,
                                createdAt: "2026-03-10T14:30:00"
                            },
                            {
                                analysisId: 3,
                                title: "토스뱅크 코어뱅킹 직무 자소서",
                                matchScore: 78,
                                createdAt: "2026-03-05T09:15:00"
                            }
                        ];
                        setAiReports(mockAiReports);
                    } else {
                        const mockOriginalResumes = [
                            {
                                id: 101,
                                title: "김개발_백엔드_이력서_최종.pdf"
                            },
                            {
                                id: 102,
                                title: "2026_상반기_공채_포트폴리오_v2.pdf"
                            }
                        ];
                        setOriginalResumes(mockOriginalResumes);
                    }
                } else {
                    // [API 모드] 실제 서버 연동
                    // [1] 리스트 데이터 호출
                    if (activeTab === 'AI') {
                        const response = await api.get(`/mypage/resumes/analysis?page=${page}&size=10`);
                        const content = response.data?.data?.content || response.data?.content || [];
                        const total = response.data?.data?.totalPages || response.data?.totalPages || 0;

                        setAiReports(content);
                        setTotalPages(total);
                    } else {
                        const response = await api.get('/resumes');
                        const content = response.data?.data || response.data || [];
                        setOriginalResumes(content);
                    }

                    // [2] 통계 데이터 호출
                    const statsResponse = await api.get('/mypage/resumes/stats');
                    const statsData = statsResponse.data?.data || statsResponse.data;

                    if (statsData) {
                        setStats({
                            aiCount: statsData.aiResumeCount || 0,
                            originalCount: statsData.savedResumeCount || 0,
                            completedCount: statsData.completedCount || 0
                        });
                    }
                }
            } catch (error) {
                console.error("데이터를 불러오는데 실패했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchData();
    }, [activeTab, page]);

    return (
        <main className="main-content">
            <div className="page-header">
                <div>
                    <h1>내 자기소개서 📄</h1>
                    <p>AI와 함께 완벽한 지원서를 작성하고 관리하세요.</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/resume/write')}>
                    + 새 문서 작성
                </button>
            </div>

            {/* 대시보드 통계 */}
            <section className="stats-container">
                <div className="stat-card">
                    <div className="stat-title">AI 자소서</div>
                    <div className="stat-value">{stats.aiCount} <span className="stat-badge">New</span></div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">저장된 이력서</div>
                    <div className="stat-value">{stats.originalCount}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-title">작성 완료</div>
                    <div className="stat-value text-success">{stats.completedCount} <span className="stat-check">✔</span></div>
                </div>
            </section>

            {/* 탭 메뉴 영역 */}
            <div className="tab-navigation">
                <button
                    className={`tab-btn ${activeTab === 'AI' ? 'active' : ''}`}
                    onClick={() => setActiveTab('AI')}
                >
                    ✨ AI Cover Letters
                </button>
                <button
                    className={`tab-btn ${activeTab === 'ORIGINAL' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ORIGINAL')}
                >
                    📁 Resumes
                </button>
            </div>

            {/* 조건부 렌더링 */}
            <section className="tab-content">
                {isLoading ? (
                    <div className="loading-text">데이터를 불러오는 중입니다...</div>
                ) : (
                    <div className="card-grid">

                        {/* 탭 1: AI 리포트 화면 */}
                        {activeTab === 'AI' && (
                            <>
                                {aiReports.map((report, idx) => {
                                    const targetId = report.analysisId || report.id;

                                    return (
                                        <div key={targetId || idx} className="resume-card ai-card">
                                            <div className="card-badge ai-badge">AI Enhanced</div>
                                            <h3 className="card-title text-truncate" title={report.resumeTitle}>
                                                {report.resumeTitle || '제목 없는 리포트'}
                                            </h3>
                                            {(report.companyName || report.jobTitle) && (
                                                <p className="card-desc mb-1" style={{ fontSize: '0.85rem', color: '#6C757D' }}>
                                                    🏢 {report.companyName || '회사 미상'} / {report.jobTitle || '직무 미상'}
                                                </p>
                                            )}
                                            <p className="card-desc">매칭 점수: <strong style={{ color: '#1976D2' }}>{report.matchScore || 0}점</strong></p>
                                            <div className="card-footer">
                                                <span className="card-date">
                                                    {report.createdAt ? new Date(report.createdAt).toLocaleDateString('ko-KR') : '날짜 없음'}
                                                </span>

                                                <button
                                                    className="btn-outline-small"
                                                    onClick={() => navigate(`/mypage/resumes/${targetId}`)} // 💡 상세 페이지 경로 수정
                                                >
                                                    View Feedback
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div className="resume-card create-card" onClick={() => navigate('/resume/write')} style={{ cursor: 'pointer' }}>
                                    <div className="create-icon">+</div>
                                    <p>새 AI 자소서 생성</p>
                                    <span className="create-desc">AI의 도움을 받아 자소서를 완성하세요</span>
                                </div>
                            </>
                        )}

                        {/* 탭 2: 원본 이력서 화면 */}
                        {activeTab === 'ORIGINAL' && (
                            <>
                                {originalResumes.map((resume, idx) => (
                                    <div key={resume.id || idx} className="resume-card original-card">
                                        <div className="card-icon-wrapper">
                                            <span className="pdf-icon">📄</span>
                                        </div>
                                        <h3 className="card-title">{resume.title || '제목 없는 이력서'}</h3>
                                        <div className="card-actions">
                                            <button className="btn-text">Download</button>
                                            <button className="btn-text">Edit</button>
                                        </div>
                                    </div>
                                ))}
                                <div className="resume-card create-card" style={{ cursor: 'pointer' }}>
                                    <div className="create-icon">+</div>
                                    <p>Upload New Resume</p>
                                    <span className="create-desc">드래그 앤 드롭으로 업로드하세요</span>
                                </div>
                            </>
                        )}

                    </div>
                )}
            </section>
            {activeTab === 'AI' && !isLoading && totalPages > 0 && (
                <div className="pagination d-flex justify-content-center gap-3 mt-4 mb-4">
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                    >
                        &lt; 이전
                    </button>
                    <span className="page-indicator align-self-center fw-bold">
                        현재 페이지: {page + 1} / {totalPages}
                    </span>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= totalPages - 1}
                    >
                        다음 &gt;
                    </button>
                </div>
            )}
        </main>
    );
};

export default ResumesList;