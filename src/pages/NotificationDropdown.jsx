import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // 경로에 맞게 수정해주세요
import './NotificationDropdown.css';

const NotificationDropdown = ({ direction = 'down', iconColor = '#ffffff' }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    // 💡 [개발용 스위치] 백엔드 연동 시 false로 변경하세요!
    const USE_MOCK = true;

    // 모의 데이터 세팅
    useEffect(() => {
        if (USE_MOCK) {
            // setTimeout을 사용하여 비동기적으로 상태를 업데이트합니다.
            const timer = setTimeout(() => {
                setNotifications([
                    {
                        id: 1,
                        message: "카카오페이 서버 개발자 채용 연계형 자소서 분석이 완료되었습니다.",
                        notificationType: "RESUME",
                        isRead: false,
                        createdAt: "2026-03-16T10:30:00"
                    },
                    {
                        id: 2,
                        message: "네이버 백엔드 엔지니어 모의 면접 리포트가 생성되었습니다.",
                        notificationType: "INTERVIEW",
                        isRead: false,
                        createdAt: "2026-03-15T14:20:00"
                    },
                    {
                        id: 3,
                        message: "SyncTalk에 오신 것을 환영합니다! 프로필을 설정해보세요.",
                        notificationType: "SYSTEM",
                        isRead: true,
                        createdAt: "2026-03-10T09:00:00"
                    }
                ]);
                setUnreadCount(2);
            }, 0); // 0초로 설정해도 비동기 큐에 담겨 연쇄 렌더링을 방지합니다.

            // 컴포넌트가 화면에서 사라질 때(Unmount) 타이머를 정리해줍니다.
            return () => clearTimeout(timer);
        }
    }, [USE_MOCK]);

    // 🌐 실제 API 및 SSE 연동 로직
    useEffect(() => {
        if (USE_MOCK) return;

        // 1. 초기 알림 목록 및 안읽은 개수 조회
        const fetchInitialData = async () => {
            try {
                const [listRes, countRes] = await Promise.all([
                    api.get('/notifications'),
                    api.get('/notifications/unread-count')
                ]);
                setNotifications(listRes.data || []);
                setUnreadCount(countRes.data || 0);
            } catch (error) {
                console.error("알림 초기 데이터 로드 실패:", error);
            }
        };

        void fetchInitialData();

        // 2. SSE 연결 (실시간 알림 수신)
        // 주의: EventSource는 기본적으로 헤더에 JWT를 못 넣기 때문에, 쿠키 방식을 쓰거나
        // 백엔드에서 토큰을 파라미터로 받도록 처리해야 할 수 있습니다. (?token=xxx)
        const baseURL = api.defaults.baseURL || 'http://localhost:8081'; // axios 설정에 따라 유동적으로 작동
        const token = localStorage.getItem('accessToken'); // 프로젝트에서 토큰을 저장하는 방식에 맞게 수정하세요!

        // 헤더에 못 넣으니 URL 파라미터(?token=...)로 토큰을 찔러 넣어줍니다.
        const sseUrl = `${baseURL}/api/v1/notifications/subscribe?token=${token}`;
        const eventSource = new EventSource(sseUrl);

        eventSource.addEventListener('message', (event) => {
            const newNotification = JSON.parse(event.data);

            // 새 알림이 오면 목록 맨 앞에 추가하고, 안읽음 카운트 +1
            setNotifications(prev => [newNotification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        eventSource.onerror = (error) => {
            console.error("SSE 연결 에러:", error);
            eventSource.close();
        };

        return () => {
            eventSource.close(); // 컴포넌트 언마운트 시 연결 종료
        };
    }, [USE_MOCK]);

    // 외부 클릭 시 드롭다운 닫기 로직
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 알림 읽음 처리 및 이동
    const handleNotificationClick = async (notification) => {
        // 1. 읽음 처리 API 호출
        if (!USE_MOCK && !notification.isRead) {
            try {
                await api.patch(`/notifications/${notification.id}`);
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (error) {
                console.error("알림 읽음 처리 실패:", error);
            }
        } else if (USE_MOCK && !notification.isRead) {
            setUnreadCount(prev => Math.max(0, prev - 1));
        }

        // 2. 상태 즉각 업데이트 (읽음 처리)
        setNotifications(prev =>
            prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
        );

        // 3. 타입에 따른 페이지 이동 로직 (원하시는 경로로 수정하세요)
        setIsOpen(false);
        if (notification.notificationType === 'RESUME') {
            navigate('/mypage/resumes');
        } else if (notification.notificationType === 'INTERVIEW') {
            navigate('/mypage/interviews');
        }
    };

    // 알림 삭제 처리
    const handleDelete = async (e, id) => {
        e.stopPropagation(); // 부모(알림 카드) 클릭 이벤트 방지

        if (!USE_MOCK) {
            try {
                await api.delete(`/notifications/${id}`);
            } catch (error) {
                console.error("알림 삭제 실패:", error);
            }
        }

        // 지운 알림이 안읽은 알림이었다면 카운트 차감
        const target = notifications.find(n => n.id === id);
        if (target && !target.isRead) {
            setUnreadCount(prev => Math.max(0, prev - 1));
        }

        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // 알림 타입별 아이콘 매핑
    const getIcon = (type) => {
        switch (type) {
            case 'RESUME': return '✍️';
            case 'INTERVIEW': return '🎙️';
            default: return '⚙️';
        }
    };

    // 시간 포맷팅 (예: "방금 전", "2시간 전" 등 구현 가능. 여기선 심플하게 날짜 표시)
    const formatTime = (timeStr) => {
        const date = new Date(timeStr);
        return `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const handleToggle = (e) => {
        const rect = e.currentTarget.getBoundingClientRect(); // 종 버튼의 좌표

        if (direction === 'up') {
            // 사이드바용: 버튼 바로 위(top)에서 시작해서, 위로 100% 끌어올립니다.
            setDropdownPosition({
                top: `${rect.top - 15}px`,      // 버튼 위쪽으로 15px 여유
                left: `${rect.left + (rect.width / 2) - 160}px`,
                transform: 'translateY(-100%)'  // 🚀 핵심: 알림창 자기 자신의 높이만큼 위로 솟구침!
            });
        } else {
            // 글로벌 헤더용: 버튼 바로 아래에 배치
            setDropdownPosition({
                top: `${rect.bottom + 15}px`,
                right: `${window.innerWidth - rect.right}px`,
                transform: 'none'
            });
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="notification-wrapper" ref={dropdownRef}>
            {/* 🔔 종 모양 버튼 */}
            <button
                className="notification-bell-btn border-0 bg-transparent p-1 d-flex align-items-center justify-content-center"
                onClick={handleToggle} // 💡 위에서 만든 똑똑한 함수 연결
                style={{ position: 'relative' }} // 뱃지(빨간 동그라미)를 위해 추가
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z" fill={iconColor}/>
                </svg>

                {unreadCount > 0 && (
                    <span className="notification-badge" style={{
                        position: 'absolute', top: '0', right: '0', background: '#dc3545', color: 'white',
                        borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold'
                    }}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* 🔽 드롭다운 창 */}
            {isOpen && (
                <div
                    className="notification-dropdown shadow-lg rounded-3 bg-white border"
                    style={{
                        position: 'fixed',
                        width: '320px',
                        zIndex: 99999,
                        maxHeight: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        ...dropdownPosition // ⬅️ 방금 만든 좌표와 transform이 여기에 쏙 들어갑니다.
                    }}
                >
                    <div className="dropdown-header p-3 border-bottom d-flex justify-content-between align-items-center bg-light rounded-top-3">
                        <h6 className="fw-bold mb-0 text-dark">알림</h6>
                        {unreadCount > 0 && <span className="text-primary small fw-bold">{unreadCount}개 안읽음</span>}
                    </div>

                    <div className="dropdown-body overflow-auto p-2" style={{ maxHeight: '340px' }}>
                        {notifications.length === 0 ? (
                            <div className="empty-notification text-center p-4 text-muted small">
                                새로운 알림이 없습니다.
                            </div>
                        ) : (
                            notifications.map((noti) => (
                                <div
                                    key={noti.id}
                                    className={`notification-item p-2 mb-1 rounded-2 d-flex gap-3 align-items-start ${noti.isRead ? 'bg-white' : 'bg-light'}`}
                                    onClick={() => handleNotificationClick(noti)}
                                    style={{ cursor: 'pointer', position: 'relative' }}
                                >
                                    <div className="noti-icon fs-5">
                                        {getIcon(noti.notificationType)}
                                    </div>
                                    <div className="noti-content flex-grow-1 pr-3">
                                        <p className="noti-message mb-1 small text-dark" style={{ lineHeight: '1.4' }}>{noti.message}</p>
                                        <span className="noti-time text-muted" style={{ fontSize: '0.75rem' }}>{formatTime(noti.createdAt)}</span>
                                    </div>
                                    {!noti.isRead && <div className="noti-dot rounded-circle bg-danger" style={{ width: '6px', height: '6px', marginTop: '6px' }}></div>}
                                    <button
                                        className="noti-delete-btn border-0 bg-transparent text-muted ms-2 p-0"
                                        onClick={(e) => handleDelete(e, noti.id)}
                                        style={{ fontSize: '14px' }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;