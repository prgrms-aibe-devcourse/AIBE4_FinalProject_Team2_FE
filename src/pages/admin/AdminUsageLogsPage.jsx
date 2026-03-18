import { useEffect, useState } from "react";
import { Alert, Card, Spinner } from "react-bootstrap";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import PagingBar from "../../components/admin/PagingBar.jsx";
import AdminUsageLogSearchForm from "../../components/admin/AdminUsageLogSearchForm.jsx";
import AdminUsageLogsTable from "../../components/admin/AdminUsageLogsTable.jsx";
import { searchAdminUsageLogs } from "../../api/admin.js";

function AdminUsageLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [searchCond, setSearchCond] = useState({
        memberId: undefined,
        nickname: undefined,
        email: undefined,
        serviceType: undefined,
        from: undefined,
        to: undefined,
        targetType: undefined
    });

    const [pageInfo, setPageInfo] = useState({
        page: 0,
        size: 20,
        totalPages: 0,
        totalElements: 0
    });

    const fetchUsageLogs = async (cond = searchCond, page = pageInfo.page, size = pageInfo.size) => {
        try {
            setLoading(true);
            setError("");

            const params = {
                ...cond,
                page,
                size
            };

            const res = await searchAdminUsageLogs(params);

            // 백엔드 응답: Page<UsageLogAdminRow> 기준
            const pageData = res.data;

            setLogs(pageData.content || []);
            setPageInfo({
                page: pageData.number ?? 0,
                size: pageData.size ?? size,
                totalPages: pageData.totalPages ?? 0,
                totalElements: pageData.totalElements ?? 0
            });
        } catch (err) {
            console.error("사용량 로그 조회 실패:", err);
            setError("사용량 로그를 불러오지 못했습니다.");
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsageLogs(searchCond, 0, pageInfo.size);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (cond) => {
        setSearchCond(cond);
        fetchUsageLogs(cond, 0, pageInfo.size);
    };

    const handlePageChange = (nextPage) => {
        fetchUsageLogs(searchCond, nextPage, pageInfo.size);
    };

    return (
        <AdminLayout title="사용량 로그">
            <Card className="shadow-sm border-0">
                <Card.Body>
                    <AdminUsageLogSearchForm onSearch={handleSearch} />

                    <div className="mb-3 text-muted">
                        총 로그 수: <strong>{pageInfo.totalElements}</strong>건
                    </div>

                    {loading && (
                        <div className="text-center py-5">
                            <Spinner animation="border" />
                        </div>
                    )}

                    {!loading && error && (
                        <Alert variant="danger">{error}</Alert>
                    )}

                    {!loading && !error && (
                        <>
                            <AdminUsageLogsTable logs={logs} />

                            <PagingBar
                                page={pageInfo.page}
                                totalPages={pageInfo.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </Card.Body>
            </Card>
        </AdminLayout>
    );
}

export default AdminUsageLogsPage;