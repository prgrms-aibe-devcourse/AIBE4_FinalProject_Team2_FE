import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './ProfileEdit.css'
import defaultImage from '../../assets/defaultImage.png';

const regionData = {
    "서울": ["서울 전체", "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
    "부산": ["부산 전체","강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"],
    "대구": ["대구 전체", "남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구", "군위군"],
    "인천": ["인천 전체", "강화군", "계양구", "남동구", "동구", "미추홀구", "부평구", "서구", "연수구", "옹진군", "중구"],
    "광주": ["광주 전체", "광산구", "남구", "동구", "북구", "서구"],
    "대전": ["대전 전체", "대덕구", "동구", "서구", "유성구", "중구"],
    "울산": ["울산 전체", "남구", "동구", "북구", "울주군", "중구"],
    "세종": ["세종특별자치시"],
    "경기": ["경기 전체", "가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"],
    "강원": ["강원 전체", "강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군", "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군", "화천군", "횡성군"],
    "충북": ["충북 전체", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시", "증평군", "진천군", "청주시", "충주시"],
    "충남": ["충남 전체", "계룡시", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군", "서산시", "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군"],
    "전북": ["전북 전체", "고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군", "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군"],
    "전남": ["전남 전체", "강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시", "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"],
    "경북": ["경북 전체", "경산시", "경주시", "고령군", "구미시", "군위군", "김천시", "문경시", "봉화군", "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시"],
    "경남": ["경남 전체", "거제시", "거창군", "고성군", "김해시", "남해군", "밀양시", "사천시", "산청군", "양산시", "의령군", "진주시", "창녕군", "창원시", "통영시", "하동군", "함안군", "함양군", "합천군"],
    "제주": ["제주 전체", "서귀포시", "제주시"]
};

const ProfileEdit = () => {
    // 1. 상태(State) 선언부
    const [profile, setProfile] = useState({ nickname: '', email: '', profileImageUrl: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const [jobRoles, setJobRoles] = useState([]);
    const [jobInput, setJobInput] = useState('');

    const [selectedLocations, setSelectedLocations] = useState([]);
    const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
    const [activeProvince, setActiveProvince] = useState('서울');

    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [isSaving, setIsSaving] = useState(false);

    const navigate = useNavigate();

    // 2. 초기 데이터 로드 (💡 USE_MOCK 로직 추가)
    useEffect(() => {
        const fetchProfileData = async () => {
            // 💡 [핵심 스위치] true면 가짜 데이터 사용, false면 진짜 백엔드 API 연결!
            const USE_MOCK = false;

            if (USE_MOCK) {
                console.log("🚧 MOCK 프로필 데이터를 렌더링합니다.");

                // 1. 임시 프로필 정보 세팅
                setProfile({
                    nickname: "예비개발자",
                    email: "developer@aibe.com",
                    profileImageUrl: "" // 임시 이미지 url이 있다면 여기에 추가
                });

                // 2. 임시 직무 선호도 세팅
                setJobRoles(["Java 백엔드", "Spring Boot 개발자"]);

                // 3. 임시 선호 근무 지역 세팅
                setSelectedLocations(["서울 강남구", "경기 성남시"]);

                return; // 💡 여기서 함수를 종료해서 아래 실제 API가 호출되지 않게 막음
            }

            // ==========================================
            // 🌐 [API 모드] 서버가 켜졌을 때 실행될 실제 코드
            // ==========================================
            try {
                const response = await api.get('/mypage/profile');
                const data = response.data;

                setProfile({
                    nickname: data?.nickname || '',
                    email: data?.email || '',
                    profileImageUrl: data?.profileImageUrl || ''
                });

                if (data?.jobPreferences) {
                    setJobRoles(data.jobPreferences.targetJobRoles || []);
                    if (data.jobPreferences.preferredLocation) {
                        setSelectedLocations(data.jobPreferences.preferredLocation.split(',').filter(l => l.trim()));
                    }
                }
            } catch (error) {
                console.error("프로필 데이터를 불러오는데 실패했습니다.", error);
            }
        };

        void fetchProfileData();
    }, []);

    // 3. 이미지 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = async () => {
        if (!window.confirm("프로필 사진을 정말 삭제하시겠습니까?")) return;

        try {
            await api.delete('/mypage/profile/image');

            setImageFile(null);
            setImagePreview(null);
            setProfile({ ...profile, profileImageUrl: '' });
            if (fileInputRef.current) fileInputRef.current.value = '';

            alert("프로필 사진이 삭제되었습니다.");
        } catch (error) {
            console.error("이미지 삭제 실패:", error);
            alert("이미지 삭제에 실패했습니다.");
        }
    };

    // 4. 태그 및 지역 모달 핸들러
    const handleJobInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = jobInput.trim();
            if (value && !jobRoles.includes(value)) {
                setJobRoles([...jobRoles, value]);
            }
            setJobInput('');
        }
    };

    const removeJobRole = (roleToRemove) => {
        setJobRoles(jobRoles.filter(role => role !== roleToRemove));
    };

    const toggleRegionModal = (e) => {
        e.stopPropagation();
        setIsRegionModalOpen(!isRegionModalOpen);
    };

    const handleCityCheck = (fullName) => {
        if (selectedLocations.includes(fullName)) {
            setSelectedLocations(selectedLocations.filter(loc => loc !== fullName));
        } else {
            setSelectedLocations([...selectedLocations, fullName]);
        }
    };

    const removeLocation = (e, locToRemove) => {
        e.stopPropagation();
        setSelectedLocations(selectedLocations.filter(loc => loc !== locToRemove));
    };

    useEffect(() => {
        const closeDropdown = () => setIsRegionModalOpen(false);
        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, []);

    // 5. 프로필 저장 API
    const handleSaveProfile = async () => {
        try {
            setIsSaving(true);

            // 💡 [참고] 저장 버튼 클릭 시에도 백엔드가 꺼져있다면 에러가 날 수 있습니다.
            // 저장 로직도 Mocking이 필요하다면 여기에 분기 처리를 할 수 있습니다.

            if (imageFile instanceof File) {
                const formData = new FormData();
                formData.append('file', imageFile);
                await api.patch('/mypage/profile/image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            const profileUpdateData = {
                nickname: profile.nickname,
                jobPreferences: {
                    targetJobRoles: jobRoles,
                    preferredLocation: selectedLocations.join(',')
                }
            };

            const response = await api.patch('/mypage/profile', profileUpdateData);
            alert(response.data.message || '프로필 수정이 완료되었습니다.');
            navigate('/mypage/profile')

        } catch (error) {
            console.error('Error:', error);
            alert(error.response?.data?.message || '프로필 정보 저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        const { currentPassword, newPassword, confirmPassword } = passwords;
        if (!currentPassword || !newPassword) {
            alert('비밀번호를 입력해주세요.');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await api.patch('/mypage/password', {
                currentPassword,
                newPassword
            });
            alert(response.data.message || '비밀번호가 성공적으로 변경되었습니다.');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            console.error('Error:', error);
            alert(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
        }
    };

    const displayImageUrl = imagePreview || profile.profileImageUrl || defaultImage;

    // 6. JSX (화면 렌더링)
    return (
        <main className="main-content">
            <div className="page-header">
                <div>
                    <h1>프로필 설정</h1>
                    <p>개인 정보 및 계정 설정을 관리하세요.</p>
                </div>
                <button id="btn-save-profile" className="btn-primary" onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? '저장 중...' : '변경사항 저장'}
                </button>
            </div>

            <section className="card">
                <h3>프로필 사진</h3>
                <div className="profile-upload-section">
                    <img src={String(displayImageUrl)} className="profile-img" alt="ProfileEdit" />
                    <div className="upload-info">
                        <p className="help-text">최소 200x200 픽셀의 JPG 또는 PNG 파일을 권장합니다.<br />최대 파일 크기: 5MB</p>
                        <div className="action-buttons">
                            <label htmlFor="profileImageInput" className="btn-outline" style={{cursor: 'pointer'}}>새 이미지 업로드</label>
                            <input type="file" id="profileImageInput" ref={fileInputRef} accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={handleImageChange} />
                            <button type="button" className="btn-text-danger" onClick={handleImageRemove}>제거</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="card">
                <h3>기본 정보</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label>닉네임</label>
                        <input type="text" className="form-control" value={profile.nickname} onChange={(e) => setProfile({...profile, nickname: e.target.value})} />
                    </div>
                    <div className="form-group">
                        <label>이메일 주소</label>
                        <input type="email" value={profile.email} disabled className="form-control" readOnly />
                    </div>
                </div>
            </section>

            <section className="card">
                <h3>비밀번호 변경</h3>
                <div className="form-row">
                    <div className="form-group">
                        <label>현재 비밀번호</label>
                        <input
                            type="password"
                            className="form-control"
                            value={passwords.currentPassword}
                            onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>새 비밀번호</label>
                        <input
                            type="password"
                            className="form-control"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>새 비밀번호 확인</label>
                        <input
                            type="password"
                            className="form-control"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                        />
                    </div>
                </div>
                <div className="text-right mt-10">
                    <button type="button" className="btn-outline mt-10" onClick={handleChangePassword}>비밀번호 변경 적용</button>
                </div>
            </section>

            <section className="card">
                <h3>취업 선호 설정</h3>
                <div className="form-group">
                    <label>목표 직무</label>
                    <div className="tag-input-container">
                        {jobRoles.map((role, idx) => (
                            <span key={idx} className="tag">
                                <span className="tag-text">{role}</span>
                                <span className="tag-close" onClick={() => removeJobRole(role)}>×</span>
                            </span>
                        ))}
                        <input type="text" placeholder="직무 입력 후 Enter..." className="tag-input-field" value={jobInput} onChange={(e) => setJobInput(e.target.value)} onKeyDown={handleJobInputKeyDown} />
                    </div>
                </div>

                <div className="form-group mt-20">
                    <label>선호 근무 지역</label>
                    <div className="custom-dropdown-wrapper">
                        <div className="form-control dropdown-trigger" onClick={toggleRegionModal} style={{ minHeight: '44px', height: 'auto', alignItems: 'flex-start', display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', flex: 1 }}>
                                {selectedLocations.length === 0 ? (
                                    <span className="placeholder-text" style={{ marginTop: '2px' }}>지역을 선택해주세요 (다중 선택 가능)</span>
                                ) : (
                                    selectedLocations.map((loc, idx) => (
                                        <span key={idx} className="tag">
                                            <span className="tag-text">{loc}</span>
                                            <span className="tag-close" onClick={(e) => removeLocation(e, loc)}>×</span>
                                        </span>
                                    ))
                                )}
                            </div>
                            <span className="dropdown-icon" style={{ marginTop: '6px' }}>▼</span>
                        </div>

                        {isRegionModalOpen && (
                            <div className="region-modal" onClick={(e) => e.stopPropagation()}>
                                <div className="region-modal-body">
                                    <div className="region-left">
                                        <ul className="province-list">
                                            {Object.keys(regionData).map((province) => (
                                                <li key={province} className={activeProvince === province ? 'active' : ''} onClick={() => setActiveProvince(province)}>
                                                    {province}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="region-right">
                                        <div className="city-grid">
                                            {regionData[activeProvince].map((city) => {
                                                const fullName = `${activeProvince} ${city}`;
                                                return (
                                                    <label key={fullName} className="checkbox-label">
                                                        <input type="checkbox" checked={selectedLocations.includes(fullName)} onChange={() => handleCityCheck(fullName)} />
                                                        {city}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="region-modal-footer">
                                    <span className="selected-count">선택됨: <strong>{selectedLocations.length}</strong>건</span>
                                    <button type="button" className="btn-primary" style={{ padding: '6px 16px' }} onClick={() => setIsRegionModalOpen(false)}>적용</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="card danger-zone">
                <div className="danger-header">
                    <span className="danger-icon">⚠️</span>
                    <h3 className="danger-title">계정 삭제</h3>
                </div>
                <p className="danger-desc">계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.</p>
                <button className="btn-danger-outline">계정 삭제하기</button>
            </section>
        </main>
    );
};

export default ProfileEdit;