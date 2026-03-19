import { useEffect, useState } from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    Modal,
    Pagination,
    Spinner,
    Table
} from "react-bootstrap";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { getOpsIssueLogs, getOpsLogDetail } from "../../api/ops.js";
import { useNavigate, useSearchParams } from "react-router-dom";

function OpsLogsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const issueId = searchParams.get("issueId");

    const [logs, setLogs] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        number: 0,
        totalPages: 0,
        totalElements: 0,
        size: 10
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedLog, setSelectedLog] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        if (!issueId) {
            setError("issueId가 필요합니다.");
            setLoading(false);
            return;
        }

        fetchLogs(0);
    }, [issueId]);

    const fetchLogs = async (page = 0) => {
        try {
            setLoading(true);
            setError("");

            const res = await getOpsIssueLogs(issueId, {
                page,
                size: pageInfo.size
            });

            const payload = res.data?.data ?? res.data;

            setLogs(payload.content ?? []);
            setPageInfo({
                number: payload.number ?? 0,
                totalPages: payload.totalPages ?? 0,
                totalElements: payload.totalElements ?? 0,
                size: payload.size ?? 10
            });
        } catch (e) {
            console.error("에러 로그 목록 조회 실패:", e);
            setError("에러 로그 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetail = async (logId) => {
        try {
            const res = await getOpsLogDetail(logId);
            const payload = res.data?.data ?? res.data;
            setSelectedLog(payload);
            setShowDetailModal(true);
        } catch (e) {
            console.error("에러 로그 상세 조회 실패:", e);
            alert("에러 로그 상세를 불러오지 못했습니다.");
        }
    };

    const moveToOperationControl = (logItem) => {
        if (!logItem?.targetType || !logItem?.targetId) {
            alert("이 로그에는 운영 제어 대상 정보가 없습니다.");
            return;
        }

        navigate(
            `/admin/operations?targetType=${encodeURIComponent(logItem.targetType)}&targetId=${logItem.targetId}`
        );
    };

    return (
        <AdminLayout title="에러 로그 관제">
            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                        <div>
                            <Card.Title className="mb-1">이슈 로그 목록</Card.Title>
                            <div className="text-muted small">
                                현재 보고 있는 이슈 ID: <strong>{issueId ?? "-"}</strong>
                            </div>
                            <div className="text-muted small mt-1">
                                같은 이슈로 묶인 원본 로그들을 시간순으로 확인할 수 있습니다.
                            </div>
                        </div>

                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => navigate("/ops/issues")}
                        >
                            이슈 목록으로 돌아가기
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                </div>
            )}

            {!loading && error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
                <>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                                <Card.Title className="mb-0">로그 목록</Card.Title>
                                <small className="text-muted">
                                    총 {pageInfo.totalElements}건
                                </small>
                            </div>

                            <Table striped bordered hover responsive>
                                <thead>
                                <tr>
                                    <th>로그 ID</th>
                                    <th>에러 코드</th>
                                    <th>예외 타입</th>
                                    <th>심각도</th>
                                    <th>도메인</th>
                                    <th>연관 사용자</th>
                                    <th>대상</th>
                                    <th>발생 시각</th>
                                    <th>액션</th>
                                </tr>
                                </thead>
                                <tbody>
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            조회된 로그가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.logId}>
                                            <td>{log.logId}</td>
                                            <td>{log.errorCode || "-"}</td>
                                            <td>{log.exceptionType}</td>
                                            <td>
                                                <SeverityBadge severity={log.severity} />
                                            </td>
                                            <td>{log.errorDomain}</td>
                                            <td>{log.memberId ?? "-"}</td>
                                            <td>
                                                {log.targetType && log.targetId
                                                    ? `${log.targetType} #${log.targetId}`
                                                    : "-"}
                                            </td>
                                            <td>
                                                {log.occurredAt
                                                    ? new Date(log.occurredAt).toLocaleString("ko-KR")
                                                    : "-"}
                                            </td>
                                            <td className="d-flex gap-2 flex-wrap">
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    onClick={() => handleOpenDetail(log.logId)}
                                                >
                                                    상세
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="outline-dark"
                                                    onClick={() => moveToOperationControl(log)}
                                                    disabled={!log.targetType || !log.targetId}
                                                >
                                                    운영 제어
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </Table>

                            <PagingBar
                                pageInfo={pageInfo}
                                onMove={(page) => fetchLogs(page)}
                            />
                        </Card.Body>
                    </Card>

                    <LogDetailModal
                        show={showDetailModal}
                        onHide={() => setShowDetailModal(false)}
                        logItem={selectedLog}
                        onMoveToOperationControl={moveToOperationControl}
                    />
                </>
            )}
        </AdminLayout>
    );
}

