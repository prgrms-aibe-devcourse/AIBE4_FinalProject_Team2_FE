import { useEffect, useState } from "react";
import api from "../../api/axios.js";

import AdminLayout from "../../components/admin/AdminLayout.jsx";
import SummaryCards from "../../components/admin/SummaryCards.jsx";
import RecentLogsTable from "../../components/admin/RecentLogsTable.jsx";

function AdminDashboard() {
    const [summary, setSummary] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAdminDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const [summaryRes, logsRes] = await Promise.all([
                    api.get("/admin/dashboard/summary"),
                    api.get("/admin/dashboard/recent-logs"),
                ]);

                setSummary(summaryRes.data?.data ?? summaryRes.data);
                setLogs(logsRes.data?.data ?? logsRes.data ?? []);
            } catch (err) {
                console.error("관리자 대시보드 조회 실패:", err);

                if (err.response) {
                    setError(`관리자 데이터를 불러오지 못했습니다. (${err.response.status})`);
                } else {
                    setError("서버에 연결하지 못했습니다.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAdminDashboard();
    }, []);

    return (
        <AdminLayout title="관리자 대시보드">
            {loading && <div>로딩 중...</div>}

            {!loading && error && (
                <div style={{ color: "red" }}>{error}</div>
            )}

            {!loading && !error && summary && (
                <>
                    <SummaryCards summary={summary} />

                    <h2 style={{ marginTop: "40px", marginBottom: "20px" }}>
                        최근 사용 로그
                    </h2>

                    <RecentLogsTable logs={logs} />
                </>
            )}

            {!loading && !error && !summary && (
                <div>표시할 요약 데이터가 없습니다.</div>
            )}
        </AdminLayout>
    );
}

export default AdminDashboard;