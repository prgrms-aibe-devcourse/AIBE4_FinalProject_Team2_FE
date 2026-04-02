import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { updateOpsIssueStatus } from "../../api/ops";

function ErrorIssueStatusEditor({ issueId, currentStatus, onUpdated }) {
    const [status, setStatus] = useState(currentStatus || "OPEN");
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (status === currentStatus) {
            return;
        }

        try {
            setSaving(true);
            await updateOpsIssueStatus(issueId, status);
            onUpdated?.();
        } catch (error) {
            console.error("에러 이슈 상태 변경 실패:", error);
            alert("상태 변경에 실패했습니다.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="d-flex gap-2 align-items-center">
            <Form.Select
                size="sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving}
            >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="IGNORED">IGNORED</option>
            </Form.Select>

            <Button
                size="sm"
                variant="outline-primary"
                onClick={handleSave}
                disabled={saving}
            >
                {saving ? "저장중" : "저장"}
            </Button>
        </div>
    );
}

export default ErrorIssueStatusEditor;