function SeverityBadge({ severity }) {
    let bg = "secondary";
    if (severity === "CRITICAL") bg = "danger";
    else if (severity === "HIGH") bg = "warning";
    else if (severity === "MEDIUM") bg = "primary";
    else if (severity === "LOW") bg = "success";

    return <Badge bg={bg}>{severity}</Badge>;
}

function PagingBar({ pageInfo, onMove }) {
    if (!pageInfo || pageInfo.totalPages <= 1) return null;

    const items = [];
    for (let i = 0; i < pageInfo.totalPages; i++) {
        items.push(
            <Pagination.Item
                key={i}
                active={i === pageInfo.number}
                onClick={() => onMove(i)}
            >
                {i + 1}
            </Pagination.Item>
        );
    }

    return (
        <div className="d-flex justify-content-center mt-3">
            <Pagination>
                <Pagination.Prev
                    disabled={pageInfo.number === 0}
                    onClick={() => onMove(pageInfo.number - 1)}
                />
                {items}
                <Pagination.Next
                    disabled={pageInfo.number >= pageInfo.totalPages - 1}
                    onClick={() => onMove(pageInfo.number + 1)}
                />
            </Pagination>
        </div>
    );
}

function LogDetailModal({ show, onHide, logItem, onMoveToOperationControl }) {
    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>로그 상세</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!logItem ? (
                    <div>데이터가 없습니다.</div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        <div className="border rounded p-3">
                            <div className="text-muted small mb-2">식별 정보</div>
                            <div className="mb-2"><strong>로그 ID:</strong> {logItem.logId}</div>
                            <div className="mb-2"><strong>이슈 ID:</strong> {logItem.issueId ?? "-"}</div>
                            <div className="mb-2"><strong>회원 ID:</strong> {logItem.memberId ?? "-"}</div>
                            <div className="mb-2"><strong>에러 코드:</strong> {logItem.errorCode ?? "-"}</div>
                            <div className="mb-0"><strong>Fingerprint:</strong> {logItem.fingerprint}</div>
                        </div>

                        <div className="border rounded p-3">
                            <div className="text-muted small mb-2">에러 정보</div>
                            <div className="mb-2"><strong>예외 타입:</strong> {logItem.exceptionType}</div>
                            <div className="mb-2"><strong>심각도:</strong> {logItem.severity}</div>
                            <div className="mb-2"><strong>도메인:</strong> {logItem.errorDomain}</div>
                            <div className="mb-2"><strong>메시지:</strong> {logItem.message}</div>
                            <div className="mb-0"><strong>정규화 메시지:</strong> {logItem.normalizedMessage || "-"}</div>
                        </div>

                        <div className="border rounded p-3">
                            <div className="text-muted small mb-2">연관 대상</div>
                            <div className="mb-2"><strong>Trace ID:</strong> {logItem.requestTraceId ?? "-"}</div>
                            <div className="mb-2"><strong>대상 유형:</strong> {logItem.targetType ?? "-"}</div>
                            <div className="mb-2"><strong>대상 ID:</strong> {logItem.targetId ?? "-"}</div>
                            <div className="mb-0">
                                <strong>발생 시각:</strong>{" "}
                                {logItem.occurredAt
                                    ? new Date(logItem.occurredAt).toLocaleString("ko-KR")
                                    : "-"}
                            </div>
                        </div>

                        <div className="d-flex gap-2 flex-wrap">
                            <Button
                                variant="dark"
                                onClick={() => onMoveToOperationControl(logItem)}
                                disabled={!logItem.targetType || !logItem.targetId}
                            >
                                이 로그 기준으로 운영 제어 열기
                            </Button>
                        </div>

                        <div>
                            <strong>Stack Trace</strong>
                            <pre
                                style={{
                                    background: "#f8f9fa",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    maxHeight: "300px",
                                    overflow: "auto",
                                    whiteSpace: "pre-wrap",
                                    marginTop: "8px"
                                }}
                            >
                                {logItem.stackTrace || "-"}
                            </pre>
                        </div>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
}

export default OpsLogsPage;