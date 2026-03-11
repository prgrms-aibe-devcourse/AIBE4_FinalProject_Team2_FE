import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SyncTalkLogo from '../assets/SyncTalk_Logo.png';

function Navigation() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const savedRole = localStorage.getItem('role');

        setIsLoggedIn(!!accessToken);
        setRole(savedRole);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('role');

        alert("로그아웃되었습니다.");
        navigate('/');
    };

    const isAdmin = role === 'ADMIN';

    return (
        <Navbar bg="dark" data-bs-theme="dark" fixed="top">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img src={SyncTalkLogo} width="80" height="40" alt="SyncTalk Logo" />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link as={Link} to="/">이력서 관리</Nav.Link>
                        <Nav.Link as={Link} to="/correction">자기소개서 첨삭</Nav.Link>
                        <Nav.Link as={Link} to="/">AI 모의면접</Nav.Link>
                        <Nav.Link as={Link} to="/dashboard">마이페이지</Nav.Link>
                        {isAdmin && (
                            <Nav.Link as={Link} to="/admin/dashboard">관리자</Nav.Link>
                        )}
                        {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">*/}
                        {/*    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
                        {/*    <NavDropdown.Item href="#action/3.2">*/}
                        {/*        Another action*/}
                        {/*    </NavDropdown.Item>*/}
                        {/*    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
                        {/*    <NavDropdown.Divider />*/}
                        {/*    <NavDropdown.Item href="#action/3.4">*/}
                        {/*        Separated link*/}
                        {/*    </NavDropdown.Item>*/}
                        {/*</NavDropdown>*/}
                    </Nav>
                </Navbar.Collapse>

                {isLoggedIn ? (
                    <Button variant="outline-light" onClick={handleLogout}>
                        logout
                    </Button>
                ) : (
                    <Button as={Link} to="/login">
                        login
                    </Button>
                )}
            </Container>
        </Navbar>
    );
}

export default Navigation;