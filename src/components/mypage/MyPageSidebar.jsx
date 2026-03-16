import React, { useState, useEffect } from 'react';
import { NavLink, Link} from 'react-router-dom';
import api from '../../api/axios';
import './MyPageSidebar.css';
import syncTalkLogo from '../../assets/SyncTalk_Logo.png';
import defaultImage from '../../assets/defaultImage.png'

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
            <Link to="/" className="logo-link" style={{ textDecoration: 'none', color: 'inherit' }}>
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

            <div className="sidebar-user">
                <img src={user.profileImageUrl} alt="User ProfileEdit" />
                <div>
                    <strong>{user.nickname || "로딩중..."}</strong>
                </div>
            </div>
        </aside>
    );
};

export default MyPageSidebar;