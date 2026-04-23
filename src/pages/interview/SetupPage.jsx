import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, MessageSquare, ShieldAlert, Play, Settings, FileText, Briefcase, Info, User, Star } from 'lucide-react';
import { interviewApi } from '../../api/interview';
import axios from '../../api/axios';
import { parseJobPosting } from '../../api/jobPosting';
import './Interview.css';

export default function SetupPage() {
    const navigate = useNavigate();

    // 기존 상태
    const [interviewType, setInterviewType] = useState('TEXT');
    const [interviewMode, setInterviewMode] = useState('NORMAL');
    const [isLoading, setIsLoading] = useState(false);

    // 🚀 [추가] 직무 및 연차 상태 변수
    const [jobRole, setJobRole] = useState('BACKEND');
    const [experience, setExperience] = useState('NEWBIE');

    // 자기소개서 상태
    const [myResumes, setMyResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [isResumesLoading, setIsResumesLoading] = useState(false);

    // 채용 공고 상태
    const [parsedJobInfo, setParsedJobInfo] = useState(null);
    const [selectedJobPostingId, setSelectedJobPostingId] = useState(null);
    const [parsedJobText, setParsedJobText] = useState(""); // 공고 전체 본문 텍스트 상태
    const [isJobLoading, setIsJobLoading] = useState(false);

    // 컴포넌트 마운트 시 내 자기소개서 목록 불러오기
    useEffect(() => {
        const fetchMyResumes = async () => {
            setIsResumesLoading(true);
            try {
                const response = await axios.get('/resumes');
                // ApiResponse 구조에 따라 data.data 배열 추출
                const resumeList = response.data?.data || [];
                setMyResumes(resumeList);
            } catch (error) {
                console.error("자기소개서 목록 조회 실패:", error);
            } finally {
                setIsResumesLoading(false);
            }
        };
        fetchMyResumes();
    }, []);

    // 채용 공고 불러오기 핸들러
    const handleLoadJobPosting = async () => {
        const url = window.prompt("분석할 채용 공고 URL을 입력해주세요 (원티드 등):");
        if (!url) return;

        setIsJobLoading(true);
        try {
            const response = await parseJobPosting(url);
            if (response.success && response.data) {
                const data = response.data;
                const jobId = data.id || data.jobPostingId || (data.data && data.data.id) || null;

                // 전체 텍스트 저장 로직 유지
                const fullText = data.jobDescription || data.content || JSON.stringify(data);

                setSelectedJobPostingId(jobId);
                setParsedJobText(fullText);
                setParsedJobInfo(`[${data.companyName}] ${data.jobTitle}`);
                alert("채용 공고가 성공적으로 적용되었습니다!");
            } else {
                alert("공고를 불러오는데 실패했습니다.");
            }
        } catch (error) {
            console.error("공고 파싱 에러:", error);
            alert("공고를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setIsJobLoading(false);
        }
    };

    const handleStartInterview = async () => {
        setIsLoading(true);
        try {
            // [수정] 음성/텍스트 면접에 관계없이 직무와 연차 정보를 함께 전송
            const sessionData = await interviewApi.startInterview({
                resumeId: (interviewType === 'TEXT' && selectedResumeId) ? Number(selectedResumeId) : null,
                jobPostingId: (interviewType === 'TEXT' && selectedJobPostingId) ? selectedJobPostingId : null,
                jobDescription: interviewType === 'TEXT' ? parsedJobText : null,
                interviewType: interviewType,
                interviewMode: interviewMode,
                aiProvider: interviewType === 'TEXT' ? 'GEMINI' : 'RETELL',
                modelVariant: 'gemini-2.5-flash',
                jobRole: jobRole,           // 추가된 직무 데이터
                experience: experience // 추가된 연차 데이터
            });

            const sessionId = sessionData.sessionId || sessionData.id;

            if (interviewType === 'TEXT') {
                navigate(`/interview/text/${sessionId}?mode=${interviewMode}`);
            } else {
                navigate(`/interview/voice/${sessionId}?mode=${interviewMode}`);
            }
        } catch (error) {
            console.error("세션 생성 실패:", error);
            if (error.response?.status === 401) {
                alert("로그인이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.");
                navigate('/login');
            } else {
                alert("면접 세션을 생성하지 못했습니다. 백엔드 서버를 확인해주세요.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="interview-container py-5" style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div className="mb-5 text-center">
                <span className="badge bg-primary bg-opacity-10 text-primary mb-2 px-3 py-2 rounded-pill">AI 면접 설정</span>
                <h2 className="fw-bold mb-3">맞춤형 모의 면접 준비</h2>
                <p className="text-muted">내 직무/연차 정보와 이력서를 추가하면 훨씬 더 정교한 질문을 받을 수 있습니다.</p>
            </div>

            {/* 🚀 [추가] 0. 지원자 기본 정보 설정 */}
            <div className="setup-card p-4 border-0 shadow-sm rounded-4 bg-white mb-4">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                    <User size={20} className="text-primary" /> 기본 지원 정보 설정
                </h5>
                <div className="row g-4">
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary">희망 직무</label>
                        <select
                            className="form-select form-select-lg bg-light border-0"
                            value={jobRole}
                            onChange={(e) => setJobRole(e.target.value)}
                        >
                            <option value="BACKEND">백엔드 엔지니어</option>
                            <option value="FRONTEND">프론트엔드 엔지니어</option>
                            <option value="FULLSTACK">풀스택 엔지니어</option>
                            <option value="PM">서비스 기획자 (PM/PO)</option>
                            <option value="COMMON">기타 직무 (일반)</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-secondary">경력 (연차)</label>
                        <select
                            className="form-select form-select-lg bg-light border-0"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                        >
                            <option value="NEWBIE">신입 (경력 없음)</option>
                            <option value="JUNIOR">주니어 (1~3년 차)</option>
                            <option value="MIDDLE">미들 (4~7년 차)</option>
                            <option value="SENIOR">시니어 (8년 차 이상)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                {/* 1. 면접 진행 방식 */}
                <div className="col-md-6">
                    <div className="setup-card h-100 p-4 border-0 shadow-sm rounded-4 bg-white">
                        <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <Settings size={18} className="text-primary" /> 면접 방식
                        </h6>
                        <div className="d-flex flex-column gap-2">
                            <button
                                className={`btn py-3 fw-bold ${interviewType === 'TEXT' ? 'btn-primary shadow-sm' : 'btn-light text-secondary'}`}
                                onClick={() => setInterviewType('TEXT')}>
                                💬 채팅(Text) 면접
                            </button>
                            <button
                                className={`btn py-3 fw-bold ${interviewType === 'VOICE' ? 'btn-primary shadow-sm' : 'btn-light text-secondary'}`}
                                onClick={() => setInterviewType('VOICE')}>
                                🎙️ 음성(Voice) 면접
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. 추가 컨텍스트 (자소서 / 채용공고) */}
                <div className="col-md-6">
                    <div className="setup-card h-100 p-4 border-0 shadow-sm rounded-4 bg-white d-flex flex-column justify-content-center gap-4">

                        {/* 조건부 렌더링: 텍스트 모드일 때만 입력 폼 노출, 음성 모드면 안내 문구 노출 */}
                        {interviewType === 'TEXT' ? (
                            <>
                                <div>
                                    <h6 className="fw-bold mb-2 d-flex align-items-center gap-2">
                                        <FileText size={18} className="text-success" /> 자기소개서 첨부 <span className="text-muted small fw-normal">(선택)</span>
                                    </h6>
                                    <select
                                        className="form-select form-select-lg bg-light border-0"
                                        value={selectedResumeId}
                                        onChange={(e) => setSelectedResumeId(e.target.value)}
                                        disabled={isResumesLoading}
                                    >
                                        <option value="">선택하지 않음 (기본 면접)</option>
                                        {myResumes.map((resume) => (
                                            <option key={resume.id} value={resume.id}>
                                                {resume.title || `자기소개서 #${resume.id}`}
                                            </option>
                                        ))}
                                    </select>
                                    {isResumesLoading && <small className="text-muted mt-1 d-block">목록을 불러오는 중...</small>}
                                </div>

                                <div>
                                    <h6 className="fw-bold mb-2 d-flex align-items-center gap-2">
                                        <Briefcase size={18} className="text-warning" /> 채용 공고 추가 <span className="text-muted small fw-normal">(선택)</span>
                                    </h6>
                                    {parsedJobInfo ? (
                                        <div className="p-3 bg-light border-start border-warning border-4 rounded d-flex justify-content-between align-items-center">
                                            <span className="small fw-bold text-truncate me-2" style={{ maxWidth: '80%' }}>
                                                {parsedJobInfo}
                                            </span>
                                            <button className="btn btn-sm btn-outline-danger py-0 px-2" onClick={() => { setParsedJobInfo(null); setSelectedJobPostingId(null); setParsedJobText(""); }}>삭제</button>
                                        </div>
                                    ) : (
                                        <button
                                            className="btn btn-light w-100 py-3 text-secondary fw-bold border-0 d-flex justify-content-center align-items-center gap-2"
                                            onClick={handleLoadJobPosting}
                                            disabled={isJobLoading}
                                        >
                                            {isJobLoading ? <span className="spinner-border spinner-border-sm"></span> : "+ 공고 URL 링크 넣기"}
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            // 음성 모드일 때 보여줄 대체 UI
                            <div className="text-center text-muted py-3">
                                <Info size={40} className="mb-3 text-secondary opacity-50" />
                                <h6 className="fw-bold text-secondary">음성 면접은 고정된 설정으로 진행됩니다.</h6>
                                <p className="small mb-0">자기소개서 및 채용 공고 연동은<br/>텍스트 면접에서만 지원됩니다.</p>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* 3. 면접 유형 선택 (텍스트 모드일 때만 전체 박스 렌더링) */}
            {interviewType === 'TEXT' && (
                <div className="setup-card p-4 border-0 shadow-sm rounded-4 bg-white mb-4 transition-all">
                    <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                        <span className="text-primary">❖</span> 면접 세부 유형
                    </h5>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div
                                className={`type-card h-100 p-4 border rounded-4 cursor-pointer transition-all ${interviewMode === 'NORMAL' ? 'border-primary bg-primary bg-opacity-10 shadow-sm' : 'border-light bg-light hover-shadow'}`}
                                onClick={() => setInterviewMode('NORMAL')} style={{ cursor: 'pointer' }}>
                                <div className="icon-box bg-white text-primary rounded-circle d-inline-flex p-3 mb-3 shadow-sm">
                                    <BookOpen size={24} />
                                </div>
                                <h6 className="fw-bold">정형화된 기본 면접</h6>
                                <p className="text-muted small mb-0 mt-2">직무별 빈출 질문 위주의 기본적인 면접 연습입니다.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div
                                className={`type-card h-100 p-4 border rounded-4 cursor-pointer transition-all ${interviewMode === 'FOLLOW_UP' ? 'border-info bg-info bg-opacity-10 shadow-sm' : 'border-light bg-light hover-shadow'}`}
                                onClick={() => setInterviewMode('FOLLOW_UP')} style={{ cursor: 'pointer' }}>
                                <div className="icon-box bg-white text-info rounded-circle d-inline-flex p-3 mb-3 shadow-sm">
                                    <MessageSquare size={24} />
                                </div>
                                <h6 className="fw-bold">꼬리물기 심층 면접</h6>
                                <p className="text-muted small mb-0 mt-2">제출한 자소서를 분석하여 심층적인 추가 질문을 합니다.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div
                                className={`type-card h-100 p-4 border rounded-4 cursor-pointer transition-all ${interviewMode === 'STRESS' ? 'border-danger bg-danger bg-opacity-10 shadow-sm' : 'border-light bg-light hover-shadow'}`}
                                onClick={() => setInterviewMode('STRESS')} style={{ cursor: 'pointer' }}>
                                <div className="icon-box bg-white text-danger rounded-circle d-inline-flex p-3 mb-3 shadow-sm">
                                    <ShieldAlert size={24} />
                                </div>
                                <h6 className="fw-bold">실전 압박 면접</h6>
                                <p className="text-muted small mb-0 mt-2">난이도 높은 질문과 돌발 상황에 대처하는 능력을 기릅니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 하단 버튼 */}
            <div className="d-flex justify-content-center gap-3 mt-5">
                <button className="btn btn-light px-5 py-3 fw-bold rounded-pill text-secondary shadow-sm" onClick={() => navigate(-1)}>
                    이전으로
                </button>
                <button
                    onClick={handleStartInterview}
                    disabled={isLoading}
                    className="btn btn-primary px-5 py-3 fw-bold d-flex align-items-center gap-2 rounded-pill shadow">
                    {isLoading ? '생성 중...' : <><Play size={20} fill="currentColor" /> 맞춤형 면접 시작하기</>}
                </button>
            </div>
        </div>
    );
}