import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Button, Card, Col, Form, Row } from "react-bootstrap";
import AdminLayout from "../../components/admin/AdminLayout";
import {
    getAdminMemberDetail,
    getAdminMemberUsageSummary,
    updateAdminMemberStatus,
} from "../../api/admin";

function AdminMemberDetailPage() {
    const { memberId } = useParams();

    const [member, setMember] = useState(null);
    const [usageSummary, setUsageSummary] = useState(null);
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const fetchDetail = async () => {
        try {
            setLoading(true);

            const [memberRes, usageRes] = await Promise.all([
                getAdminMemberDetail(memberId),
                getAdminMemberUsageSummary(memberId),
            ]);

            const memberData = memberRes.data?.data ?? memberRes.data;
            const usageData = usageRes.data?.data ?? usageRes.data;

            setMember(memberData);
            setUsageSummary(usageData);
            setStatus(memberData.status || "");
        } catch (error) {
            console.error("회원 상세 조회 실패:", error);
            setMessage("회원 상세 정보를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [memberId]);

    const handleStatusUpdate = async (e) => {
        e.preventDefault();

        try {
            await updateAdminMemberStatus(memberId, { status });
            setMessage("회원 상태가 수정되었습니다.");
            fetchDetail();
        } catch (error) {
            console.error("회원 상태 수정 실패:", error);
            setMessage("회원 상태 수정에 실패했습니다.");
        }
    };

    if (loading) {
        return (
            <AdminLayout title="회원 상세">
                <div>로딩 중...</div>
            </AdminLayout>
        );
    }

    if (!member) {
        return (
            <AdminLayout title="회원 상세">
                <Alert variant="danger">회원 정보를 찾을 수 없습니다.</Alert>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="회원 상세">
            {message && <Alert variant="info">{message}</Alert>}

            <Row className="g-4">
                <Col md={7}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">기본 정보</Card.Title>

                            <Row className="mb-2">
                                <Col sm={4}><strong>회원 ID</strong></Col>
                                <Col sm={8}>{member.memberId}</Col>
                            </Row>

                            <Row className="mb-2">
                                <Col sm={4}><strong>이메일</strong></Col>
                                <Col sm={8}>{member.email}</Col>
                            </Row>

                            <Row className="mb-2">
                                <Col sm={4}><strong>닉네임</strong></Col>
                                <Col sm={8}>{member.nickname}</Col>
                            </Row>

                            <Row className="mb-2">
                                <Col sm={4}><strong>권한</strong></Col>
                                <Col sm={8}>{member.role}</Col>
                            </Row>

                            <Row className="mb-2">
                                <Col sm={4}><strong>상태</strong></Col>
                                <Col sm={8}>{member.status}</Col>
                            </Row>

                            <Row className="mb-2">
                                <Col sm={4}><strong>크레딧</strong></Col>
                                <Col sm={8}>{member.creditBalance}</Col>
                            </Row>

                            <Row className="mb-2">
                                <Col sm={4}><strong>플랜</strong></Col>
                                <Col sm={8}>{member.subscriptionPlan || "-"}</Col>
                            </Row>

                            <Row className="mb-2">
                                <Col sm={4}><strong>희망 직무</strong></Col>
                                <Col sm={8}>{member.desiredJobRole || "-"}</Col>
                            </Row>

                            <Row className="mb-2">
                                <Col sm={4}><strong>선호 지역</strong></Col>
                                <Col sm={8}>{member.preferredLocation || "-"}</Col>
                            </Row>

                            <Row className="mb-2">
                                <Col sm={4}><strong>가입일</strong></Col>
                                <Col sm={8}>
                                    {member.createdAt
                                        ? new Date(member.createdAt).toLocaleString("ko-KR")
                                        : "-"}
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={4}><strong>삭제일</strong></Col>
                                <Col sm={8}>
                                    {member.deletedAt
                                        ? new Date(member.deletedAt).toLocaleString("ko-KR")
                                        : "-"}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={5}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <Card.Title className="mb-3">회원 상태 변경</Card.Title>

                            <Form onSubmit={handleStatusUpdate}>
                                <Form.Group className="mb-3">
                                    <Form.Label>상태</Form.Label>
                                    <Form.Select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="DORMANCY">DORMANCY</option>
                                        <option value="DELETED">DELETED</option>
                                    </Form.Select>
                                </Form.Group>

                                <Button type="submit">상태 수정</Button>
                            </Form>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-3">사용량 요약</Card.Title>

                            {!usageSummary ? (
                                <div>사용량 정보를 불러오는 중...</div>
                            ) : (
                                <>
                                    <Row className="mb-2">
                                        <Col sm={6}><strong>총 로그 수</strong></Col>
                                        <Col sm={6}>{usageSummary.totalLogCount}</Col>
                                    </Row>

                                    <Row className="mb-2">
                                        <Col sm={6}><strong>총 토큰 사용량</strong></Col>
                                        <Col sm={6}>{usageSummary.totalTokenUsage}</Col>
                                    </Row>

                                    <Row className="mb-2">
                                        <Col sm={6}><strong>자소서 사용</strong></Col>
                                        <Col sm={6}>{usageSummary.resumeUsageCount}</Col>
                                    </Row>

                                    <Row className="mb-2">
                                        <Col sm={6}><strong>면접 사용</strong></Col>
                                        <Col sm={6}>{usageSummary.interviewUsageCount}</Col>
                                    </Row>

                                    <Row>
                                        <Col sm={6}><strong>현재 크레딧</strong></Col>
                                        <Col sm={6}>{usageSummary.creditBalance}</Col>
                                    </Row>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </AdminLayout>
    );
}

export default AdminMemberDetailPage;