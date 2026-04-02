import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { interviewApi } from '../../api/interview';
import { Download, RefreshCw, BookOpen, Settings, User, MessageSquare, Lightbulb } from 'lucide-react';
import './Interview.css';

export default function ReportPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type') || 'TEXT';

    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let timeoutId;
        let currentDelay = 3000;
        const maxDelay = 30000;

        const fetchReport = async () => {
            try {
                const data = await interviewApi.getReport(sessionId);

                if (data.finalScore == null && !data.overallFeedback) {
                    console.log(`AI 분석 진행 중 (데이터 생성 대기)... ${currentDelay / 1000}초 뒤 재확인합니다.`);
                    scheduleNextPoll();
                    return;
                }

                setReport(data);
                setIsLoading(false);
            } catch (err) {
                if (err.response?.status === 409) {
                    console.log(`AI 분석 진행 중 (409 상태)... ${currentDelay / 1000}초 뒤 재확인합니다.`);
                    scheduleNextPoll();
                } else {
                    setError(err.response?.status === 403 ? "권한이 없습니다." : "리포트를 불러오는 데 실패했습니다.");
                    setIsLoading(false);
                }
            }
        };

        const scheduleNextPoll = () => {
            timeoutId = setTimeout(() => {
                fetchReport();
                currentDelay = Math.min(currentDelay * 2, maxDelay);
            }, currentDelay);
        };

        fetchReport();

        return () => clearTimeout(timeoutId);
    }, [sessionId]);

    if (isLoading) {
        return (
            <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}></div>
                <h5 className="fw-bold text-dark mt-3">AI가 면접 결과를 분석 중입니다.</h5>
                <p className="text-muted small">잠시만 기다려주세요 (최대 1~2분 소요)</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center gap-3 bg-light" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-danger fw-bold h5 mb-3">{error}</div>
                <button onClick={() => navigate('/interview')} className="btn btn-primary px-4 py-2 rounded-pill fw-bold" style={{ background: '#0d6efd', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '50rem', cursor: 'pointer' }}>
                    돌아가기
                </button>
            </div>
        );
    }

    const records = report?.records || report?.turnScripts || [];

    return (
        <div className="container-fluid py-5 bg-light min-vh-100 report-main">
            <div className="report-wrapper">

                {/* 상단 헤더 */}
                <div className="d-flex justify-content-between align-items-end mb-4 report-header">
                    <div>
                        <span className="report-badge">REPORT COMPLETED</span>
                        <h2 className="fw-bold mt-3 mb-1 report-title">{report.jobTitle} AI {type} 면접 분석 결과</h2>
                        <p className="text-muted small m-0">{new Date(report.createdAt).toLocaleString()} 진행 | 연관 이력서: {report.resumeTitle}</p>
                    </div>
                    <div className="d-flex gap-2 report-btn-group">
                        <button className="btn btn-outline-secondary btn-sm rounded-pill px-3 report-btn-outline">
                            <Download size={16} /> PDF 저장
                        </button>
                        <button onClick={() => navigate('/interview')} className="btn btn-primary btn-sm rounded-pill px-3 report-btn-primary">
                            다시 도전하기 <RefreshCw size={16} />
                        </button>
                    </div>
                </div>

                <div className="row g-4 report-row">

                    {/* 좌측 패널 */}
                    <div className="col-lg-7 report-left-panel">

                        {/* 총평 카드 */}
                        <div className="card border-0 shadow-sm p-4 report-card-horizontal">
                            <div className="text-center report-score-box">
                                <div className="report-score-circle">
                                    <span className="report-score-num">{report.finalScore}</span>
                                </div>
                                <div className="text-muted x-small mt-2 fw-bold report-score-text">TOTAL SCORE</div>
                            </div>
                            <div className="report-feedback-box">
                                <h5 className="fw-bold mb-3"><span role="img" aria-label="trophy">🏆</span> 전체 총평</h5>
                                <p className="text-dark small m-0 report-feedback-text">{report.overallFeedback}</p>
                            </div>
                        </div>

                        {/* 통합 평가 지표 카드 */}
                        <div className="card border-0 shadow-sm p-4 report-card">
                            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><Settings size={20} className="text-primary" /> 평가 지표</h5>
                            <div className="row g-4 report-progress-row">
                                <div className="col-md-6 report-progress-col">
                                    {[
                                        { label: '명확성 (Clarity)', score: report.clarityScore, color: '#0d6efd' },
                                        { label: '설득력 (Persuasiveness)', score: report.persuasivenessScore, color: '#6610f2' },
                                        { label: '일관성 (Consistency)', score: report.consistencyScore, color: '#20c997' }
                                    ].map(item => (
                                        <div key={item.label}>
                                            <div className="d-flex justify-content-between small mb-1 report-progress-label">
                                                <span className="fw-bold">{item.label}</span>
                                                <span className="text-muted">{item.score}%</span>
                                            </div>
                                            <div className="progress report-progress-bg">
                                                <div className="progress-bar report-progress-bar" style={{ width: `${item.score}%`, background: item.color }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="col-md-6 report-progress-col">
                                    {[
                                        { label: '논리적 구조 (Structure)', score: report.logicalStructureScore, color: '#fd7e14' },
                                        { label: '직무 적합성 (Relevance)', score: report.jobRelevanceScore, color: '#198754' },
                                        { label: '태도 및 자신감 (Attitude)', score: report.attitudeConfidenceScore, color: '#0dcaf0' }
                                    ].map(item => (
                                        <div key={item.label}>
                                            <div className="d-flex justify-content-between small mb-1 report-progress-label">
                                                <span className="fw-bold">{item.label}</span>
                                                <span className="text-muted">{item.score}%</span>
                                            </div>
                                            <div className="progress report-progress-bg">
                                                <div className="progress-bar report-progress-bar" style={{ width: `${item.score}%`, background: item.color }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 하단 설정 정보 */}
                        <div className="card border-0 shadow-sm p-4 report-card">
                            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2"><BookOpen size={20} className="text-success" /> 면접 설정 정보</h5>
                            <div className="d-flex gap-3 report-context-row">
                                <div className="report-context-box">
                                    <small className="text-muted d-block mb-1">적용된 모드</small>
                                    <span className="fw-bold">{report.interviewMode}</span>
                                </div>
                                <div className="report-context-box">
                                    <small className="text-muted d-block mb-1">면접 방식</small>
                                    <span className="fw-bold text-primary">{report.interviewType} 면접</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 우측 패널 (대화 복기) */}
                    <div className="col-lg-5 report-right-panel">
                        <div className="card border-0 shadow-sm h-100 report-chat-card">
                            <div className="p-4 border-bottom">
                                <h5 className="fw-bold m-0 d-flex align-items-center gap-2"><MessageSquare size={20} /> 전체 대화 복기</h5>
                                <p className="text-muted x-small mt-1 mb-0">AI의 상세 피드백을 확인하세요.</p>
                            </div>
                            <div className="p-4 overflow-auto custom-scroll report-chat-list">
                                {records.map((record, idx) => (
                                    <div key={idx} className="mb-5">
                                        <div className="d-flex gap-3 mb-2 report-chat-item">
                                            <div className="report-ai-avatar">
                                                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=1e293b" alt="AI" style={{ width: '100%' }} />
                                            </div>
                                            <div>
                                                <div className="fw-bold text-primary small mb-1">Q{record.turnSequence}. AI 면접관</div>
                                                <p className="small m-0 text-dark fw-bold report-chat-q">
                                                    {record.questionText || "질문 내용이 없습니다."}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-light p-3 ms-5 mb-3 border report-chat-a">
                                            <p className="small m-0 text-secondary">{record.answerText || "답변 없음"}</p>
                                        </div>
                                        <div className="ms-5 p-3 rounded-3 report-chat-feedback">
                                            <div className="d-flex align-items-center gap-1 text-warning fw-bold small mb-2">
                                                <Lightbulb size={14} /> AI Feedback
                                            </div>
                                            <p className="x-small m-0 report-chat-feedback-text">{record.aiFeedback}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}