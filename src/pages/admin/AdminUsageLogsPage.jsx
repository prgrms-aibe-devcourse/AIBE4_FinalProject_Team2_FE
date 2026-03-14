import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import AdminLayout from "../../components/admin/AdminLayout";
import { searchAdminUsageLogs } from "../../api/admin";

const initialForm = {
    memberId: "",
    nickname: "",
    email: "",
    serviceType: "",
    from: "",
    to: "",
    targetType: "",
    page: 0,
    size: 10,
};

function AdminUsageLogsPage() {
    const [form, setForm] = useState(initialForm);
    const [logs, setLogs] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchLogs = async (params = initialForm) => {
        try {
            setLoading(true);
            setMessage("");

            const cleanedParams = {
                memberId: params.memberId || undefined,
                nickname: params.nickname || undefined,
                email: params.email || undefined,
                serviceType: params.serviceType || undefined,
                from: params.from || undefined,
                to: params.to || undefined,
                targetType: params.targetType || undefined,
                page: params.page ?? 0,
                size: params.size ?? 10,
            };

            const res = await searchAdminUsageLogs(cleanedParams);
            const content = res.data?.data?.content ?? res.data?.content ?? [];

            setLogs(content);
        } catch (error) {
            console.error("사용량 로그 조회 실패:", error);
            setMessage("사용량 로그를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(initialForm);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchLogs({ ...form, page: 0 });
    };

    const handleReset = () => {
        setForm(initialForm);
        setMessage("");
        fetchLogs(initialForm);
    };

    return (
        <AdminLayout title="사용량 로그">
            {message && <Alert variant="info">{message}</Alert>}

            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <Card.Title className="mb-3">로그 검색</Card.Title>

                    <Form onSubmit={handleSearch}>
                        <Row className="g-3">
                            <Col md={2}>
                                <Form.Control
                                    name="memberId"
                                    type="number"
                                    placeholder="회원 ID"
                                    value={form.memberId}
                                    onChange={handleChange}
                                />
                            </Col>

                            <Col md={2}>
                                <Form.Control
                                    name="nickname"
                                    placeholder="닉네임"
                                    value={form.nickname}
                                    onChange={handleChange}
                                />
                            </Col>

                            <Col md={2}>
                                <Form.Control
                                    name="email"
                                    placeholder="이메일"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </Col>

                            <Col md={2}>
                                <Form.Select
                                    name="serviceType"
                                    value={form.serviceType}
                                    onChange={handleChange}
                                >
                                    <option value="">전체 서비스</option>
                                    <option value="RESUME">RESUME</option>
                                    <option value="INTERVIEW">INTERVIEW</option>
                                    <option value="ADMIN">ADMIN</option>
                                </Form.Select>
                            </Col>

                            <Col md={2}>
                                <Form.Control
                                    name="targetType"
                                    placeholder="targetType"
                                    value={form.targetType}
                                    onChange={handleChange}
                                />
                            </Col>

                            <Col md={1}>
                                <Button type="submit" className="w-100">
                                    검색
                                </Button>
                            </Col>

                            <Col md={1}>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="w-100"
                                    onClick={handleReset}
                                >
                                    초기화
                                </Button>
                            </Col>

                            <Col md={2}>
                                <Form.Control
                                    name="from"
                                    type="date"
                                    value={form.from}
                                    onChange={handleChange}
                                />
                            </Col>

                            <Col md={2}>
                                <Form.Control
                                    name="to"
                                    type="date"
                                    value={form.to}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title className="mb-3">사용량 로그 목록</Card.Title>

                    {loading ? (
                        <div>로딩 중...</div>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>회원 ID</th>
                                <th>이메일</th>
                                <th>서비스 유형</th>
                                <th>처리량</th>
                                <th>토큰 사용량 / 크레딧 변동량</th>
                                <th>잔액</th>
                                <th>대상 유형</th>
                                <th>대상 ID</th>
                                <th>설명</th>
                                <th>로그 기록 시각</th>
                            </tr>
                            </thead>
                            <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="11" className="text-center">
                                        조회된 로그가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id}>
                                        <td>{log.id}</td>
                                        <td>{log.memberId}</td>
                                        <td>{log.email}</td>
                                        <td>{log.serviceType}</td>
                                        <td>{log.amount}</td>
                                        <td>{log.tokenUsage}</td>
                                        <td>{log.balanceAfter}</td>
                                        <td>{log.targetType || "-"}</td>
                                        <td>{log.targetId ?? "-"}</td>
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
                    )}
                </Card.Body>
            </Card>
        </AdminLayout>
    );
}

export default AdminUsageLogsPage;