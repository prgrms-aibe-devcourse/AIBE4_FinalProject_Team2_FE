import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SyncTalkLogo from '../../assets/SyncTalk_Logo.png';
import NotificationDropdown from "../../pages/NotificationDropdown.jsx";

function Navigation() {

    const navigate = useNavigate();
    const location = useLocation();

    const accessToken = localStorage.getItem('accessToken');
    const savedRole = localStorage.getItem('role');

    const isLoggedIn = !!accessToken;
    const role = savedRole;

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');

        alert("로그아웃되었습니다.");
        navigate('/');
    };

    const isAdmin = role === 'ADMIN';

    // [추가]
    if(location.pathname.startsWith('/mypage')){
        return null;
    }

    return (
        <Navbar bg="white" expand="lg" className="border-bottom py-3 sticky-top">
            <Container style={{ marginLeft: '2rem', marginRight: '2rem', maxWidth: '100%'}}>
                {/* 로고 영역 */}
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 fw-bold fs-4">
                    <img src={SyncTalkLogo} alt="Logo" width="80" height="40" />
                </Navbar.Brand>

                {/* 모바일 토글 버튼 */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    {/* 중앙 메뉴 영역 */}
                    {isLoggedIn && (
                        <Nav className="mx-auto gap-4">
                            <Nav.Link as={Link} to="/correction" className="text-dark fw-medium">자소서 첨삭</Nav.Link>
                            <Nav.Link as={Link} to="/interview" className="text-dark fw-medium">AI 모의면접</Nav.Link>
                            {/*<Nav.Link as={Link} to="#" className="text-dark fw-medium">채용공고</Nav.Link>*/}
                            <Nav.Link as={Link} to="/mypage" className="text-dark fw-medium">마이페이지</Nav.Link>
                            {isAdmin && (
                                <Nav.Link as={Link} to="/admin/dashboard">관리자</Nav.Link>
                            )}
                        </Nav>
                        )}
                </Navbar.Collapse>

                    {/* 우측 아이콘 영역 */}
                    <Nav className="ms-auto align-items-center gap-3">
                        {!isLoggedIn ? (
                            <Link className="btn btn-primary btn-lg" to="/login">
                                {/*<PersonCircle className="text-dark" size={20} />*/}
                                LOGIN
                            </Link>
                        ) : (
                            <Button size="lg" variant="danger" onClick={handleLogout}>
                                LOGOUT
                            </Button>
                        )}
                    </Nav>
            </Container>
        </Navbar>
    );
}

export default Navigation;