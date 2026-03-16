import { Button, Col, Form, Row } from "react-bootstrap";
import { useState } from "react";

function AdminMemberSearchForm({ onSearch }) {
    const [form, setForm] = useState({
        memberId: "",
        email: "",
        nickname: "",
        status: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const cleaned = {
            memberId: form.memberId || undefined,
            email: form.email || undefined,
            nickname: form.nickname || undefined,
            status: form.status || undefined,
            page: 0,
            size: 10
        };

        onSearch(cleaned);
    };

    const handleReset = () => {
        setForm({
            memberId: "",
            email: "",
            nickname: "",
            status: ""
        });

        onSearch({ page: 0, size: 10 });
    };

    return (
        <Form onSubmit={handleSubmit} className="mb-4">
            <Row className="g-3">
                <Col md={2}>
                    <Form.Control
                        name="memberId"
                        placeholder="회원 ID"
                        value={form.memberId}
                        onChange={handleChange}
                    />
                </Col>

                <Col md={3}>
                    <Form.Control
                        name="email"
                        placeholder="이메일"
                        value={form.email}
                        onChange={handleChange}
                    />
                </Col>

                <Col md={3}>
                    <Form.Control
                        name="nickname"
                        placeholder="닉네임"
                        value={form.nickname}
                        onChange={handleChange}
                    />
                </Col>

                <Col md={2}>
                    <Form.Select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                    >
                        <option value="">전체 상태</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DORMANCY">DORMANCY</option>
                        <option value="DELETED">DELETED</option>
                    </Form.Select>
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
            </Row>
        </Form>
    );
}

export default AdminMemberSearchForm;