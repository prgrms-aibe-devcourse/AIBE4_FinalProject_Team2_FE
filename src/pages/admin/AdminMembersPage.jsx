import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminMemberSearchForm from "../../components/admin/AdminMemberSearchForm";
import AdminMemberTable from "../../components/admin/AdminMemberTable";
import { searchAdminMembers } from "../../api/admin";

function AdminMembersPage() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMembers = async (params = { page: 0, size: 10 }) => {
        try {
            setLoading(true);
            const res = await searchAdminMembers(params);

            const content = res.data?.data?.content || [];
            setMembers(content);
        } catch (error) {
            console.error("회원 목록 조회 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    return (
        <AdminLayout title="회원 관리">
            <AdminMemberSearchForm onSearch={fetchMembers} />

            {loading ? (
                <div>로딩 중...</div>
            ) : (
                <AdminMemberTable members={members} />
            )}
        </AdminLayout>
    );
}

export default AdminMembersPage;