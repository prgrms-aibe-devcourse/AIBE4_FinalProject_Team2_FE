import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import AdminLayout from "../../components/admin/AdminLayout";
import { adjustAdminCredit } from "../../api/admin";

function AdminCreditsPage() {
    const [form, setForm] = useState({
        memberId: "",
        tokenDelta: "",
        reason: "",
    });

    const [result, setResult] = useState(null);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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