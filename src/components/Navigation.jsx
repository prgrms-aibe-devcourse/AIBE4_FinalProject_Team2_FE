import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import SyncTalkLogo from '../assets/SyncTalk_Logo.png'
import {Link, useNavigate} from "react-router-dom";
import axios from "../api/axios.js";

function Navigation() {

    const navigate = useNavigate();

    // 로컬 스토리지에 토큰이 있는지 확인 (로그인 상태 판단)
    const isAuthenticated = !!localStorage.getItem('accessToken');

    const handleLogout = async () => {
        try {
            // 백엔드 로그인 API 호출 예시

            const response = await axios.get('/auth/logout');

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            alert('로그아웃 되었습니다.');
            navigate('/main');
        } catch (error) {
            // 서버에서 온 에러 메시지가 있다면 그걸 보여주는 게 좋습니다.
            const errorMsg = error.response?.data?.message || error.message;
            alert("로그아웃 실패\n" + errorMsg);
        }
    };

    return (
        <Navbar bg="dark" data-bs-theme="dark" fixed="top">
            <Container>
                <Navbar.Brand href="/main">
                    <img src={SyncTalkLogo} width="80" height="40" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    {isAuthenticated ? (
                        <Nav className="mx-auto">
                            <Nav.Link href="#">이력서 관리</Nav.Link>
                            <Nav.Link href="#">자기소개서 첨삭</Nav.Link>
                            <Nav.Link href="#">AI 모의면접</Nav.Link>
                            <Nav.Link href="#">마이페이지</Nav.Link>
                        </Nav>
                    ) : (
                        <></>
                    )}
                </Navbar.Collapse>
                {isAuthenticated ? (
                    /* 1. 로그인 상태일 때: 로그아웃 버튼만 노출 */
                    <>
                        <span className="text-secondary me-3 small">환영합니다!</span>
                        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    /* 2. 로그아웃 상태일 때: 로그인/회원가입 버튼 노출 */
                    <>
                        <Link className="btn btn-outline-light btn-sm me-2" to="/login">
                            Login
                        </Link>
                    </>
                )}
            </Container>
        </Navbar>
    );
}

export default Navigation;