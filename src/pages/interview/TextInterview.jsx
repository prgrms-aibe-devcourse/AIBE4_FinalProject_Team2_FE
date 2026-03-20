import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { interviewApi } from '../../api/interview';
import { Send, Square, Info } from 'lucide-react';
import './Interview.css';

export default function TextInterview() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode') || 'NORMAL';

    const [messages, setMessages] = useState([
        { role: 'ai', text: '반갑습니다! 준비되셨다면 자기소개를 부탁드립니다.' }
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

        const memberId = 1;
        const baseUrl = import.meta.env.VITE_API_BASE_URL;

        const params = new URLSearchParams({
            answer: userText,
            memberId: memberId.toString(),
            interviewMode: mode,
        });

        const url = `${baseUrl}/api/interviews/${sessionId}/text/stream?${params.toString()}`;

        try {
            const eventSource = new EventSource(url);

            eventSource.onmessage = (event) => {
                if (event.data === "[DONE]") {
                    eventSource.close();
                    setIsGenerating(false);
                    return;
                }

                let chunk = ""; // 빈 문자열로 초기화하여 쓰레기값 노출 방지

                try {
                    const data = JSON.parse(event.data);

                    // 텍스트 데이터 안전 추출 로직
                    if (data?.candidates?.[0]?.content?.parts?.[0]) {
                        chunk = data.candidates[0].content.parts[0].text || '';
                    } else if (data?.text) {
                        chunk = data.text;
                    }
                } catch (e) {
                    // 파싱 에러 발생 시 (긴 데이터가 쪼개져서 들어온 경우)
                    const rawData = event.data.trim();

                    if (rawData.startsWith('{') || rawData.startsWith('[')) {
                        // JSON 형태로 시작하는데 파싱 에러가 났다면 깨진 청크이므로 조용히 무시합니다.
                        console.warn("부분적으로 잘린 JSON 스트림 무시됨");
                    } else {
                        // 순수한 텍스트 메시지(서버 에러 메시지 등)일 경우에만 출력
                        chunk = rawData;
                    }
                }

                // 추가할 텍스트가 없으면(thoughtSignature 등) 렌더링 최적화를 위해 스킵
                if (!chunk) return;

                setMessages(prev => {
                    const newMsgs = [...prev];
                    const lastIdx = newMsgs.length - 1;

                    // 상태 불변성 유지 (글자 중복 타이핑 버그 방지)
                    newMsgs[lastIdx] = {
                        ...newMsgs[lastIdx],
                        text: newMsgs[lastIdx].text + chunk
                    };
                    return newMsgs;
                });
            };

            eventSource.onerror = (err) => {
                // 스트리밍이 정상 종료되어 서버가 연결을 끊은 경우 콘솔 에러가 나지 않도록 조용히 닫기
                eventSource.close();
                setIsGenerating(false);
            };
        } catch (err) {
            console.error("EventSource connection failed:", err);
            setIsGenerating(false);
        }
    };

    const handleEndInterview = async () => {
        if (!window.confirm('면접을 완전히 종료하시겠습니까?\n종료 후 결과 리포트가 생성됩니다.')) return;
        setIsEnding(true);
        try {
            await interviewApi.endInterview(sessionId, 1);
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