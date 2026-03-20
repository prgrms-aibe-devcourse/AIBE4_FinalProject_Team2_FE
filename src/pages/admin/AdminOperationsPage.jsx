import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Form,
    Row,
    Spinner
} from "react-bootstrap";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import {
    getAdminOperationTargetDetail,
    retryAdminOperation,
    cancelAdminOperation
} from "../../api/admin.js";

function AdminOperationsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [targetType, setTargetType] = useState("ANALYSIS_REPORT");
    const [targetId, setTargetId] = useState("");
    const [reason, setReason] = useState("");

    const [detail, setDetail] = useState(null);

    const [loadingDetail, setLoadingDetail] = useState(false);
    const [submittingRetry, setSubmittingRetry] = useState(false);
    const [submittingCancel, setSubmittingCancel] = useState(false);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const qsTargetType = searchParams.get("targetType");
        const qsTargetId = searchParams.get("targetId");

        if (qsTargetType) {
            setTargetType(qsTargetType);
        }

        if (qsTargetId) {
            setTargetId(qsTargetId);
            fetchTargetDetail(qsTargetType || "ANALYSIS_REPORT", qsTargetId);
        }
    }, []);

    const fetchTargetDetail = async (type = targetType, id = targetId) => {
        if (!id) {
            setError("대상 ID를 입력해주세요.");
            setDetail(null);
            return;
        }

        try {
            setLoadingDetail(true);
            setError("");
            setSuccessMessage("");

            const res = await getAdminOperationTargetDetail({
                targetType: type,
                targetId: Number(id)
            });

            const payload = res.data?.data ?? res.data;
            setDetail(payload);
        } catch (e) {
            console.error("운영 제어 대상 조회 실패:", e);
            setDetail(null);
            setError(
                e.response?.data?.message ||
                "대상 정보를 불러오지 못했습니다."
            );
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        fetchTargetDetail();
    };

    const handleRetry = async () => {
        if (!detail) return;

        try {
            setSubmittingRetry(true);
            setError("");
            setSuccessMessage("");

            const body = {
                targetType: detail.targetType,
                targetId: detail.targetId,
                reason: reason || "관리자 재처리 요청"
            };

            const res = await retryAdminOperation(body);
            const payload = res.data?.data ?? res.data;

            setSuccessMessage(
                `${payload.targetType} #${payload.targetId} 재처리 요청이 접수되었습니다.`
            );

            await fetchTargetDetail(detail.targetType, detail.targetId);
        } catch (e) {
            console.error("재처리 요청 실패:", e);
            setError(
                e.response?.data?.message ||
                "재처리 요청에 실패했습니다."
            );
        } finally {
            setSubmittingRetry(false);
        }
    };

    const handleCancel = async () => {
        if (!detail) return;

        try {
            setSubmittingCancel(true);
            setError("");
            setSuccessMessage("");

            const body = {
                targetType: detail.targetType,
                targetId: detail.targetId,
                reason: reason || "관리자 취소 요청"
            };

            const res = await cancelAdminOperation(body);
            const payload = res.data?.data ?? res.data;

            setSuccessMessage(
                `${payload.targetType} #${payload.targetId} 취소 요청이 접수되었습니다.`
            );

            await fetchTargetDetail(detail.targetType, detail.targetId);
        } catch (e) {
            console.error("취소 요청 실패:", e);
            setError(
                e.response?.data?.message ||
                "취소 요청에 실패했습니다."
            );
        } finally {
            setSubmittingCancel(false);
        }
    };

    const renderStatusBadge = (value) => {
        if (!value) return <Badge bg="secondary">-</Badge>;

        const upper = String(value).toUpperCase();

        if (upper === "SUCCESS" || upper === "COMPLETED") {
            return <Badge bg="success">{value}</Badge>;
        }

        if (upper === "FAILED" || upper === "CANCELLED") {
            return <Badge bg="danger">{value}</Badge>;
        }

        if (upper === "PROCESSING") {
            return <Badge bg="primary">{value}</Badge>;
        }

        if (upper === "ENQUEUED" || upper === "PENDING" || upper === "DELAYED") {
            return <Badge bg="warning" text="dark">{value}</Badge>;
        }

        return <Badge bg="secondary">{value}</Badge>;
    };

    const formatDateTime = (value) => {
        if (!value) return "-";
        try {
            return new Date(value).toLocaleString("ko-KR");
        } catch {
            return value;
        }
    };

    const hasLinkedUser =
        detail?.memberId || detail?.memberEmail || detail?.memberNickname;

    return (
        <AdminLayout title="운영 제어">
            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    <div className="mb-3">
                        <h5 className="mb-1">작업 대상 조회</h5>
                        <div className="text-muted small">
                            에러 로그 또는 이슈 화면에서 넘어온 대상 ID를 조회해 현재 상태를 확인하고,
                            필요한 경우 재처리 또는 취소를 수행합니다.
                        </div>
                    </div>

                    <Form onSubmit={handleSearch}>
                        <Row className="g-3 align-items-end">
                            <Col md={3}>
                                <Form.Label>대상 유형</Form.Label>
                                <Form.Select
                                    value={targetType}
                                    onChange={(e) => setTargetType(e.target.value)}
                                >
                                    <option value="ANALYSIS_REPORT">ANALYSIS_REPORT</option>
                                </Form.Select>
                            </Col>

                            <Col md={3}>
                                <Form.Label>대상 ID</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={targetId}
                                    onChange={(e) => setTargetId(e.target.value)}
                                    placeholder="예: 15"
                                />
                            </Col>

                            <Col md={4}>
                                <Form.Label>사유 (선택)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="재처리 또는 취소 사유"
                                />
                            </Col>

                            <Col md={2}>
                                <Button type="submit" className="w-100" disabled={loadingDetail}>
                                    {loadingDetail ? "조회 중..." : "상세 조회"}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Alert variant="success" className="mb-4">
                    {successMessage}
                </Alert>
            )}

            {loadingDetail && (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                </div>
            )}

            {!loadingDetail && detail && (
                <>
                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                                <div>
                                    <h5 className="mb-1">대상 상세 정보</h5>
                                    <div className="text-muted small">
                                        조회한 대상의 현재 처리 상태와 최근 큐 상태를 확인할 수 있습니다.
                                    </div>
                                </div>

                                <div className="d-flex gap-2 flex-wrap">
                                    {detail.targetType && detail.targetId && (
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() =>
                                                navigate(`/ops/logs?targetType=${encodeURIComponent(detail.targetType)}&targetId=${detail.targetId}`)
                                            }
                                            disabled
                                        >
                                            연관 로그 조회 준비
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <Row className="g-3">
                                <Col md={6}>
                                    <div className="border rounded p-3 h-100">
                                        <div className="text-muted small mb-2">작업 기본 정보</div>
                                        <div className="mb-2"><strong>대상 유형:</strong> {detail.targetType}</div>
                                        <div className="mb-2"><strong>대상 ID:</strong> {detail.targetId}</div>
                                        <div className="mb-2"><strong>현재 상태:</strong> {renderStatusBadge(detail.currentStatus)}</div>
                                        <div className="mb-2"><strong>최근 큐 상태:</strong> {renderStatusBadge(detail.latestQueueStatus)}</div>
                                        <div className="mb-2"><strong>재시도 횟수:</strong> {detail.retryCount ?? 0}</div>
                                        <div className="mb-0"><strong>마지막 처리 시각:</strong> {formatDateTime(detail.lastProcessedAt)}</div>
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="border rounded p-3 h-100">
                                        <div className="text-muted small mb-2">연관 사용자 / 최근 오류</div>
                                        <div className="mb-2"><strong>회원 ID:</strong> {detail.memberId ?? "-"}</div>
                                        <div className="mb-2"><strong>이메일:</strong> {detail.memberEmail ?? "-"}</div>
                                        <div className="mb-2"><strong>닉네임:</strong> {detail.memberNickname ?? "-"}</div>
                                        <div className="mb-0">
                                            <strong>최근 오류 메시지:</strong>
                                            <div className="mt-1 small text-break">
                                                {detail.latestErrorMessage || "-"}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <div className="mt-3">
                                <small className="text-muted">
                                    {!hasLinkedUser
                                        ? "이 대상은 현재 사용자 정보가 연결되지 않았거나, 로그에 사용자 정보가 기록되지 않았습니다."
                                        : "연관 사용자 정보가 함께 확인됩니다."}
                                </small>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <h5 className="mb-3">작업 제어</h5>

                            <Row className="g-3 mb-3">
                                <Col md={6}>
                                    <div className="border rounded p-3 h-100">
                                        <div className="fw-semibold mb-2">재처리</div>
                                        <div className="text-muted small">
                                            실패, 지연, 취소 상태의 작업을 다시 실행 대상으로 돌려보낼 때 사용합니다.
                                            보통 일시적인 외부 API 오류, 큐 처리 누락, 복구 후 재실행 상황에서 사용합니다.
                                        </div>
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="border rounded p-3 h-100">
                                        <div className="fw-semibold mb-2">취소</div>
                                        <div className="text-muted small">
                                            아직 완료되지 않은 작업을 더 이상 진행하지 않도록 중단할 때 사용합니다.
                                            중복 요청, 잘못된 입력, 운영자가 의도적으로 중단해야 하는 상황에 사용합니다.
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <div className="d-flex gap-2 flex-wrap">
                                <Button
                                    variant="primary"
                                    onClick={handleRetry}
                                    disabled={!detail.retryable || submittingRetry}
                                >
                                    {submittingRetry ? "재처리 요청 중..." : "재처리"}
                                </Button>

                                <Button
                                    variant="outline-danger"
                                    onClick={handleCancel}
                                    disabled={!detail.cancellable || submittingCancel}
                                >
                                    {submittingCancel ? "취소 요청 중..." : "취소"}
                                </Button>
                            </div>

                            <div className="mt-3 small text-muted">
                                {!detail.retryable && "현재 상태에서는 재처리가 불가능합니다. "}
                                {!detail.cancellable && "현재 상태에서는 취소가 불가능합니다."}
                            </div>
                        </Card.Body>
                    </Card>
                </>
            )}
        </AdminLayout>
    );
}

export default AdminOperationsPage;