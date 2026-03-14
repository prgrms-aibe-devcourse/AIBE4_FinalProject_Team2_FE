import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import AdminLayout from "../../components/admin/AdminLayout";
import { adjustAdminCredit, searchAdminMembers } from "../../api/admin";

function AdminCreditsPage() {
    const [form, setForm] = useState({
        memberId: "",
        tokenDelta: "",
        reason: "",
    });
    const [memberNickname, setMemberNickname] = useState("");
    const [memberEmail, setMemberEmail] = useState("");

    const [result, setResult] = useState(null);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFindMember = async () => {
        try {
            setMessage("");
            setResult(null);

            if (!memberNickname.trim() && !memberEmail.trim()) {
                setMessage("닉네임 또는 이메일을 입력해주세요.");
                return;
            }

            const res = await searchAdminMembers({
                nickname: memberNickname || undefined,
                email: memberEmail || undefined,
                page: 0,
                size: 1,
            });

            const members = res.data?.data?.content ?? [];
            const firstMember = members[0];

            if (!firstMember) {
                setMessage("일치하는 회원이 없습니다.");
                return;
            }

            setForm((prev) => ({
                ...prev,
                memberId: String(firstMember.memberId),
            }));

            setMessage(`회원 찾기 성공 (ID: ${firstMember.memberId})`);
        } catch (error) {
            console.error("회원 검색 실패:", error);
            setMessage("회원 검색에 실패했습니다.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.memberId) {
            setMessage("회원 ID를 입력하거나 회원 찾기를 먼저 진행해주세요.");
            return;
        }

        try {
            const body = {
                memberId: Number(form.memberId),
                tokenDelta: Number(form.tokenDelta),
                reason: form.reason,
            };

            const res = await adjustAdminCredit(body);
            const data = res.data?.data ?? res.data;

            setResult(data);
            setMessage("크레딧 조정이 완료되었습니다.");
        } catch (error) {
            console.error("크레딧 조정 실패:", error);
            setMessage("크레딧 조정에 실패했습니다.");
            setResult(null);
        }
    };

    return (
        <AdminLayout title="크레딧 관리">
            {message && <Alert variant="info">{message}</Alert>}

            <Card className="shadow-sm" style={{ maxWidth: "720px" }}>
                <Card.Body>
                    <Card.Title className="mb-4">회원 크레딧 지급 / 차감</Card.Title>

                    <Form.Group className="mb-3">
                        <Form.Label>닉네임</Form.Label>
                        <Form.Control
                            type="text"
                            value={memberNickname}
                            onChange={(e) => setMemberNickname(e.target.value)}
                            placeholder="닉네임으로 회원 검색"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>이메일</Form.Label>
                        <Form.Control
                            type="text"
                            value={memberEmail}
                            onChange={(e) => setMemberEmail(e.target.value)}
                            placeholder="이메일로 회원 검색"
                        />
                    </Form.Group>

                    <Button
                        type="button"
                        variant="secondary"
                        className="mb-3"
                        onClick={handleFindMember}
                    >
                        회원 찾기
                    </Button>

                    <div className="text-muted small mb-3">
                        ※ 회원 ID를 직접 입력하거나 닉네임/이메일로 회원을 검색할 수 있습니다.
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>회원 ID</Form.Label>
                            <Form.Control
                                type="number"
                                name="memberId"
                                value={form.memberId}
                                onChange={handleChange}
                                placeholder="회원 ID 입력"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>크레딧 변화량</Form.Label>
                            <Form.Control
                                type="number"
                                name="tokenDelta"
                                value={form.tokenDelta}
                                onChange={handleChange}
                                placeholder="예: 100 또는 -50"
                                required
                            />
                            <Form.Text className="text-muted">
                                양수는 지급, 음수는 차감입니다.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>사유</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="reason"
                                value={form.reason}
                                onChange={handleChange}
                                placeholder="조정 사유 입력"
                            />
                        </Form.Group>

                        <Button type="submit">크레딧 조정</Button>
                    </Form>

                    {result && (
                        <Card className="mt-4 border-0 bg-light">
                            <Card.Body>
                                <h5 className="mb-3">조정 결과</h5>
                                <div>회원 ID: {result.memberId}</div>
                                <div>변화량: {result.tokenDelta}</div>
                                <div>조정 후 잔액: {result.balanceAfter}</div>
                            </Card.Body>
                        </Card>
                    )}
                </Card.Body>
            </Card>
        </AdminLayout>
    );
}

export default AdminCreditsPage;