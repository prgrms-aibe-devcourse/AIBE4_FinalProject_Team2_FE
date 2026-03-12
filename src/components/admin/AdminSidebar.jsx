import { NavLink } from "react-router-dom";

function AdminSidebar() {
    const menuStyle = ({ isActive }) => ({
        display: "block",
        padding: "12px 16px",
        color: isActive ? "#fff" : "#ddd",
        backgroundColor: isActive ? "#0d6efd" : "transparent",
        textDecoration: "none",
        borderRadius: "8px",
        marginBottom: "8px"
    });

    return (
        <aside
            style={{
                width: "240px",
                background: "#1f2937",
                color: "#fff",
                padding: "24px 16px"
            }}
        >
            <h2 style={{ fontSize: "20px", marginBottom: "24px" }}>관리자</h2>

            <NavLink to="/admin/dashboard" style={menuStyle}>대시보드</NavLink>
            <NavLink to="/admin/members" style={menuStyle}>회원 관리</NavLink>
            <NavLink to="/admin/credits" style={menuStyle}>크레딧 관리</NavLink>
            <NavLink to="/admin/usage/logs" style={menuStyle}>사용량 로그</NavLink>
            <NavLink to="/admin/usage/statistics" style={menuStyle}>사용량 통계</NavLink>
        </aside>
    );
}

export default AdminSidebar;