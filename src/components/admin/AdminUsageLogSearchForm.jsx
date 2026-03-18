import { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

function AdminUsageLogSearchForm({ onSearch }) {
    const [form, setForm] = useState({
        memberId: "",
        nickname: "",
        email: "",
        serviceType: "",
        from: "",
        to: "",
        targetType: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSearch({
            memberId: form.memberId || undefined,
            nickname: form.nickname || undefined,
            email: form.email || undefined,
            serviceType: form.serviceType || undefined,
            from: form.from || undefined,
            to: form.to || undefined,
            targetType: form.targetType || undefined
        });
    };

    const handleReset = () => {
        const resetForm = {
            memberId: "",
            nickname: "",
            email: "",
            serviceType: "",
            from: "",
            to: "",
            targetType: ""
        };

        setForm(resetForm);

        onSearch({
            memberId: undefined,
            nickname: undefined,
            email: undefined,
            serviceType: undefined,
            from: undefined,
            to: undefined,
            targetType: undefined
        });
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

                <Col md={2}>
                    <Form.Control
                        name="nickname"
                        placeholder="닉네임"
                        value={form.nickname}
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

                <Col md={3}>
                    <Form.Control
                        name="targetType"
                        placeholder="타겟 타입 (예: ANALYSIS_REPORT)"
                        value={form.targetType}
                        onChange={handleChange}
                    />
                </Col>

                <Col md={2}>
                    <Form.Label className="small text-muted">시작일</Form.Label>
                    <Form.Control
                        type="date"
                        name="from"
                        value={form.from}
                        onChange={handleChange}
                    />
                </Col>

                <Col md={2}>
                    <Form.Label className="small text-muted">종료일</Form.Label>
                    <Form.Control
                        type="date"
                        name="to"
                        value={form.to}
                        onChange={handleChange}
                    />
                </Col>

                <Col md={2} className="d-flex align-items-end">
                    <Button type="submit" className="w-100">
                        검색
                    </Button>
                </Col>

                <Col md={2} className="d-flex align-items-end">
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

export default AdminUsageLogSearchForm;