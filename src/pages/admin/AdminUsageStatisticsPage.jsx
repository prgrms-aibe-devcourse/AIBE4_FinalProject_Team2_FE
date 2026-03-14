import { useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import AdminLayout from "../../components/admin/AdminLayout";
import {
    getAdminDailyUsage,
    getAdminMemberUsageSummary,
    getAdminServiceUsageSummary,
    searchAdminMembers,
} from "../../api/admin";

function AdminUsageStatisticsPage() {
    const today = new Date().toISOString().slice(0, 10);

    const [dailyDate, setDailyDate] = useState(today);
    const [dailyRows, setDailyRows] = useState([]);

    const [serviceSummary, setServiceSummary] = useState(null);

    const [memberId, setMemberId] = useState("");
    const [memberNickname, setMemberNickname] = useState("");
    const [memberEmail, setMemberEmail] = useState("");
    const [memberSummary, setMemberSummary] = useState(null);

    const [message, setMessage] = useState("");

    const fetchDailyUsage = async () => {
        try {
            setMessage("");
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
            setMessage("");
            const res = await getAdminServiceUsageSummary();
            const data = res.data?.data ?? res.data;
            setServiceSummary(data);
        } catch (error) {
            console.error("서비스 요약 조회 실패:", error);
            setMessage("서비스 요약 조회에 실패했습니다.");
        }
    };

    const fetchMemberSummary = async () => {
        try {
            setMessage("");
            setMemberSummary(null);

            let targetMemberId = memberId;

            if (!targetMemberId && !memberNickname.trim() && !memberEmail.trim()) {
                setMessage("회원 ID, 닉네임, 이메일 중 하나를 입력해주세요.");
                return;
            }

            // 1) memberId가 없으면 nickname/email로 회원 검색
            if (!targetMemberId) {
                const searchRes = await searchAdminMembers({
                    nickname: memberNickname || undefined,
                    email: memberEmail || undefined,
                    page: 0,
                    size: 1,
                });

                const members = searchRes.data?.data?.content ?? [];
                const firstMember = members[0];

                if (!firstMember) {
                    setMessage("일치하는 회원이 없습니다.");
                    return;
                }

                targetMemberId = firstMember.memberId;
                setMemberId(String(firstMember.memberId));
            }

            // 2) 최종 memberId로 사용량 요약 조회
            const res = await getAdminMemberUsageSummary(targetMemberId);
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
                                <>
                                    <Row className="g-2">
                                        <Col md={4}>
                                            <strong>자소서 사용 건수:</strong> {serviceSummary.resumeUsageCount}
                                        </Col>
                                        <Col md={4}>
                                            <strong>면접 사용 건수:</strong> {serviceSummary.interviewUsageCount}
                                        </Col>
                                        <Col md={4}>
                                            <strong>관리자 작업 건수:</strong> {serviceSummary.adminOperationCount}
                                        </Col>

                                        <Col md={4}>
                                            <strong>전체 서비스 사용 건수:</strong> {serviceSummary.totalServiceUsageCount}
                                        </Col>
                                        <Col md={4}>
                                            <strong>전체 로그 건수:</strong> {serviceSummary.totalOverallLogCount}
                                        </Col>
                                        <Col md={4}>
                                            <strong>AI 토큰 사용량:</strong> {serviceSummary.serviceTokenUsage}
                                        </Col>

                                        <Col md={4}>
                                            <strong>관리자 크레딧 변동량:</strong> {serviceSummary.adminCreditDelta}
                                        </Col>
                                    </Row>

                                    <div className="mt-3 text-muted small">
                                        ※ AI 토큰 사용량은 자소서/면접 서비스에서 실제 사용된 토큰의 합계이며,
                                        관리자 크레딧 변동량은 운영자가 지급하거나 차감한 크레딧의 총합입니다.
                                    </div>

                                    <div className="text-muted small mt-2">
                                        ※ 통계 데이터는 usage_log 기준으로 집계됩니다.
                                    </div>
                                </>
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
                                    <th>서비스 유형</th>
                                    <th>처리량 합계</th>
                                    <th>토큰 사용량 / 크레딧 변동량</th>
                                    <th>로그 건수</th>
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

                                <Form.Group className="mb-3">
                                    <Form.Label>닉네임</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={memberNickname}
                                        onChange={(e) => setMemberNickname(e.target.value)}
                                        placeholder="닉네임 입력"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>이메일</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={memberEmail}
                                        onChange={(e) => setMemberEmail(e.target.value)}
                                        placeholder="이메일 입력"
                                    />
                                </Form.Group>

                                <div className="text-muted small mb-3">
                                    ※ 회원 ID를 직접 입력하거나, 닉네임/이메일로 회원을 검색할 수 있습니다.
                                </div>

                                <Button type="submit" className="mb-3">
                                    조회
                                </Button>
                            </Form>

                            {memberSummary && (
                                <>
                                    <div className="mb-2"><strong>회원 ID:</strong> {memberSummary.memberId}</div>
                                    <div className="mb-2"><strong>이메일:</strong> {memberSummary.email}</div>
                                    <div className="mb-2"><strong>현재 크레딧:</strong> {memberSummary.creditBalance}</div>
                                    <div className="mb-2"><strong>총 로그 수:</strong> {memberSummary.totalLogCount}</div>
                                    <div className="mb-2"><strong>자소서 사용 건수:</strong> {memberSummary.resumeUsageCount}</div>
                                    <div className="mb-2"><strong>면접 사용 건수:</strong> {memberSummary.interviewUsageCount}</div>
                                    <div className="mb-2"><strong>AI 토큰 사용량:</strong> {memberSummary.serviceTokenUsage}</div>
                                    <div><strong>누적 크레딧 변동량:</strong> {memberSummary.adminCreditDelta}</div>
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