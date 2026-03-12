import { useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import AdminLayout from "../../components/admin/AdminLayout";
import {
    getAdminDailyUsage,
    getAdminMemberUsageSummary,
    getAdminServiceUsageSummary,
} from "../../api/admin";

function AdminUsageStatisticsPage() {
    const today = new Date().toISOString().slice(0, 10);

    const [dailyDate, setDailyDate] = useState(today);
    const [dailyRows, setDailyRows] = useState([]);

    const [serviceSummary, setServiceSummary] = useState(null);

    const [memberId, setMemberId] = useState("");
    const [memberSummary, setMemberSummary] = useState(null);

    const [message, setMessage] = useState("");

    const fetchDailyUsage = async () => {
        try {
            const res = await getAdminDailyUsage(dailyDate);
            const data = res.data?.data ?? res.data;
            setDailyRows(data || []);
        } catch (error) {
            console.error("일별 사용량 조회 실패:", error);
            setMessage("일별 사용량 조회에 실패했습니다.");
        }
    };

    const fetchServiceSummary = async () => {
        try {
            const res = await getAdminServiceUsageSummary();
            const data = res.data?.data ?? res.data;
            setServiceSummary(data);
        } catch (error) {
            console.error("서비스 요약 조회 실패:", error);
            setMessage("서비스 요약 조회에 실패했습니다.");
        }
    };

    const fetchMemberSummary = async () => {
        if (!memberId) return;

        try {
            const res = await getAdminMemberUsageSummary(memberId);
            const data = res.data?.data ?? res.data;
            setMemberSummary(data);
        } catch (error) {
            console.error("회원 사용량 요약 조회 실패:", error);
            setMessage("회원 사용량 요약 조회에 실패했습니다.");
        }
    };

    return (
        <AdminLayout title="사용량 통계">
            {message && <Alert variant="info">{message}</Alert>}

            <Row className="g-4">
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-3">전체 서비스 사용 요약</Card.Title>
                            <Button onClick={fetchServiceSummary} className="mb-3">
                                전체 서비스 요약 조회
                            </Button>

                            {serviceSummary && (
                                <Row>
                                    <Col md={3}><strong>자소서 사용:</strong> {serviceSummary.resumeUsage}</Col>
                                    <Col md={3}><strong>면접 사용:</strong> {serviceSummary.interviewUsage}</Col>
                                    <Col md={3}><strong>관리자 작업:</strong> {serviceSummary.adminOperations}</Col>
                                    <Col md={3}><strong>전체 사용량:</strong> {serviceSummary.totalUsage}</Col>
                                </Row>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={7}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-3">일별 사용량 조회</Card.Title>

                            <Row className="g-2 align-items-end mb-3">
                                <Col md={4}>
                                    <Form.Label>날짜</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={dailyDate}
                                        onChange={(e) => setDailyDate(e.target.value)}
                                    />
                                </Col>
                                <Col md={3}>
                                    <Button onClick={fetchDailyUsage}>조회</Button>
                                </Col>
                            </Row>

                            <Table striped bordered hover responsive>
                                <thead>
                                <tr>
                                    <th>서비스</th>
                                    <th>총 Count</th>
                                    <th>총 Token</th>
                                    <th>로그 수</th>
                                </tr>
                                </thead>
                                <tbody>
                                {dailyRows.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            조회 결과가 없습니다.
                                        </td>
                                    </tr>
                                ) : (
                                    dailyRows.map((row) => (
                                        <tr key={row.serviceType}>
                                            <td>{row.serviceType}</td>
                                            <td>{row.totalCount}</td>
                                            <td>{row.totalTokenUsage}</td>
                                            <td>{row.logCount}</td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={5}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-3">회원별 사용량 요약</Card.Title>

                            <Form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    fetchMemberSummary();
                                }}
                            >
                                <Form.Group className="mb-3">
                                    <Form.Label>회원 ID</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={memberId}
                                        onChange={(e) => setMemberId(e.target.value)}
                                        placeholder="회원 ID 입력"
                                    />
                                </Form.Group>

                                <Button type="submit" className="mb-3">조회</Button>
                            </Form>

                            {memberSummary && (
                                <>
                                    <div className="mb-2"><strong>회원 ID:</strong> {memberSummary.memberId}</div>
                                    <div className="mb-2"><strong>이메일:</strong> {memberSummary.email}</div>
                                    <div className="mb-2"><strong>현재 크레딧:</strong> {memberSummary.creditBalance}</div>
                                    <div className="mb-2"><strong>총 로그 수:</strong> {memberSummary.totalLogCount}</div>
                                    <div className="mb-2"><strong>총 토큰 사용량:</strong> {memberSummary.totalTokenUsage}</div>
                                    <div className="mb-2"><strong>자소서 사용:</strong> {memberSummary.resumeUsageCount}</div>
                                    <div><strong>면접 사용:</strong> {memberSummary.interviewUsageCount}</div>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </AdminLayout>
    );
}

export default AdminUsageStatisticsPage;