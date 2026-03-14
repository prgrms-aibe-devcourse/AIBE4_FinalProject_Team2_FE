function RecentLogsTable({ logs }) {

    return (
        <table style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px"
        }}>

            <thead>
            <tr>
                <th>MemberId</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Token</th>
                <th>Date</th>
            </tr>
            </thead>

            <tbody>

            {logs.map((log) => (
                <tr key={log.id}>
                    <td>{log.memberId}</td>
                    <td>{log.serviceType}</td>
                    <td>{log.amount}</td>
                    <td>{log.tokenUsage}</td>
                    <td>
                        {log.createdAt
                            ? new Date(log.createdAt).toLocaleString("ko-KR")
                            : "-"}
                    </td>
                </tr>
            ))}

            </tbody>

        </table>
    );

}

export default RecentLogsTable;