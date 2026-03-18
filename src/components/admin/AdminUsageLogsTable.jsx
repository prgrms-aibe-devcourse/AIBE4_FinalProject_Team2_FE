import { Table, Badge } from "react-bootstrap";

function AdminUsageLogsTable({ logs }) {
    const renderServiceBadge = (serviceType) => {
        switch (serviceType) {
            case "RESUME":
                return <Badge bg="primary">RESUME</Badge>;
            case "INTERVIEW":
                return <Badge bg="success">INTERVIEW</Badge>;
            case "ADMIN":
                return <Badge bg="dark">ADMIN</Badge>;
            default:
                return <Badge bg="secondary">{serviceType}</Badge>;
        }
    };

    return (
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>로그 ID</th>
                <th>회원 ID</th>
                <th>이메일</th>
                <th>서비스</th>
                <th>Amount</th>
                <th>Token</th>
                <th>잔액</th>
                <th>Target</th>
                <th>설명</th>
                <th>생성일</th>
            </tr>
            </thead>

            <tbody>
            {logs.length === 0 ? (
                <tr>
                    <td colSpan="10" className="text-center">
                        조회된 사용량 로그가 없습니다.
                    </td>
                </tr>
            ) : (
                logs.map((log) => (
                    <tr key={log.id}>
                        <td>{log.id}</td>
                        <td>{log.memberId}</td>
                        <td>{log.email}</td>
                        <td>{renderServiceBadge(log.serviceType)}</td>
                        <td>{log.amount}</td>
                        <td>{log.tokenUsage}</td>
                        <td>{log.balanceAfter}</td>
                        <td>
                            {log.targetType || "-"}
                            {log.targetId ? ` / ${log.targetId}` : ""}
                        </td>
                        <td>{log.description || "-"}</td>
                        <td>
                            {log.createdAt
                                ? new Date(log.createdAt).toLocaleString("ko-KR")
                                : "-"}
                        </td>
                    </tr>
                ))
            )}
            </tbody>
        </Table>
    );
}

export default AdminUsageLogsTable;