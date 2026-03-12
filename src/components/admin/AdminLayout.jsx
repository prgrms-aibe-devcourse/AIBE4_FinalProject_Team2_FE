import AdminSidebar from "./AdminSidebar";

function AdminLayout({ title, children }) {
    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f8f9fa" }}>
            <AdminSidebar />
            <main style={{ flex: 1, padding: "32px" }}>
                <h1 style={{ marginBottom: "24px" }}>{title}</h1>
                {children}
            </main>
        </div>
    );
}

export default AdminLayout;