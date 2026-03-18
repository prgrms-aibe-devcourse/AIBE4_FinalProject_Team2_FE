import { NavLink, Link, useNavigate } from "react-router-dom";

function AdminSidebar() {
    const navigate = useNavigate();

    const menuStyle = ({ isActive }) => ({
        display: "block",
        padding: "12px 16px",
        color: isActive ? "#fff" : "#ddd",
        backgroundColor: isActive ? "#0d6efd" : "transparent",
        textDecoration: "none",
        borderRadius: "8px",
        marginBottom: "8px",
        transition: "all 0.2s ease"
    });

    const sectionTitleStyle = {
        fontSize: "12px",
        color: "#9ca3af",
        margin: "20px 8px 8px"
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        alert("로그아웃되었습니다.");
        navigate("/login");
    };

    return (
        <aside
            style={{
                width: "260px",
                background: "#1f2937",
                color: "#fff",
                padding: "24px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}
        >
            <div>
                <h2 style={{ fontSize: "20px", marginBottom: "24px" }}>관리자 / 운영</h2>

                <div style={sectionTitleStyle}>관리자 기능</div>
                <NavLink to="/admin/dashboard" style={menuStyle}>
                    관리자 대시보드
                </NavLink>
                <NavLink to="/admin/members" style={menuStyle}>
                    회원 관리
                </NavLink>
                <NavLink to="/admin/credits" style={menuStyle}>
                    크레딧 관리
                </NavLink>
                <NavLink to="/admin/usage/logs" style={menuStyle}>
                    사용량 로그
                </NavLink>
                <NavLink to="/admin/usage/statistics" style={menuStyle}>
                    사용량 통계
                </NavLink>
                <NavLink to="/admin/operations" style={menuStyle}>
                    운영 제어
                </NavLink>

                <div style={sectionTitleStyle}>운영 관제</div>
                <NavLink to="/ops/dashboard" style={menuStyle}>
                    운영 대시보드
                </NavLink>
                <NavLink to="/ops/alerts" style={menuStyle}>
                    Alerts
                </NavLink>
                <NavLink to="/ops/queue" style={menuStyle}>
                    Queue 상태
                </NavLink>
                <NavLink to="/ops/issues" style={menuStyle}>
                    Error Issues
                </NavLink>
                <NavLink to="/ops/logs" style={menuStyle}>
                    Error Logs
                </NavLink>
            </div>

            <div>
                <hr style={{ margin: "16px 0", borderColor: "#444" }} />

                <Link
                    to="/"
                    style={{
                        display: "block",
                        padding: "12px 16px",
                        color: "#ddd",
                        textDecoration: "none",
                        borderRadius: "8px",
                        marginBottom: "8px"
                    }}
                >
                    ← 서비스 메인으로
                </Link>

                <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "12px 16px",
                        color: "#ddd",
                        background: "transparent",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "16px"
                    }}
                >
                    로그아웃
                </button>
            </div>
        </aside>
    );
}

export default AdminSidebar;