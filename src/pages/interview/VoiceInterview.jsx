import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewApi } from '../../api/interview';
import { RetellWebClient } from 'retell-client-js-sdk';
import { Mic, Square, Activity } from 'lucide-react';
import './Interview.css';

const retellWebClient = new RetellWebClient();

export default function VoiceInterview() {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [callStatus, setCallStatus] = useState('READY');
    const [speaker, setSpeaker] = useState('none');
    const [subtitles, setSubtitles] = useState([]);

    useEffect(() => {
        retellWebClient.on("update", (update) => {
            if (update?.transcript) setSubtitles(update.transcript);
        });
        retellWebClient.on("agent_start_talking", () => setSpeaker('ai'));
        retellWebClient.on("agent_stop_talking", () => setSpeaker('none'));
        retellWebClient.on("user_start_talking", () => setSpeaker('user'));
        retellWebClient.on("user_stop_talking", () => setSpeaker('none'));
        retellWebClient.on("call_ended", () => setCallStatus('DONE'));

        return () => retellWebClient.stopCall();
    }, []);

    const handleStartCall = async () => {
        setCallStatus('CONNECTING');
        try {
            const { accessToken } = await interviewApi.startVoiceSession(sessionId, 1);
            await retellWebClient.startCall({ accessToken });
            setCallStatus('ACTIVE');
        } catch (error) {
            console.error("음성 연결 에러:", error); // 미사용 에러 객체 활용
            alert("마이크 권한을 허용했는지 확인하거나, HTTPS 환경인지 체크해 주세요.");
            setCallStatus('READY');
        }
    };

    const handleEndCall = async () => {
        if (!window.confirm('면접을 종료하시겠습니까?')) return;
        retellWebClient.stopCall();
        try {
            await interviewApi.endInterview(sessionId, 1);
            navigate(`/interview/report/${sessionId}?type=VOICE`);
        } catch (err) {
            console.error("서버 동기화 에러:", err); // 미사용 에러 객체 활용
            alert("서버 연결에 문제가 발생했습니다.");
        }
    };

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="row h-100 g-4 max-w-1600 mx-auto" style={{ height: 'calc(100vh - 120px)' }}>
                {/* 1. 음성 제어 영역 */}
                <div className="col-lg-8 d-flex flex-column h-100">
                    <div className="card shadow-sm border-0 rounded-4 flex-grow-1 d-flex flex-column align-items-center justify-content-center position-relative p-5">

                        <div className="position-absolute top-0 start-0 p-4 d-flex gap-2">
                            {callStatus === 'ACTIVE' && (
                                <span className="badge bg-danger bg-opacity-10 text-danger border border-danger d-flex align-items-center gap-2 px-3 py-2 rounded-pill">
                                    <div className="spinner-grow spinner-grow-sm text-danger" role="status" style={{width: '0.4rem', height: '0.4rem'}}></div> 녹음 중
                                </span>
                            )}
                            <span className="badge bg-white text-dark border px-3 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm">
                                <Mic size={14} /> 마이크 켜짐
                            </span>
                        </div>

                        {/* 파동 UI */}
                        <div className={`voice-wave-container mb-5 ${speaker === 'ai' ? 'ai-talking' : speaker === 'user' ? 'user-talking' : ''}`}>
                            {(speaker === 'ai' || speaker === 'user') && <div className="pulse-ring"></div>}
                            <Activity size={64} className={speaker === 'ai' ? 'text-primary' : speaker === 'user' ? 'text-success' : 'text-muted'} />
                        </div>

                        <h4 className={`fw-bold mb-5 ${speaker === 'ai' ? 'text-primary' : speaker === 'user' ? 'text-success' : 'text-muted'}`}>
                            {callStatus === 'READY' && '아래 버튼을 눌러 면접을 시작하세요.'}
                            {callStatus === 'CONNECTING' && '서버에 연결 중입니다...'}
                            {callStatus === 'ACTIVE' && speaker === 'ai' && '🤖 면접관이 이야기하고 있습니다...'}
                            {callStatus === 'ACTIVE' && speaker === 'user' && '🗣️ 지원자 발화 감지됨 (경청 중)'}
                            {callStatus === 'ACTIVE' && speaker === 'none' && '답변을 말씀해 주세요.'}
                            {callStatus === 'DONE' && '면접이 종료되었습니다.'}
                        </h4>

                        <div className="position-absolute bottom-0 w-100 p-4 d-flex justify-content-center">
                            {callStatus === 'READY' ? (
                                <button onClick={handleStartCall} className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow">
                                    마이크 허용 및 대화 시작
                                </button>
                            ) : (
                                <button onClick={handleEndCall} className="btn btn-danger btn-lg rounded-pill px-5 py-3 fw-bold shadow d-flex align-items-center gap-2">
                                    <Square size={20} fill="currentColor" /> 대화 종료
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. 자막(Subtitles) 영역 */}
                <div className="col-lg-4 d-flex flex-column h-100">
                    <div className="card shadow-sm border-0 rounded-4 flex-grow-1 d-flex flex-column overflow-hidden">
                        <div className="card-header bg-white py-3 border-bottom">
                            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">LIVE TRANSCRIPT</span>
                        </div>
                        <div className="card-body bg-light overflow-auto p-4 d-flex flex-column gap-3">
                            {subtitles.length === 0 ? (
                                <p className="text-muted text-center mt-5 small">면접이 시작되면 실시간 자막이 표시됩니다.</p>
                            ) : (
                                subtitles.map((item, idx) => (
                                    <div key={idx} className={`p-3 rounded-4 shadow-sm ${item.role === 'agent' ? 'bg-white border ms-0' : 'bg-success bg-opacity-10 border border-success ms-auto'}`} style={{maxWidth: '85%'}}>
                                        <small className={`fw-bold d-block mb-1 ${item.role === 'agent' ? 'text-primary' : 'text-success'}`}>
                                            {item.role === 'agent' ? 'AI 면접관' : '지원자'}
                                        </small>
                                        <span className="text-dark small" style={{lineHeight: '1.5'}}>{item.content}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}