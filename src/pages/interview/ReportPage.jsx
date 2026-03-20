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
        let intervalId;

        const fetchReport = async () => {
            try {
                const data = await interviewApi.getReport(sessionId, 1);

                if (data.finalScore == null && !data.overallFeedback) {
                    console.log("AI 분석 진행 중 (데이터 생성 대기)... 5초 뒤 재확인합니다.");
                    return;
                }

                setReport(data);
                setIsLoading(false);
                clearInterval(intervalId);
            } catch (err) {
                if (err.response?.status === 409) {
                    console.log("AI 분석 진행 중 (409 상태)... 5초 뒤 재확인합니다.");
                } else {
                    setError(err.response?.status === 403 ? "권한이 없습니다." : "리포트를 불러오는 데 실패했습니다.");
                    setIsLoading(false);
                    clearInterval(intervalId);
                }
            }
        };

        fetchReport();
        intervalId = setInterval(fetchReport, 3000);

        return () => clearInterval(intervalId);
    }, [sessionId]);

    // AI 텍스트 정제 헬퍼 함수 (JSON 조각 제거)
    const parseAIText = (rawText) => {
        if (!rawText) return "질문 내용이 없습니다.";
        if (!rawText.trim().startsWith('{') && !rawText.trim().startsWith('[')) return rawText;

        try {
            const parsed = JSON.parse(rawText);
            return parsed.candidates?.[0]?.content?.parts?.[0]?.text || parsed.text || rawText;
        } catch (e) {
            if (rawText.includes('"text"')) {
                const textRegex = /"text"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
                let result = "";
                let match;
                while ((match = textRegex.exec(rawText)) !== null) {
                    result += match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                }
                if (result) return result;
            }
        }
        return rawText;
    };

    if (isLoading) {
        return (
            <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}></div>
                <h5 className="fw-bold text-dark mt-3">AI가 면접 결과를 분석 중입니다.</h5>
                <p className="text-muted small">잠시만 기다려주세요 (최대 1~2분 소요)</p>
            </div>
        );
    }

    // 백엔드 데이터 호환 처리 (dto 구조 대응)
    const records = report?.records || report?.turnScripts || [];

    return (
        <div className="container-fluid py-5 bg-light min-vh-100" style={{ background: '#f8f9fa', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* 상단 헤더 */}
                <div className="d-flex justify-content-between align-items-end mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                    <div>
                        <span style={{ background: '#e0f2fe', color: '#0d6efd', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>REPORT COMPLETED</span>
                        <h2 className="fw-bold mt-3 mb-1" style={{ fontSize: '1.75rem', margin: '1rem 0 0.5rem 0' }}>{report.jobTitle} AI {type} 면접 분석 결과</h2>
                        <p className="text-muted small m-0">{new Date(report.createdAt).toLocaleString()} 진행 | 연관 이력서: {report.resumeTitle}</p>
                    </div>
                    <div className="d-flex gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" style={{ background: 'white', border: '1px solid #dee2e6', padding: '0.5rem 1rem', borderRadius: '50rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Download size={16} /> PDF 저장
                        </button>
                        <button onClick={() => navigate('/interview/setup')} className="btn btn-primary btn-sm rounded-pill px-3" style={{ background: '#0d6efd', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '50rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            다시 도전하기 <RefreshCw size={16} />
                        </button>
                    </div>
                </div>

                <div className="row g-4" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>

                    {/* 좌측 패널 */}
                    <div className="col-lg-7" style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* 총평 카드 */}
                        <div className="card border-0 shadow-sm p-4" style={{ background: 'white', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div className="text-center" style={{ flex: '0 0 120px' }}>
                                <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '6px solid #0d6efd', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{report.finalScore}</span>
                                </div>
                                <div className="text-muted x-small mt-2 fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>TOTAL SCORE</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <h5 className="fw-bold mb-3"><span role="img" aria-label="trophy">🏆</span> 전체 총평</h5>
                                <p className="text-dark small m-0" style={{ lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{report.overallFeedback}</p>
                            </div>
                        </div>

                        {/* 통합 평가 지표 카드 (6개 한꺼번에 모음) */}
                        <div className="card border-0 shadow-sm p-4" style={{ background: 'white', borderRadius: '1rem' }}>
                            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><Settings size={20} className="text-primary" /> 평가 지표</h5>
                            <div className="row g-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                                <div className="col-md-6" style={{ flex: '1 1 calc(50% - 0.75rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {[
                                        { label: '명확성 (Clarity)', score: report.clarityScore, color: '#0d6efd' },
                                        { label: '설득력 (Persuasiveness)', score: report.persuasivenessScore, color: '#6610f2' },
                                        { label: '일관성 (Consistency)', score: report.consistencyScore, color: '#20c997' }
                                    ].map(item => (
                                        <div key={item.label}>
                                            <div className="d-flex justify-content-between small mb-1" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                                <span className="fw-bold">{item.label}</span>
                                                <span className="text-muted">{item.score}%</span>
                                            </div>
                                            <div className="progress" style={{ height: '6px', background: '#f1f3f5', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div className="progress-bar" style={{ width: `${item.score}%`, height: '100%', background: item.color }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="col-md-6" style={{ flex: '1 1 calc(50% - 0.75rem)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {[
                                        { label: '논리적 구조 (Structure)', score: report.logicalStructureScore, color: '#fd7e14' },
                                        { label: '직무 적합성 (Relevance)', score: report.jobRelevanceScore, color: '#198754' },
                                        { label: '태도 및 자신감 (Attitude)', score: report.attitudeConfidenceScore, color: '#0dcaf0' }
                                    ].map(item => (
                                        <div key={item.label}>
                                            <div className="d-flex justify-content-between small mb-1" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                                <span className="fw-bold">{item.label}</span>
                                                <span className="text-muted">{item.score}%</span>
                                            </div>
                                            <div className="progress" style={{ height: '6px', background: '#f1f3f5', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div className="progress-bar" style={{ width: `${item.score}%`, height: '100%', background: item.color }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 하단 설정 정보 */}
                        <div className="card border-0 shadow-sm p-4" style={{ background: 'white', borderRadius: '1rem' }}>
                            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2"><BookOpen size={20} className="text-success" /> 면접 설정 정보</h5>
                            <div className="d-flex gap-3" style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1, background: '#f8f9fa', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
                                    <small className="text-muted d-block mb-1">적용된 모드</small>
                                    <span className="fw-bold">{report.interviewMode}</span>
                                </div>
                                <div style={{ flex: 1, background: '#f8f9fa', padding: '1rem', borderRadius: '0.75rem', textAlign: 'center' }}>
                                    <small className="text-muted d-block mb-1">면접 방식</small>
                                    <span className="fw-bold text-primary">{report.interviewType} 면접</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 우측 패널 (대화 복기) */}
                    <div className="col-lg-5" style={{ flex: '1 1 400px' }}>
                        <div className="card border-0 shadow-sm h-100" style={{ background: 'white', borderRadius: '1rem', display: 'flex', flexDirection: 'column', maxHeight: '800px' }}>
                            <div className="p-4 border-bottom">
                                <h5 className="fw-bold m-0 d-flex align-items-center gap-2"><MessageSquare size={20} /> 전체 대화 복기</h5>
                                <p className="text-muted x-small mt-1 mb-0">AI의 상세 피드백을 확인하세요.</p>
                            </div>
                            <div className="p-4 overflow-auto custom-scroll" style={{ flex: 1, overflowY: 'auto' }}>
                                {records.map((record, idx) => (
                                    <div key={idx} className="mb-5">
                                        <div className="d-flex gap-3 mb-2" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1e293b', flexShrink: 0 }}>
                                                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=1e293b" alt="AI" style={{ width: '100%' }} />
                                            </div>
                                            <div>
                                                <div className="fw-bold text-primary small mb-1">Q{record.turnSequence}. AI 면접관</div>
                                                <p className="small m-0 text-dark fw-bold" style={{ lineHeight: '1.5' }}>{parseAIText(record.questionText)}</p>
                                            </div>
                                        </div>
                                        <div className="bg-light p-3 rounded-3 ms-5 mb-3 border" style={{ borderRadius: '0 0.75rem 0.75rem 0.75rem' }}>
                                            <p className="small m-0 text-secondary">{record.answerText || "답변 없음"}</p>
                                        </div>
                                        <div className="ms-5 p-3 rounded-3" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                                            <div className="d-flex align-items-center gap-1 text-warning fw-bold small mb-2">
                                                <Lightbulb size={14} /> AI Feedback
                                            </div>
                                            <p className="x-small m-0" style={{ color: '#92400e', lineHeight: '1.6' }}>{record.aiFeedback}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 bg-light border-top text-center" style={{ borderRadius: '0 0 1rem 1rem' }}>
                                <button className="btn btn-sm btn-white w-100 fw-bold border" style={{ background: 'white' }}>전체 스크립트 복사하기</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}