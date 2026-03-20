import { useEffect, useState } from "react";
import { Alert, Badge, Card, Spinner, Table } from "react-bootstrap";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { getOpsAlerts } from "../../api/ops.js";

function OpsAlertsPage() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getOpsAlerts();
            const payload = response.data?.data ?? response.data;
            setAlerts(Array.isArray(payload) ? payload : []);
        } catch (err) {
            console.error("운영 알림 조회 실패:", err);
            setError("운영 알림 데이터를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const renderLevelBadge = (level) => {
        switch (level) {
            case "CRITICAL":
                return <Badge bg="danger">CRITICAL</Badge>;
            case "HIGH":
                return <Badge bg="warning" text="dark">HIGH</Badge>;
            case "MEDIUM":
                return <Badge bg="primary">MEDIUM</Badge>;
            default:
                return <Badge bg="secondary">{level || "INFO"}</Badge>;
        }
    };

    return (
        <AdminLayout title="Alerts">
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <h5 className="mb-2">운영 알림 안내</h5>
                    <div className="text-muted" style={{ fontSize: "14px", lineHeight: 1.7 }}>
                        Alerts는 운영 중 즉시 확인이 필요한 이상 징후를 보여주는 화면입니다.
                        현재는 큐 실패 건수, 실패율, 미해결 Critical 이슈를 기준으로 경보를 생성합니다.
                    </div>
                </Card.Body>
            </Card>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Card className="border-0 shadow-sm">
                    <Card.Body>
                        <Table responsive bordered hover>
                            <thead>
                            <tr>
                                <th>레벨</th>
                                <th>유형</th>
                                <th>메시지</th>
                                <th>관련 ID</th>
                            </tr>
                            </thead>
                            <tbody>
                            {alerts.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        현재 발생한 운영 알림이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                alerts.map((alertItem, idx) => (
                                    <tr key={idx}>
                                        <td>{renderLevelBadge(alertItem.level)}</td>
                                        <td>{alertItem.type}</td>
                                        <td>{alertItem.message}</td>
                                        <td>{alertItem.relatedId ?? "-"}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
        </AdminLayout>
    );
}

export default OpsAlertsPage;