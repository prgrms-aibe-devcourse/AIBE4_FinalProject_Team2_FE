import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AdminMemberTable({ members }) {
    const navigate = useNavigate();

    return (
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>회원 ID</th>
                <th>이메일</th>
                <th>닉네임</th>
                <th>역할</th>
                <th>상태</th>
                <th>크레딧</th>
                <th>가입일</th>
                <th>상세</th>
            </tr>
            </thead>
            <tbody>
            {members.length === 0 ? (
                <tr>
                    <td colSpan="8" className="text-center">
                        조회된 회원이 없습니다.
                    </td>
                </tr>
            ) : (
                members.map((member) => (
                    <tr key={member.memberId}>
                        <td>{member.memberId}</td>
                        <td>{member.email}</td>
                        <td>{member.nickname}</td>
                        <td>{member.role}</td>
                        <td>{member.status}</td>
                        <td>{member.creditBalance}</td>
                        <td>
                            {member.createdAt
                                ? new Date(member.createdAt).toLocaleString("ko-KR")
                                : "-"}
                        </td>
                        <td>
                            <Button
                                size="sm"
                                onClick={() => navigate(`/admin/members/${member.memberId}`)}
                            >
                                상세
                            </Button>
                        </td>
                    </tr>
                ))
            )}
            </tbody>
        </Table>
    );
}

export default AdminMemberTable;