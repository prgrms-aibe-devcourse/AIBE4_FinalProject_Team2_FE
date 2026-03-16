import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import api from "../../api/axios.js";

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            // 💡 [핵심 스위치] true면 가짜 데이터 사용, false면 진짜 백엔드 API 연결!
            const USE_MOCK = true;

            if (USE_MOCK) {
                console.log("🚧 MOCK 프로필 조회 데이터를 렌더링합니다.");

                // 가짜 데이터 세팅 (백엔드 DTO 구조와 완벽히 동일하게 맞춤)
                setProfile({
                    nickname: "예비개발자",
                    email: "developer@aibe.com",
                    profileImageUrl: "", // 사진이 없다면 빈 문자열로 두어 기본 이미지가 뜨게 함
                    jobPreferences: {
                        targetJobRoles: ["Java 백엔드", "Spring Boot 개발자"],
                        preferredLocation: "서울 강남구,경기 성남시"
                    }
                });

                // 로딩 상태 해제 후 함수 강제 종료
                setIsLoading(false);
                return;
            }

            // ==========================================
            // 🌐 [API 모드] 서버가 켜졌을 때 실행될 실제 코드
            // ==========================================
            try {
                const response = await api.get('/mypage/profile');
                setProfile(response.data);
            } catch (error) {
                console.error("프로필 데이터를 불러오는데 실패했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchProfileData();
    }, []);

    if (isLoading) return <main className="main-content"><div>데이터를 불러오는 중입니다...</div></main>;
    if (!profile) return <main className="main-content"><div>프로필 정보가 없습니다.</div></main>;

    const displayImageUrl = String(profile.profileImageUrl || '/AIBE4_FinalProject_Team2_FE/images/defaultImage.png');

    // ✨ 2. 백엔드 DTO(JobPreferencesDto) 구조에 맞춰 데이터를 꺼냅니다.
    // 백엔드에서 이미 List<String>으로 주기 때문에 바로 배열로 사용 가능합니다!
    const jobRoles = profile.jobPreferences?.targetJobRoles || [];

    // 지역 정보는 String이므로, 여러 개일 경우를 대비해 화면 표시용으로만 자릅니다.
    const locations = profile.jobPreferences?.preferredLocation
        ? profile.jobPreferences.preferredLocation.split(',').filter(l => l.trim())
        : [];

    return (
        <main className="main-content">
            <div className="page-header">
                <div>
                    <h1>프로필</h1>
                    <p>내 프로필 정보를 확인하세요.</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/mypage/profile/edit')}>
                    프로필 수정
                </button>
            </div>

            <section className="card profile-summary-card">
                <div className="profile-display-section">
                    <img src={displayImageUrl} className="profile-img-large" alt="Profile" />
                    <div className="profile-text-info">
                        <h2>{profile.nickname || '닉네임 없음'}</h2>
                        <p className="text-muted">{profile.email || '이메일 정보가 없습니다.'}</p>
                    </div>
                </div>
            </section>

            <section className="card">
                <h3 className="section-title">취업 선호 설정</h3>
                <div className="info-group">
                    <div className="info-row">
                        <div className="info-label">목표 직무</div>
                        <div className="info-value">
                            {jobRoles.length > 0 ? jobRoles.map((role, idx) => (
                                <span key={idx} className="tag-solid">{role}</span>
                            )) : <span className="text-muted">등록된 목표 직무가 없습니다.</span>}
                        </div>
                    </div>

                    <div className="info-row">
                        <div className="info-label">선호 지역</div>
                        <div className="info-value">
                            {locations.length > 0 ? locations.map((loc, idx) => (
                                <span key={idx} className="tag-solid">{loc}</span>
                            )) : <span className="text-muted">등록된 선호 근무 지역이 없습니다.</span>}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Profile;