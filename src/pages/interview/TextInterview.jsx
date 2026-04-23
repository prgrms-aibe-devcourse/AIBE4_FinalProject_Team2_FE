import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { interviewApi } from '../../api/interview';
import { Send, Square, Info } from 'lucide-react';
import './Interview.css';

// 모드별 동적 인사말 생성 함수
// [리뷰 반영] 인사말 데이터를 상수 객체로 분리하여 유지보수성 향상
const GREETINGS = {
    STRESS: '바로 시작하겠습니다. 지원자님, 1분 자기소개 해보세요.',
    FOLLOW_UP: '지원해 주셔서 감사합니다. 먼저 본인의 핵심 역량을 중심으로 자기소개를 부탁드립니다.',
    NORMAL: '반갑습니다! 긴장 푸시고 편하게 자기소개 부탁드립니다.'
};

// 넘어온 mode 값으로 객체에서 텍스트를 찾고, 이상한 값이면 NORMAL을 기본으로 출력
const getInitialGreeting = (mode) => GREETINGS[mode] || GREETINGS.NORMAL;

export default function TextInterview() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode') || 'NORMAL';

    // 고정된 텍스트 대신 동적 인사말 함수 호출
    const [messages, setMessages] = useState([
        { role: 'ai', text: getInitialGreeting(mode) }
    ]);

    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEnding, setIsEnding] = useState(false);
    const chatBoxRef = useRef(null);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || isGenerating) return;

        const userText = input;
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setInput('');
        setIsGenerating(true);
        setMessages(prev => [...prev, { role: 'ai', text: '' }]);

        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

        // [수정] 파라미터 생성 객체
        const params = new URLSearchParams({
            answer: userText,
            interviewMode: mode
        });

        // [추가] 로컬 스토리지에 저장된 JWT 토큰을 가져와서 파라미터에 붙임
        const token = localStorage.getItem('accessToken');
        if (token) {
            params.append('token', token);
        }

        // 완성된 파라미터(answer, interviewMode, token)를 URL에 결합
        const url = `${baseUrl}/api/interviews/${sessionId}/text/stream?${params.toString()}`;

        try {
            // 라이브러리 없이 기본 EventSource 사용
            const eventSource = new EventSource(url, { withCredentials: true });

            eventSource.onopen = () => {
                console.log("🟢 SSE 서버 연결 성공!");
            };

            const messageHandler = (event) => {
                console.log("📥 [SSE 수신 데이터]:", event.data);

                if (event.data === "[DONE]") {
                    eventSource.close();
                    setIsGenerating(false);
                    return;
                }

                let chunk = "";

                try {
                    // [리뷰 반영] 백엔드 응답 규격이 개선되었으므로 단일 파싱으로 깔끔하게 처리
                    const data = JSON.parse(event.data);

                    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                        chunk = data.candidates[0].content.parts[0].text;
                    } else if (data?.text) {
                        chunk = data.text;
                    } else {
                        console.warn("⚠️ 텍스트 필드를 찾을 수 없습니다:", data);
                    }
                } catch (e) {
                    console.error("❌ JSON 파싱 실패:", e, "원본:", event.data);
                    const rawData = event.data.trim();
                    if (!rawData.startsWith('{') && !rawData.startsWith('[')) {
                        chunk = rawData;
                    }
                }

                if (!chunk) return;

                setMessages(prev => {
                    const newMsgs = [...prev];
                    const lastIdx = newMsgs.length - 1;
                    newMsgs[lastIdx] = {
                        ...newMsgs[lastIdx],
                        text: newMsgs[lastIdx].text + chunk
                    };
                    return newMsgs;
                });
            };

            eventSource.addEventListener('message', messageHandler);

            eventSource.onerror = (err) => {
                console.error("🚨 EventSource 통신 에러 (연결 끊김):", err);
                eventSource.close();
                setIsGenerating(false);
            };

        } catch (err) {
            console.error("🚨 EventSource 객체 생성 실패:", err);
            setIsGenerating(false);
        }
    };

    const handleEndInterview = async () => {
        if (!window.confirm('면접을 완전히 종료하시겠습니까?\n종료 후 결과 리포트가 생성됩니다.')) return;
        setIsEnding(true);
        try {
            // [수정] memberId 하드코딩 파라미터 완전 제거
            await interviewApi.endInterview(sessionId);
            navigate(`/interview/report/${sessionId}?type=TEXT`);
        } catch (error) {
            alert("종료 처리에 실패했습니다.");
            setIsEnding(false);
        }
    };

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="row h-100 g-4 max-w-1600 mx-auto chat-container">
                {/* 채팅 영역 */}
                <div className="col-lg-8 d-flex flex-column h-100">
                    <div className="card shadow-sm border-0 rounded-4 flex-grow-1 d-flex flex-column overflow-hidden">
                        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-dark rounded-circle overflow-hidden shadow-sm" style={{width: '48px', height: '48px'}}>
                                    <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=1e293b" alt="AI" className="w-100 h-100" />
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-0">AI 면접관</h5>
                                    <small className="text-success fw-bold">● Online</small>
                                </div>
                            </div>
                            <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-3 py-2 rounded-pill">면접 진행중</span>
                        </div>

                        <div className="card-body bg-light overflow-auto d-flex flex-column gap-3 p-4" ref={chatBoxRef}>
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                    {msg.role === 'ai' && (
                                        <div className="bg-dark rounded-circle flex-shrink-0 me-3 mt-1" style={{width: '40px', height: '40px', overflow: 'hidden'}}>
                                            <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=1e293b" alt="AI" className="w-100 h-100" />
                                        </div>
                                    )}
                                    <div className={`msg-bubble shadow-sm ${msg.role === 'user' ? 'msg-user' : 'msg-ai'}`} style={{ whiteSpace: 'pre-wrap' }}>
                                        {msg.role === 'ai' && msg.text === '' && isGenerating ? (
                                            <div className="d-flex gap-1 align-items-center" style={{height: '24px'}}>
                                                <div className="spinner-grow text-secondary" style={{width: '0.5rem', height: '0.5rem'}} role="status"></div>
                                                <div className="spinner-grow text-secondary" style={{width: '0.5rem', height: '0.5rem', animationDelay: '0.2s'}} role="status"></div>
                                                <div className="spinner-grow text-secondary" style={{width: '0.5rem', height: '0.5rem', animationDelay: '0.4s'}} role="status"></div>
                                            </div>
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="card-footer bg-white p-4 border-top">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control form-control-lg rounded-pill bg-light border-0 ps-4"
                                    placeholder="답변을 입력하세요..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    disabled={isGenerating || isEnding}
                                />
                                <button
                                    className="btn btn-primary rounded-circle ms-2 d-flex align-items-center justify-content-center"
                                    style={{width: '50px', height: '50px'}}
                                    onClick={handleSend}
                                    disabled={isGenerating || isEnding || !input.trim()}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 가이드 영역 */}
                <div className="col-lg-4 d-flex flex-column h-100">
                    <div className="card shadow-sm border-0 rounded-4 flex-grow-1 overflow-hidden">
                        <div className="card-header bg-white py-3 border-bottom">
                            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">TEXT INTERVIEW</span>
                        </div>
                        <div className="card-body p-4">
                            <h4 className="fw-bold mb-4">AI 채팅 모의 면접</h4>
                            <div className="bg-warning bg-opacity-10 border border-warning rounded-4 p-4 mb-4">
                                <h6 className="fw-bold text-warning d-flex align-items-center gap-2 mb-2">
                                    <Info size={18} /> Interview Tip
                                </h6>
                                <p className="text-dark small mb-0" style={{lineHeight: '1.6'}}>
                                    모르는 질문이 나왔을 때는 당황하지 말고 아는 선에서 최대한 논리적으로 답변을 작성해 보세요. AI가 문맥을 파악하여 다음 질문을 이어갑니다.
                                </p>
                            </div>
                        </div>
                        <div className="card-footer bg-light p-4 border-top">
                            <button
                                className="btn btn-outline-danger w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-4"
                                onClick={handleEndInterview}
                                disabled={isEnding}
                            >
                                <Square size={18} fill="currentColor" /> {isEnding ? '종료 중...' : '인터뷰 완전히 종료하기'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}