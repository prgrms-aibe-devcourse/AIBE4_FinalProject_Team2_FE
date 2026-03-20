import { useEffect, useState } from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Form,
    Modal,
    Pagination,
    Row,
    Spinner,
    Table
} from "react-bootstrap";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import { getOpsIssueDetail, getOpsIssues } from "../../api/ops.js";
import { useNavigate } from "react-router-dom";

function OpsIssuesPage() {
    const navigate = useNavigate();

    const [issues, setIssues] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        number: 0,
        totalPages: 0,
        totalElements: 0,
        size: 10
    });

    const [filters, setFilters] = useState({
        status: "",
        severity: "",
        errorDomain: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedIssue, setSelectedIssue] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        fetchIssues(0, filters);
    }, []);

    const fetchIssues = async (page = 0, currentFilters = filters) => {
        try {
            setLoading(true);
            setError("");

            const params = {
                ...currentFilters,
                page,
                size: pageInfo.size
            };

            const res = await getOpsIssues(params);
            const payload = res.data?.data ?? res.data;

            setIssues(payload.content ?? []);
            setPageInfo({
                number: payload.number ?? 0,
                totalPages: payload.totalPages ?? 0,
                totalElements: payload.totalElements ?? 0,
                size: payload.size ?? 10
            });
        } catch (e) {
            console.error("에러 이슈 목록 조회 실패:", e);
            setError("에러 이슈 목록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchIssues(0, filters);
    };

    const handleReset = () => {
        const resetFilters = {
            status: "",
            severity: "",
            errorDomain: ""
        };
        setFilters(resetFilters);
        fetchIssues(0, resetFilters);
    };

    const handleOpenDetail = async (issueId) => {
        try {
            const res = await getOpsIssueDetail(issueId);
            const payload = res.data?.data ?? res.data;
            setSelectedIssue(payload);
            setShowDetailModal(true);
        } catch (e) {
            console.error("이슈 상세 조회 실패:", e);
            alert("이슈 상세 정보를 불러오지 못했습니다.");
        }
    };

    const moveToLogs = (issueId) => {
        navigate(`/ops/logs?issueId=${issueId}`);
    };

    const moveToOperationControl = (issue) => {
        if (!issue?.targetType || !issue?.targetId) {
            alert("이 이슈에는 운영 제어 대상 정보가 없습니다.");
            return;
        }

        navigate(
            `/admin/operations?targetType=${encodeURIComponent(issue.targetType)}&targetId=${issue.targetId}`
        );
    };

    return (
        <AdminLayout title="에러 이슈 관제">
            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    <Form onSubmit={handleSearch}>
                        <Row className="g-3 align-items-end">
                            <Col md={3}>
                                <Form.Label>상태</Form.Label>
                                <Form.Select
                                    value={filters.status}
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, status: e.target.value }))
                                    }
                                >
                                    <option value="">전체</option>
                                    <option value="OPEN">OPEN</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                    <option value="RESOLVED">RESOLVED</option>
                                </Form.Select>
                            </Col>

                            <Col md={3}>
                                <Form.Label>심각도</Form.Label>
                                <Form.Select
                                    value={filters.severity}
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, severity: e.target.value }))
                                    }
                                >
                                    <option value="">전체</option>
                                    <option value="CRITICAL">CRITICAL</option>
                                    <option value="HIGH">HIGH</option>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="LOW">LOW</option>
                                </Form.Select>
                            </Col>

                            <Col md={3}>
                                <Form.Label>도메인</Form.Label>
                                <Form.Select
                                    value={filters.errorDomain}
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, errorDomain: e.target.value }))
                                    }
                                >
                                    <option value="">전체</option>
                                    <option value="AUTH">AUTH</option>
                                    <option value="RESUME">RESUME</option>
                                    <option value="INTERVIEW">INTERVIEW</option>
                                    <option value="FILE">FILE</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="STATISTICS">STATISTICS</option>
                                    <option value="GLOBAL">GLOBAL</option>
                                </Form.Select>
                            </Col>

                            <Col md="auto">
                                <Button type="submit">조회</Button>
                            </Col>

                            <Col md="auto">
                                <Button variant="secondary" onClick={handleReset}>
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

            {!loading && error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
                <>
                    <Card className="shadow-sm border-0">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                                <div>
                                    <Card.Title className="mb-0">이슈 목록</Card.Title>
                                    <small className="text-muted">
                                        같은 유형의 에러를 하나의 이슈로 묶어서 보여줍니다.
                                    </small>
                                </div>

                                <small className="text-muted">
                                    총 {pageInfo.totalElements}건
                                </small>
                            </div>

                            <Table striped bordered hover responsive>
                                <thead>
                                <tr>
                                    <th>이슈 ID</th>
                                    <th>제목</th>
                                    <th>에러 코드</th>
                                    <th>심각도</th>
                                    <th>상태</th>
                                    <th>도메인</th>
                                    <th>발생 횟수</th>
                                    <th>최근 발생</th>
                                    <th>액션</th>
                                </tr>
                                </thead>
                                <tbody>
                                {issues.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            조회된 이슈가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    issues.map((issue) => (
                                        <tr key={issue.issueId}>
                                            <td>{issue.issueId}</td>
                                            <td>{issue.title}</td>
                                            <td>{issue.errorCode || "-"}</td>
                                            <td>
                                                <SeverityBadge severity={issue.severity} />
                                            </td>
                                            <td>
                                                <StatusBadge status={issue.status} />
                                            </td>
                                            <td>{issue.errorDomain}</td>
                                            <td>{issue.occurrenceCount}</td>
                                            <td>
                                                {issue.lastOccurredAt
                                                    ? new Date(issue.lastOccurredAt).toLocaleString("ko-KR")
                                                    : "-"}
                                            </td>
                                            <td className="d-flex gap-2 flex-wrap">
                                                <Button
                                                    size="sm"
                                                    variant="outline-primary"
                                                    onClick={() => handleOpenDetail(issue.issueId)}
                                                >
                                                    상세
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline-dark"
                                                    onClick={() => moveToLogs(issue.issueId)}
                                                >
                                                    로그
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </Table>

                            <PagingBar
                                pageInfo={pageInfo}
                                onMove={(page) => fetchIssues(page)}
                            />
                        </Card.Body>
                    </Card>

                    <IssueDetailModal
                        show={showDetailModal}
                        onHide={() => setShowDetailModal(false)}
                        issue={selectedIssue}
                        onMoveToLogs={moveToLogs}
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

function StatusBadge({ status }) {
    let bg = "secondary";
    if (status === "OPEN") bg = "danger";
    else if (status === "IN_PROGRESS") bg = "warning";
    else if (status === "RESOLVED") bg = "success";

    return <Badge bg={bg}>{status}</Badge>;
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

function IssueDetailModal({ show, onHide, issue, onMoveToLogs, onMoveToOperationControl }) {
    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>이슈 상세</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!issue ? (
                    <div>데이터가 없습니다.</div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        <div className="border rounded p-3">
                            <div className="text-muted small mb-2">이슈 기본 정보</div>
                            <div className="mb-2"><strong>이슈 ID:</strong> {issue.issueId}</div>
                            <div className="mb-2"><strong>제목:</strong> {issue.title}</div>
                            <div className="mb-2"><strong>에러 코드:</strong> {issue.errorCode || "-"}</div>
                            <div className="mb-2"><strong>심각도:</strong> {issue.severity}</div>
                            <div className="mb-2"><strong>상태:</strong> {issue.status}</div>
                            <div className="mb-2"><strong>도메인:</strong> {issue.errorDomain}</div>
                            <div className="mb-2"><strong>발생 횟수:</strong> {issue.occurrenceCount}</div>
                            <div className="mb-2"><strong>Fingerprint:</strong> {issue.fingerprint}</div>
                            <div className="mb-2">
                                <strong>최초 발생:</strong>{" "}
                                {issue.firstOccurredAt
                                    ? new Date(issue.firstOccurredAt).toLocaleString("ko-KR")
                                    : "-"}
                            </div>
                            <div className="mb-2">
                                <strong>최근 발생:</strong>{" "}
                                {issue.lastOccurredAt
                                    ? new Date(issue.lastOccurredAt).toLocaleString("ko-KR")
                                    : "-"}
                            </div>
                            <div className="mb-0"><strong>최근 에러 로그 ID:</strong> {issue.lastErrorLogId ?? "-"}</div>
                        </div>

                        <div className="border rounded p-3">
                            <div className="text-muted small mb-2">연관 대상 / 사용자</div>
                            <div className="mb-2"><strong>대상 유형:</strong> {issue.targetType ?? "-"}</div>
                            <div className="mb-2"><strong>대상 ID:</strong> {issue.targetId ?? "-"}</div>
                            <div className="mb-2"><strong>연관 회원 ID:</strong> {issue.memberId ?? "-"}</div>
                            <div className="mb-2"><strong>연관 회원 이메일:</strong> {issue.memberEmail ?? "-"}</div>
                            <div className="mb-0"><strong>연관 회원 닉네임:</strong> {issue.memberNickname ?? "-"}</div>
                        </div>

                        <div className="d-flex gap-2 flex-wrap">
                            <Button
                                variant="outline-dark"
                                onClick={() => {
                                    onHide();
                                    onMoveToLogs(issue.issueId);
                                }}
                            >
                                이 이슈의 로그 보기
                            </Button>

                            <Button
                                variant="primary"
                                onClick={() => {
                                    onHide();
                                    onMoveToOperationControl(issue);
                                }}
                                disabled={!issue.targetType || !issue.targetId}
                            >
                                운영 제어로 이동
                            </Button>
                        </div>

                        <div className="small text-muted">
                            이슈 ID는 같은 유형의 에러 묶음 ID이고,
                            최근 에러 로그 ID는 실제 원본 로그 한 건의 ID입니다.
                            대상 ID는 실제 작업 대상 ID이며, 현재는 분석 리포트 같은 비동기 작업을 가리킵니다.
                        </div>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
}

export default OpsIssuesPage;