function SummaryCards({ summary }) {

    return (
        <div style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
            flexWrap: "wrap"
        }}>

            <Card title="활성 회원" value={summary.activeMemberCount} />
            <Card title="휴면 회원" value={summary.dormancyMemberCount} />
            <Card title="삭제 회원" value={summary.deletedMemberCount} />

            <Card title="오늘 사용 로그" value={summary.todayUsageLogCount} />
            <Card title="자소서 분석 사용" value={summary.todayResumeUsageCount} />
            <Card title="면접 사용" value={summary.todayInterviewUsageCount} />

            <Card title="오늘 AI 토큰 사용량" value={summary.todayTotalTokenUsage} />

        </div>
    );
}

function Card({ title, value }) {

    return (
        <div style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            minWidth: "160px",
            background: "#fafafa"
        }}>
            <div style={{fontSize:"14px", color:"#666"}}>{title}</div>
            <div style={{fontSize:"24px", fontWeight:"bold"}}>{value}</div>
        </div>
    );

}

export default SummaryCards;