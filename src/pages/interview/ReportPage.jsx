import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { interviewApi } from '../../api/interview';
import { Download, RefreshCw, BookOpen, Settings } from 'lucide-react';
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
        const fetchReport = async () => {
            try {
                const data = await interviewApi.getReport(sessionId, 1);
                setReport(data);
            } catch (err) {
                if (err.response?.status === 403 || err.response?.status === 409) {
                    setError("아직 분석 중이거나 정상 종료된 세션이 아닙니다.");
                } else {
                    setError("리포트를 불러오는 데 실패했습니다.");
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchReport();
    }, [sessionId]);

    if (isLoading) {
        return <div className="min-vh-100 d-flex align-items-center justify-content-center text-muted fw-bold">리포트를 분석 중입니다...</div>;
    }

    if (error) {
        return (
            <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center gap-3 bg-light">
                <div className="text-danger fw-bold h5">{error}</div>
                <button onClick={() => navigate('/interview/setup')} className="btn btn-primary px-4 py-2 rounded-pill">돌아가기</button>
            </div>
        );
    }

    return (
        <div className="container py-5">
            {/* 상단 헤더 */}
            <div className="d-flex justify-content-between align-items-end mb-5">
                <div>
                    <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill mb-3">REPORT COMPLETED</span>
                    <h2 className="fw-bold mb-2">{report.jobTitle} - AI {type === 'TEXT' ? '채팅' : '음성'} 면접 분석</h2>
                    <p className="text-muted mb-0">연관 이력서: {report.resumeTitle} | {new Date(report.createdAt).toLocaleString()} 진행</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary fw-bold rounded-pill px-4 d-flex align-items-center gap-2">
                        <Download size={18} /> PDF 저장
                    </button>
                    <button onClick={() => navigate('/interview/setup')} className="btn btn-primary fw-bold rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm">
                        <RefreshCw size={18} /> 다시 도전하기
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {/* 1. 종합 점수 카드 */}
                <div className="col-12">
                    <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5">
                        <div className="row align-items-center">
                            <div className="col-md-3 text-center mb-4 mb-md-0">
                                <div className="display-1 fw-bold text-dark">{report.finalScore || 85}</div>
                                <div className="text-muted small fw-bold mt-2" style={{letterSpacing: '2px'}}>TOTAL SCORE</div>
                            </div>
                            <div className="col-md-9 border-start ps-md-5">
                                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">🏆 전체 총평</h4>
                                <p className="text-dark" style={{lineHeight: '1.8'}}>
                                    전반적으로 직무에 대한 이해도가 높고 본인의 경험을 논리적으로 잘 설명해주셨습니다. 특히 실무 성과를 구체적인 사례로 제시한 점이 매우 인상적입니다. 앞으로는 두괄식 답변을 조금 더 연습하시면 완벽할 것입니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. 세부 분석 지표 */}
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 rounded-4 p-4 h-100">
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><Settings size={20} className="text-primary"/> 평가 지표</h5>
                        <div className="d-flex flex-column gap-4">
                            {[
                                { label: '논리성 (Clarity)', score: '90%', color: 'bg-primary' },
                                { label: '직무 적합성 (Fit)', score: '85%', color: 'bg-info' },
                                { label: '태도 (Attitude)', score: '89%', color: 'bg-success' }
                            ].map(stat => (
                                <div key={stat.label}>
                                    <div className="d-flex justify-content-between small fw-bold mb-2">
                                        <span className="text-dark">{stat.label}</span>
                                        <span className="text-muted">{stat.score}</span>
                                    </div>
                                    <div className="progress" style={{height: '8px'}}>
                                        <div className={`progress-bar ${stat.color}`} style={{width: stat.score}}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. 컨텍스트 */}
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 rounded-4 p-4 h-100">
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><BookOpen size={20} className="text-success"/> 면접 설정 컨텍스트</h5>
                        <div className="row g-3 mb-4">
                            <div className="col-6">
                                <div className="bg-light p-3 rounded-4 border text-center">
                                    <small className="text-muted fw-bold d-block mb-1">적용된 면접 모드</small>
                                    <h5 className="fw-bold text-dark mb-0">{report.interviewMode}</h5>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="bg-light p-3 rounded-4 border text-center">
                                    <small className="text-muted fw-bold d-block mb-1">면접 방식</small>
                                    <h5 className="fw-bold text-primary mb-0">{report.interviewType} 면접</h5>
                                </div>
                            </div>
                        </div>
                        <div className="bg-warning bg-opacity-10 border border-warning rounded-4 p-3">
                            <p className="text-dark small mb-0 fw-bold" style={{lineHeight: '1.6'}}>
                                💡 현재 리포트는 기본 통계 지표를 제공합니다. 향후 AI 평가 엔진이 연동되면 문항별 상세 스크립트 복기 및 정밀 피드백이 제공될 예정입니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
