import AdminLayout from "../../components/admin/AdminLayout";

function OpsQueuePage() {
    return (
        <AdminLayout title="Queue 상태">
            <div>큐 적재, 처리 성공, 실패, 재시도 상태를 표시할 페이지입니다.</div>
        </AdminLayout>
    );
}

export default OpsQueuePage;