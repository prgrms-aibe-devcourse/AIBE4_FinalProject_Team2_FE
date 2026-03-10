import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import SyncTalkLogo from '../assets/SyncTalk_Logo.png'
import {Link, Route, Routes} from "react-router-dom";
import LoginPage from "../pages/LoginPage.jsx";
import {Button} from "react-bootstrap";

function Navigation() {
    return (
        <Navbar bg="dark" data-bs-theme="dark" fixed="top">
            <Container>
                <Navbar.Brand href="/">
                    <img src={SyncTalkLogo} width="80" height="40" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link href="#home">이력서 관리</Nav.Link>
                        <Nav.Link href="/correction">자기소개서 첨삭</Nav.Link>
                        <Nav.Link href="#link">AI 모의면접</Nav.Link>
                        <Nav.Link href="/Dashboard">마이페이지</Nav.Link>
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
                <Button as={Link} to="/login">login</Button>
            </Container>
        </Navbar>
    );
}

export default Navigation;