import { useEffect, useState } from "react";
import { Alert, Card, Spinner } from "react-bootstrap";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import AdminMemberSearchForm from "../../components/admin/AdminMemberSearchForm.jsx";
import AdminMemberTable from "../../components/admin/AdminMemberTable.jsx";
import PagingBar from "../../components/admin/PagingBar.jsx";
import { searchAdminMembers } from "../../api/admin.js";

function AdminMembersPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [searchCond, setSearchCond] = useState({
        memberId: undefined,
        email: undefined,
        nickname: undefined,
        status: undefined
    });

    const [pageInfo, setPageInfo] = useState({
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0
    });

    const fetchMembers = async (cond = searchCond, page = pageInfo.page, size = pageInfo.size) => {
        try {
            setLoading(true);
            setError("");

            const params = {
                ...cond,
                page,
                size
            };

            const res = await searchAdminMembers(params);

            // 백엔드 응답: ApiResponse<Page<AdminMemberRow>> 기준
            const pageData = res.data.data;

            setMembers(pageData.content || []);
            setPageInfo({
                page: pageData.number ?? 0,
                size: pageData.size ?? size,
                totalPages: pageData.totalPages ?? 0,
                totalElements: pageData.totalElements ?? 0
            });
        } catch (err) {
            console.error("회원 목록 조회 실패:", err);
            setError("회원 목록을 불러오지 못했습니다.");
            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers(searchCond, 0, pageInfo.size);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (cleanedCond) => {
        const nextCond = {
            memberId: cleanedCond.memberId,
            email: cleanedCond.email,
            nickname: cleanedCond.nickname,
            status: cleanedCond.status
        };

        setSearchCond(nextCond);
        fetchMembers(nextCond, 0, pageInfo.size);
    };

    const handlePageChange = (nextPage) => {
        fetchMembers(searchCond, nextPage, pageInfo.size);
    };

    return (
        <AdminLayout title="회원 관리">
            <Card className="shadow-sm border-0">
                <Card.Body>
                    <AdminMemberSearchForm onSearch={handleSearch} />

                    <div className="mb-3 text-muted">
                        총 회원 수: <strong>{pageInfo.totalElements}</strong>명
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
                            <AdminMemberTable members={members} />

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

export default AdminMembersPage;