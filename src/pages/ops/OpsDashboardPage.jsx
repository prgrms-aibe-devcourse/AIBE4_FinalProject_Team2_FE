import { useEffect, useState } from "react";
import { Alert, Card, Col, Row, Spinner } from "react-bootstrap";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { getOpsDashboardSummary } from "../../api/ops.js";

function OpsDashboardPage() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await getOpsDashboardSummary();
            const payload = res.data?.data ?? res.data;
            setSummary(payload);
        } catch (e) {
            console.error("운영 대시보드 조회 실패:", e);
            setError("운영 대시보드 데이터를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout title="운영 관제 대시보드">
            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                </div>
            )}

            {!loading && error && (
                <Alert variant="danger">{error}</Alert>
            )}

            {!loading && !error && summary && (
                <>
                    <Row className="g-4 mb-4">
                        <Col md={4} lg={2}>
                            <SummaryCard
                                title="오늘 에러 수"
                                value={summary.todayErrorCount}
                                variant="danger"
                            />
                        </Col>
                        <Col md={4} lg={2}>
                            <SummaryCard
                                title="큐 적재"
                                value={summary.todayQueueEnqueuedCount}
                                variant="primary"
                            />
                        </Col>
                        <Col md={4} lg={2}>
                            <SummaryCard
                                title="큐 성공"
                                value={summary.todayQueueSuccessCount}
                                variant="success"
                            />
                        </Col>
                        <Col md={4} lg={2}>
                            <SummaryCard
                                title="큐 실패"
                                value={summary.todayQueueFailedCount}
                                variant="warning"
                            />
                        </Col>
                        <Col md={4} lg={2}>
                            <SummaryCard
                                title="실패율"
                                value={`${((summary.todayFailureRate ?? 0) * 100).toFixed(1)}%`}
                                variant="dark"
                            />
                        </Col>
                        <Col md={4} lg={2}>
                            <SummaryCard
                                title="OPEN CRITICAL"
                                value={summary.openCriticalIssueCount}
                                variant="secondary"
                            />
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col lg={6}>
                            <Card className="shadow-sm border-0">
                                <Card.Body>
                                    <Card.Title className="mb-3">운영 요약</Card.Title>
                                    <ul className="mb-0">
                                        <li>오늘 누적 에러 수: <strong>{summary.todayErrorCount}</strong></li>
                                        <li>오늘 큐 적재 건수: <strong>{summary.todayQueueEnqueuedCount}</strong></li>
                                        <li>오늘 큐 성공 건수: <strong>{summary.todayQueueSuccessCount}</strong></li>
                                        <li>오늘 큐 실패 건수: <strong>{summary.todayQueueFailedCount}</strong></li>
                                        <li>오늘 큐 실패율: <strong>{((summary.todayFailureRate ?? 0) * 100).toFixed(1)}%</strong></li>
                                        <li>현재 OPEN 상태의 CRITICAL 이슈: <strong>{summary.openCriticalIssueCount}</strong></li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col lg={6}>
                            <Card className="shadow-sm border-0">
                                <Card.Body>
                                    <Card.Title className="mb-3">운영 해석 가이드</Card.Title>
                                    <ul className="mb-0">
                                        <li>큐 실패율이 높으면 AI 비동기 처리 안정성을 점검해야 합니다.</li>
                                        <li>에러 수가 급증하면 최근 배포나 특정 기능 흐름을 함께 확인해야 합니다.</li>
                                        <li>OPEN 상태 CRITICAL 이슈는 우선 대응 대상입니다.</li>
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </AdminLayout>
    );
}

function SummaryCard({ title, value, variant = "primary" }) {
    return (
        <Card className="shadow-sm border-0 h-100">
            <Card.Body>
                <div className={`text-${variant} small fw-semibold mb-2`}>{title}</div>
                <div style={{ fontSize: "1.8rem", fontWeight: "700" }}>{value ?? 0}</div>
            </Card.Body>
        </Card>
    );
}

export default OpsDashboardPage;