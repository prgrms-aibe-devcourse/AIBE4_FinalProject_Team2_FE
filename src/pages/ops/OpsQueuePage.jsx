import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { getOpsQueueHourly, getOpsQueueSummary } from "../../api/ops.js";

function OpsQueuePage() {
    const today = new Date().toISOString().slice(0, 10);

    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    const [summary, setSummary] = useState(null);
    const [rows, setRows] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchQueueData(startDate, endDate, true);
    }, []);

    const getDateRange = (start, end) => {
        const dates = [];
        const current = new Date(start);
        const last = new Date(end);

        while (current <= last) {
            dates.push(current.toISOString().slice(0, 10));
            current.setDate(current.getDate() + 1);
        }
        return dates;
    };

    const fetchQueueData = async (from, to, isInitial = false) => {
        try {
            setLoading(true);
            setError("");

            if (from > to) {
                setError("시작일은 종료일보다 늦을 수 없습니다.");
                setLoading(false);
                return;
            }

            const dates = getDateRange(from, to);

            const [summaryRes, ...hourlyResponses] = await Promise.all([
                getOpsQueueSummary(),
                ...dates.map((date) => getOpsQueueHourly({ date }))
            ]);

            const summaryPayload = summaryRes.data?.data ?? summaryRes.data;

            const mergedRows = [];
            for (let i = 0; i < hourlyResponses.length; i++) {
                const payload = hourlyResponses[i].data?.data ?? hourlyResponses[i].data;
                const targetDate = dates[i];

                if (Array.isArray(payload)) {
                    payload.forEach((row) => {
                        mergedRows.push({
                            date: targetDate,
                            hour: row.hour,
                            serviceType: row.serviceType,
                            queueEnqueuedCount: row.queueEnqueuedCount ?? row.enqueuedCount ?? 0,
                            queueSuccessCount: row.queueSuccessCount ?? row.successCount ?? 0,
                            queueFailedCount: row.queueFailedCount ?? row.failedCount ?? 0,
                            failureRate: row.failureRate ?? 0
                        });
                    });
                }
            }

            setSummary(summaryPayload);
            setRows(mergedRows);
        } catch (e) {
            console.error("큐 통계 조회 실패:", e);
            setError("큐 통계를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchQueueData(startDate, endDate);
    };

    const handleReset = () => {
        setStartDate(today);
        setEndDate(today);
        fetchQueueData(today, today);
    };

    const aggregatedByService = useMemo(() => {
        const map = {};

        rows.forEach((row) => {
            const key = row.serviceType || "UNKNOWN";
            if (!map[key]) {
                map[key] = {
                    serviceType: key,
                    queueEnqueuedCount: 0,
                    queueSuccessCount: 0,
                    queueFailedCount: 0
                };
            }

            map[key].queueEnqueuedCount += row.queueEnqueuedCount ?? 0;
            map[key].queueSuccessCount += row.queueSuccessCount ?? 0;
            map[key].queueFailedCount += row.queueFailedCount ?? 0;
        });

        return Object.values(map).map((item) => ({
            ...item,
            failureRate:
                item.queueEnqueuedCount === 0
                    ? 0
                    : item.queueFailedCount / item.queueEnqueuedCount
        }));
    }, [rows]);

    const periodTotals = useMemo(() => {
        const totals = {
            queueEnqueuedCount: 0,
            queueSuccessCount: 0,
            queueFailedCount: 0
        };

        rows.forEach((row) => {
            totals.queueEnqueuedCount += row.queueEnqueuedCount ?? 0;
            totals.queueSuccessCount += row.queueSuccessCount ?? 0;
            totals.queueFailedCount += row.queueFailedCount ?? 0;
        });

        return {
            ...totals,
            failureRate:
                totals.queueEnqueuedCount === 0
                    ? 0
                    : totals.queueFailedCount / totals.queueEnqueuedCount
        };
    }, [rows]);

    return (
        <AdminLayout title="Queue 상태">
            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    <div className="mb-3">
                        <h5 className="mb-2">큐 상태 안내</h5>
                        <div className="text-muted" style={{ fontSize: "14px", lineHeight: 1.7 }}>
                            이 화면은 큐 작업의 전체 상태와 시간대별 처리 흐름을 함께 보여줍니다.
                            상단 카드는 현재 전체 큐 상태 기준이며,
                            아래 표와 집계는 선택한 조회 기간 기준입니다.
                        </div>
                    </div>

                    <Form onSubmit={handleSearch}>
                        <Row className="g-3 align-items-end">
                            <Col md={4}>
                                <Form.Label>시작일</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </Col>

                            <Col md={4}>
                                <Form.Label>종료일</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Col>

                            <Col md="auto">
                                <Button type="submit">조회</Button>
                            </Col>

                            <Col md="auto">
                                <Button type="button" variant="secondary" onClick={handleReset}>
                                    초기화
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

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
                    <Row className="g-3 mb-4">
                        <Col md={4} xl={2}>
                            <SummaryCard
                                title="현재 대기"
                                value={summary?.enqueuedCount ?? 0}
                                subtitle="전체 큐 기준"
                            />
                        </Col>
                        <Col md={4} xl={2}>
                            <SummaryCard
                                title="현재 처리 중"
                                value={summary?.processingCount ?? 0}
                                subtitle="전체 큐 기준"
                            />
                        </Col>
                        <Col md={4} xl={2}>
                            <SummaryCard
                                title="현재 성공"
                                value={summary?.successCount ?? 0}
                                subtitle="전체 큐 기준"
                            />
                        </Col>
                        <Col md={4} xl={2}>
                            <SummaryCard
                                title="현재 실패"
                                value={summary?.failedCount ?? 0}
                                subtitle="전체 큐 기준"
                            />
                        </Col>
                        <Col md={4} xl={2}>
                            <SummaryCard
                                title="현재 취소"
                                value={summary?.cancelledCount ?? 0}
                                subtitle="전체 큐 기준"
                            />
                        </Col>
                        <Col md={4} xl={2}>
                            <SummaryCard
                                title="현재 성공률"
                                value={
                                    summary?.successRate != null
                                        ? `${Number(summary.successRate).toFixed(1)}%`
                                        : "0.0%"
                                }
                                subtitle="전체 큐 기준"
                            />
                        </Col>
                    </Row>

                    <Row className="g-3 mb-4">
                        <Col md={3}>
                            <SummaryCard
                                title="조회 기간 적재"
                                value={periodTotals.queueEnqueuedCount}
                                subtitle={`${startDate} ~ ${endDate}`}
                            />
                        </Col>
                        <Col md={3}>
                            <SummaryCard
                                title="조회 기간 성공"
                                value={periodTotals.queueSuccessCount}
                                subtitle={`${startDate} ~ ${endDate}`}
                            />
                        </Col>
                        <Col md={3}>
                            <SummaryCard
                                title="조회 기간 실패"
                                value={periodTotals.queueFailedCount}
                                subtitle={`${startDate} ~ ${endDate}`}
                            />
                        </Col>
                        <Col md={3}>
                            <SummaryCard
                                title="조회 기간 실패율"
                                value={`${(periodTotals.failureRate * 100).toFixed(1)}%`}
                                subtitle={`${startDate} ~ ${endDate}`}
                            />
                        </Col>
                    </Row>

                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Body>
                            <Card.Title className="mb-3">서비스별 집계</Card.Title>
                            <Table striped bordered hover responsive>
                                <thead>
                                <tr>
                                    <th>서비스</th>
                                    <th>적재</th>
                                    <th>성공</th>
                                    <th>실패</th>
                                    <th>실패율</th>
                                </tr>
                                </thead>
                                <tbody>
                                {aggregatedByService.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            조회된 서비스별 집계 데이터가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    aggregatedByService.map((row) => (
                                        <tr key={row.serviceType}>
                                            <td>{row.serviceType}</td>
                                            <td>{row.queueEnqueuedCount}</td>
                                            <td>{row.queueSuccessCount}</td>
                                            <td>{row.queueFailedCount}</td>
                                            <td>{(row.failureRate * 100).toFixed(1)}%</td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <Card.Title className="mb-3">시간 단위 큐 현황</Card.Title>

                            <Table striped bordered hover responsive>
                                <thead>
                                <tr>
                                    <th>날짜</th>
                                    <th>시간</th>
                                    <th>서비스</th>
                                    <th>적재</th>
                                    <th>성공</th>
                                    <th>실패</th>
                                    <th>실패율</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            조회된 데이터가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((row, idx) => (
                                        <tr key={`${row.date}-${row.serviceType}-${row.hour}-${idx}`}>
                                            <td>{row.date}</td>
                                            <td>{String(row.hour).padStart(2, "0")}:00</td>
                                            <td>{row.serviceType}</td>
                                            <td>{row.queueEnqueuedCount ?? 0}</td>
                                            <td>{row.queueSuccessCount ?? 0}</td>
                                            <td>{row.queueFailedCount ?? 0}</td>
                                            <td>{((row.failureRate ?? 0) * 100).toFixed(1)}%</td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </Table>

                            <div className="text-muted mt-2" style={{ fontSize: "13px" }}>
                                실패율은 적재 대비 실패 비율입니다. 특정 서비스에서 특정 시간대에 실패가 몰리는지 확인할 때 유용합니다.
                            </div>
                        </Card.Body>
                    </Card>
                </>
            )}
        </AdminLayout>
    );
}

function SummaryCard({ title, value, subtitle }) {
    return (
        <Card className="border-0 shadow-sm h-100">
            <Card.Body>
                <div className="text-muted" style={{ fontSize: "14px" }}>{title}</div>
                <div style={{ fontSize: "28px", fontWeight: 700 }}>{value}</div>
                <div className="text-muted mt-1" style={{ fontSize: "12px" }}>
                    {subtitle}
                </div>
            </Card.Body>
        </Card>
    );
}

export default OpsQueuePage;