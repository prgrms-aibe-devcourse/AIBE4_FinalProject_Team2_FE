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

    const subMenuStyle = {
        display: "block",
        padding: "12px 16px",
        color: "#ddd",
        textDecoration: "none",
        borderRadius: "8px",
        marginBottom: "8px",
        transition: "all 0.2s ease"
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
                width: "240px",
                background: "#1f2937",
                color: "#fff",
                padding: "24px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}
        >
            <div>
                <h2 style={{ fontSize: "20px", marginBottom: "24px" }}>관리자</h2>

                <NavLink to="/admin/dashboard" style={menuStyle}>
                    대시보드
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
            </div>

            <div>
                <hr style={{ margin: "16px 0", borderColor: "#444" }} />

                <Link to="/" style={subMenuStyle}>
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