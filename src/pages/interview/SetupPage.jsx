import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, MessageSquare, ShieldAlert, Play, Settings } from 'lucide-react';
import { interviewApi } from '../../api/interview';
import './Interview.css'; // 전용 CSS 임포트 (필수)

export default function SetupPage() {
    const navigate = useNavigate();

    const [interviewMode, setInterviewMode] = useState('TEXT');
    const [interviewType, setInterviewType] = useState('NORMAL');
    const [isLoading, setIsLoading] = useState(false);

    const handleStartInterview = async () => {
        setIsLoading(true);
        try {
            // 백엔드 API 연동 로직
            const sessionData = await interviewApi.startInterview({
                memberId: 1,
                jobPostingId: null,
                resumeId: null,
                interviewType: interviewMode,
                aiProvider: interviewMode === 'TEXT' ? 'GEMINI' : 'RETELL',
                interviewMode: interviewType,
                modelVariant: 'gemini-flash-latest'
            });

            const sessionId = sessionData.sessionId || sessionData.id;

            if (interviewMode === 'TEXT') {
                navigate(`/interview/text/${sessionId}?mode=${interviewType}`);
            } else {
                navigate(`/interview/voice/${sessionId}?mode=${interviewType}`);
            }
        } catch (error) {
            console.error("세션 생성 실패:", error);
            alert("서버 연결에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="interview-container">
            <div className="mb-4">
                <span className="badge bg-primary bg-opacity-10 text-primary mb-2">AI 면접</span>
                <h2 className="fw-bold mb-2">모의 면접 설정</h2>
                <p className="text-muted">원하는 면접 유형과 설정을 선택하여 실전 감각을 키워보세요.</p>
            </div>

            {/* 1. 면접 방식 선택 */}
            <div className="setup-card">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <Settings size={20} className="text-primary" /> 면접 진행 방식
                </h5>
                <div className="row g-3">
                    <div className="col-md-6">
                        <button
                            className={`btn w-100 py-3 fw-bold ${interviewMode === 'TEXT' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setInterviewMode('TEXT')}>
                            💬 채팅(Text) 면접
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button
                            className={`btn w-100 py-3 fw-bold ${interviewMode === 'VOICE' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setInterviewMode('VOICE')}>
                            🎙️ 음성(Voice) 면접
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. 면접 유형 선택 */}
            <div className="setup-card">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                    <span className="text-primary">❖</span> 면접 유형 선택
                </h5>
                <div className="row g-4">
                    {/* 일반 면접 */}
                    <div className="col-md-4">
                        <div
                            className={`type-card h-100 ${interviewType === 'NORMAL' ? 'selected' : ''}`}
                            onClick={() => setInterviewType('NORMAL')}>
                            <div className="icon-box bg-primary bg-opacity-10 text-primary">
                                <BookOpen size={24} />
                            </div>
                            <h6 className="fw-bold">정형화된 면접</h6>
                            <p className="text-muted small mb-0 mt-2">직무별 빈출 질문 위주의 기본적인 면접 연습입니다.</p>
                        </div>
                    </div>
                    {/* 꼬리질문 면접 */}
                    <div className="col-md-4">
                        <div
                            className={`type-card h-100 ${interviewType === 'FOLLOW_UP' ? 'selected' : ''}`}
                            onClick={() => setInterviewType('FOLLOW_UP')}>
                            <div className="icon-box bg-info bg-opacity-10 text-info">
                                <MessageSquare size={24} />
                            </div>
                            <h6 className="fw-bold">꼬리물기 자유 대화</h6>
                            <p className="text-muted small mb-0 mt-2">과거 경험을 분석하여 심층적인 추가 질문을 합니다.</p>
                        </div>
                    </div>
                    {/* 압박 면접 */}
                    <div className="col-md-4">
                        <div
                            className={`type-card h-100 ${interviewType === 'STRESS' ? 'selected' : ''}`}
                            onClick={() => setInterviewType('STRESS')}>
                            <div className="icon-box bg-danger bg-opacity-10 text-danger">
                                <ShieldAlert size={24} />
                            </div>
                            <h6 className="fw-bold">실전 압박 면접</h6>
                            <p className="text-muted small mb-0 mt-2">난이도 높은 질문과 돌발 상황에 대처하는 능력을 기릅니다.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 하단 버튼 */}
            <div className="d-flex justify-content-end gap-2 mt-4 mb-5">
                <button className="btn btn-outline-secondary px-4 py-2 fw-bold" onClick={() => navigate(-1)}>
                    이전으로
                </button>
                <button
                    onClick={handleStartInterview}
                    disabled={isLoading}
                    className="btn btn-primary px-4 py-2 fw-bold d-flex align-items-center gap-2">
                    {isLoading ? '생성 중...' : <><Play size={18} fill="currentColor" /> 면접 시작하기</>}
                </button>
            </div>
        </div>
    );
}