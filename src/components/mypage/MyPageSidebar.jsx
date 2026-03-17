import React, { useState, useEffect } from 'react';
import { NavLink, Link} from 'react-router-dom';
import api from '../../api/axios';
import './MyPageSidebar.css';
import syncTalkLogo from '../../assets/SyncTalk_Logo.png';
import defaultImage from '../../assets/defaultImage.png'
import NotificationDropdown from "../../pages/NotificationDropdown.jsx";

const MyPageSidebar = () => {
    const [user, setUser] = useState({
        nickname: "",
        profileImageUrl: defaultImage
    });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await api.get('/mypage/profile');
                const profileData = response.data;

                setUser({
                    nickname: profileData.nickname,
                    profileImageUrl: profileData.profileImageUrl || defaultImage
                });
            } catch (error) {
                console.error("사이드바 사용자 정보를 불러오는데 실패했습니다.", error);
                setUser({
                    nickname: "사용자",
                    profileImageUrl: defaultImage
                });
            }
        };

        void fetchUserInfo();
    }, []);

    return (
        <aside className="sidebar">
            <Link to="/main" className="logo-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="sidebar-logo">
                    <img
                        src={syncTalkLogo}
                        alt="SyncTalk 로고"
                        className="logo-image" /* 💡 클래스명 변경! */
                    />
                </div>
            </Link>

            <ul className="nav-menu">
                <li>
                    <NavLink to="/mypage/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
                        대시보드
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mypage/resumes" className={({ isActive }) => isActive ? "active" : ""}>
                        내 자기소개서
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mypage/interviews" className={({ isActive }) => isActive ? "active" : ""}>
                        면접 결과
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mypage/bookmarks" className={({ isActive }) => isActive ? "active" : ""}>
                        면접 질문 모음
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mypage/profile" className={({ isActive }) => isActive ? "active" : ""}>
                        프로필 설정
                    </NavLink>
                </li>
            </ul>

            <div className="sidebar-user d-flex justify-content-between align-items-center w-100">

                {/* 기존 프로필 이미지와 이름 */}
                <div className="d-flex align-items-center gap-2 overflow-hidden">
                    <img src={user.profileImageUrl} alt="User ProfileEdit" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div className="text-truncate" style={{ maxWidth: '80px' }}>
                        <strong>{user.nickname || "로딩중..."}</strong>
                    </div>
                </div>

                {/* 💡 신규 추가된 알림 & 로그아웃 버튼 영역 */}
                <div className="d-flex align-items-center gap-1" style={{ flexShrink: 0 }}>
                    <NotificationDropdown direction="up" iconColor="#6c757d" />

                    <button
                        className="btn btn-link p-1 text-muted d-flex align-items-center justify-content-center border-0"
                        title="로그아웃"
                        onClick={() => console.log('로그아웃 처리 로직')}
                        style={{ transition: 'color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#dc3545'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default MyPageSidebar;