import { Badge } from "react-bootstrap";

function ErrorIssueStatusBadge({ status }) {
    const upper = String(status || "").toUpperCase();

    if (upper === "OPEN") {
        return <Badge bg="danger">OPEN</Badge>;
    }

    if (upper === "IN_PROGRESS") {
        return <Badge bg="warning" text="dark">IN_PROGRESS</Badge>;
    }

    if (upper === "RESOLVED") {
        return <Badge bg="success">RESOLVED</Badge>;
    }

    if (upper === "IGNORED") {
        return <Badge bg="secondary">IGNORED</Badge>;
    }

    return <Badge bg="secondary">{status || "-"}</Badge>;
}

export default ErrorIssueStatusBadge;