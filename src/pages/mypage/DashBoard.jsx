import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Button } from 'react-bootstrap';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import api from "../../api/axios.js";
import { useNavigate } from 'react-router-dom';
import './DashBoard.css';

const Dashboard = () => {
    const [userName, setUserName] = useState("지원자");
    const [dailyStats, setDailyStats] = useState({ resumeReviewCount: 0, completedInterviewCount: 0 });
    const [growthStats, setGrowthStats] = useState([]);
    const [monthlyUsage, setMonthlyUsage] = useState({ monthlyStats: [] });
    const [recentActivities, setRecentActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const DAILY_LIMIT = { resume: 2, interview: 2 };

    useEffect(() => {
        const fetchDashboardData = async () => {
            const USE_MOCK = false;

            if (USE_MOCK) {
                setDailyStats({ resumeReviewCount: 1, completedInterviewCount: 1 });
                setGrowthStats([
                    { metricName: "논리성", previousValue: 60, currentValue: 80, difference: 20 },
                    { metricName: "직무이해", previousValue: 70, currentValue: 75, difference: 5 },
                    { metricName: "표현력", previousValue: 50, currentValue: 40, difference: -10 },
                    { metricName: "창의성", previousValue: 65, currentValue: 65, difference: 0 }
                ]);
                setMonthlyUsage({
                    monthlyStats: [
                        { month: "1월", resumes: 5, interviews: 3 },
                        { month: "2월", resumes: 8, interviews: 6 },
                        { month: "3월", resumes: 2, interviews: 4 },
                        { month: "4월", resumes: 0, interviews: 0 }
                    ]
                });
                setRecentActivities([
                    { id: 1, type: "INTERVIEW", title: "네이버 백엔드 엔지니어 모의면접", date: "2026-03-13 14:30", score: 88 },
                    { id: 2, type: "RESUME", title: "카카오 인턴십 자기소개서 첨삭", date: "2026-03-12 09:15", score: null }
                ]);
                setUserName("예비개발자");
                setIsLoading(false);
                return;
            }

            try {
                // 💡 [핵심 복구] 제가 생략했던 진짜 API 통신 코드를 다시 꽉 채워 넣었습니다!
                const [dailyRes, growthRes, monthlyRes, recentRes, profileRes] = await Promise.all([
                    api.get('/mypage/statistics'),
                    api.get('/mypage/statistics/growth'),
                    api.get('/mypage/ai-usage'),
                    api.get('/mypage/recent-activities'),
                    api.get('/mypage/profile')
                ]);

                setDailyStats(dailyRes.data?.data || dailyRes.data);
                setGrowthStats(growthRes.data || []);

                const rawMonthlyStats = monthlyRes.data?.data?.monthlyStats || monthlyRes.data?.monthlyStats || [];

                const formattedMonthly = Array.from({ length: 12 }, (_, i) => ({
                    month: `${i + 1}월`,
                    resumes: 0,
                    interviews: 0
                }));

                rawMonthlyStats.forEach(stat => {
                    const monthIndex = stat.month - 1; // 배열은 0부터 시작하므로 -1

                    // count(이용 횟수) 또는 amount(토큰/크레딧 사용량) 중 차트에 보여줄 값을 더합니다.
                    // 여기서는 count(이용 횟수)를 기준으로 작성했습니다.
                    if (stat.serviceType === 'RESUME') {
                        formattedMonthly[monthIndex].resumes += stat.count;
                    } else if (stat.serviceType === 'INTERVIEW') {
                        formattedMonthly[monthIndex].interviews += stat.count;
                    }
                });

// 3. 완성된 배열을 상태에 저장
                setMonthlyUsage({ monthlyStats: formattedMonthly });

                const realRecentData = recentRes.data?.data || recentRes.data || [];
                const formattedRecentData = realRecentData.map(activity => ({
                    ...activity,
                    date: activity.createdAt ? activity.createdAt.replace('T', ' ').substring(0, 16) : '날짜 없음'
                }));
                setRecentActivities(formattedRecentData);

                const fetchedName = profileRes.data?.data?.nickname || profileRes.data?.nickname;
                if (fetchedName) {
                    setUserName(fetchedName);
                }
            } catch (error) {
                console.error("데이터 로드 실패", error);
            } finally {
                setIsLoading(false);
            }
        };
        void fetchDashboardData();
    }, []);

    if (isLoading) return <Container className="p-5 text-center text-sub">데이터를 분석 중입니다...</Container>;

    const usedResume = dailyStats?.resumeReviewCount || 0;
    const usedInterview = dailyStats?.completedInterviewCount || 0;
    const remainResume = Math.max(0, DAILY_LIMIT.resume - usedResume);
    const remainInterview = Math.max(0, DAILY_LIMIT.interview - usedInterview);
    const resumePercent = (usedResume / DAILY_LIMIT.resume) * 100;
    const interviewPercent = (usedInterview / DAILY_LIMIT.interview) * 100;

    return (
        <div className="dashboard-wrapper w-100">
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

                <header className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                        <h2 className="fw-bold text-main m-0">대시보드 📊</h2>
                        <p className="text-sub mt-2 mb-0">{userName}님의 취업 준비 진행 상황을 한눈에 확인하세요.</p>
                    </div>
                    <div className="d-flex gap-2">
                        <Button className="fw-bold px-4 rounded-pill shadow-sm" style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #DEE2E6' }} onClick={() => navigate('/resume')}>
                            ✍️ 자기소개서 첨삭
                        </Button>
                        <Button className="fw-bold px-4 rounded-pill shadow-sm" style={{ backgroundColor: '#1976D2', color: '#ffffff', border: 'none' }} onClick={() => navigate('/interview')}>
                            🎙️ AI 면접 시작
                        </Button>
                    </div>
                </header>

                <Row className="g-4 mb-4">
                    <Col lg={7}>
                        <Card className="dashboard-card p-4 h-100">
                            <h5 className="fw-bold text-strong mb-4">나의 역량 밸런스 (최근 1개월)</h5>
                            {growthStats.length > 0 ? (
                                <div style={{ width: '100%', height: 280 }}>
                                    <ResponsiveContainer>
                                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={growthStats}>
                                            <PolarGrid stroke="#DEE2E6" />
                                            <PolarAngleAxis dataKey="metricName" tick={{ fontSize: 12, fill: '#6C757D', fontWeight: 500 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name="현재 점수" dataKey="currentValue" stroke="#1976D2" fill="#1976D2" fillOpacity={0.2} />
                                            <RechartsTooltip contentStyle={{ border: '1px solid #DEE2E6', borderRadius: '8px' }}/>
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="d-flex h-100 align-items-center justify-content-center text-light py-5">
                                    데이터가 없습니다.
                                </div>
                            )}
                        </Card>
                    </Col>

                    <Col lg={5} className="d-flex flex-column gap-4">
                        <Card className="dashboard-card p-4 flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0 text-main">자기소개서 첨삭</h6>
                                <span className={`custom-badge ${remainResume > 0 ? 'blue' : 'gray'}`}>
                                    {remainResume > 0 ? `${remainResume}회 남음` : '이용 완료'}
                                </span>
                            </div>
                            <div className="d-flex align-items-end gap-2 mb-3">
                                <h2 className="fw-bold text-strong mb-0">{usedResume}</h2>
                                <span className="text-light mb-1">/ {DAILY_LIMIT.resume}회 사용</span>
                            </div>
                            <ProgressBar now={resumePercent} style={{ height: '8px' }} />
                        </Card>

                        <Card className="dashboard-card p-4 flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold mb-0 text-main">
                                    AI 모의 면접<br/>
                                    <span className="small text-light fw-normal ms-1">(1회당 20분)</span>
                                </h6>
                                <span className={`custom-badge ${remainInterview > 0 ? 'blue' : 'gray'}`}>
                                    {remainInterview > 0 ? `${remainInterview}회 남음` : '이용 완료'}
                                </span>
                            </div>
                            <div className="d-flex align-items-end gap-2 mb-3">
                                <h2 className="fw-bold text-strong mb-0">{usedInterview}</h2>
                                <span className="text-light mb-1">/ {DAILY_LIMIT.interview}회 사용</span>
                            </div>
                            <ProgressBar now={interviewPercent} style={{ height: '8px' }} />
                        </Card>
                    </Col>
                </Row>

                <Card className="dashboard-card p-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold text-strong m-0">월별 AI 서비스 사용량</h5>
                        <span className="custom-badge gray">2026년</span>
                    </div>
                    {monthlyUsage?.monthlyStats && monthlyUsage.monthlyStats.length > 0 ? (
                        <div style={{ width: '100%', height: 250 }}>
                            <ResponsiveContainer>
                                <BarChart data={monthlyUsage.monthlyStats} barGap={5} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E6" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6C757D' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 12, fill: '#6C757D' }} axisLine={false} tickLine={false} />
                                    <RechartsTooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '10px 14px' }} />
                                    <Legend
                                        iconType="circle"
                                        iconSize={12} // 💡 동그라미 크기를 살짝 조절해 잘림 공간 확보 (기본값 14)
                                        wrapperStyle={{ marginTop: '15px' }} // 💡 paddingTop 대신 marginTop 사용 (찌그러짐 방지)
                                        formatter={(value) => (
                                            <span style={{ color: '#212529', fontWeight: 500, paddingLeft: '4px', verticalAlign: 'middle' }}>
                                                {value}
                                            </span>
                                        )}
                                    />

                                    {/* 남색(Navy) 막대: 자소서 첨삭 */}
                                    <Bar name="자소서 첨삭" dataKey="resumes" fill="#5783AF" barSize={12} radius={[4, 4, 0, 0]} />

                                    {/* 형광 노랑(Neon Yellow) 막대: 모의 면접 */}
                                    <Bar name="모의 면접" dataKey="interviews" fill="#DCE27F" barSize={12} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center text-light py-5">
                            월별 사용량 데이터가 없습니다.
                        </div>
                    )}
                </Card>

                <Row className="g-4">
                    <Col lg={7}>
                        <Card className="dashboard-card p-4 h-100">
                            <h5 className="fw-bold text-strong mb-4">성장 지표 상세 분석</h5>
                            {growthStats.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-borderless table-custom align-middle mb-0">
                                        <thead>
                                        <tr>
                                            <th>평가 항목</th>
                                            <th>이전 달</th>
                                            <th>이번 달</th>
                                            <th>변화량</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {growthStats.map((stat, idx) => (
                                            <tr key={idx}>
                                                <td className="fw-bold text-main py-3">{stat.metricName}</td>
                                                <td className="text-sub">{stat.previousValue}</td>
                                                <td className="fw-bold text-strong">{stat.currentValue}</td>
                                                <td>
                                                        <span className={`custom-badge ${stat.difference > 0 ? 'blue' : 'gray'}`}>
                                                            {stat.difference > 0 ? '▲' : stat.difference < 0 ? '▼' : '-'} {Math.abs(stat.difference)}
                                                        </span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="d-flex h-100 align-items-center justify-content-center text-light py-5">
                                    상세 분석 데이터가 없습니다.
                                </div>
                            )}
                        </Card>
                    </Col>

                    <Col lg={5}>
                        <Card className="dashboard-card p-4 h-100">
                            <h5 className="fw-bold text-strong mb-4">최근 활동 내역</h5>
                            {recentActivities.length > 0 ? (
                                <ul className="list-unstyled mb-0">
                                    {recentActivities.map((activity) => (
                                        <li
                                            key={activity.id}
                                            className="d-flex align-items-center py-3 activity-item"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(activity.type === 'RESUME' ? `/mypage/resumes/${activity.id}` : `/mypage/interviews/${activity.id}`)}
                                        >
                                            <div className="me-3 flex-shrink-0">
                                                <div className="rounded-circle d-flex justify-content-center align-items-center" style={{width: '40px', height: '40px', fontSize: '18px', backgroundColor: '#E3F2FD', color: '#1976D2'}}>
                                                    {activity.type === 'INTERVIEW' ? '🎙️' : '✍️'}
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 overflow-hidden pe-2">
                                                <h6 className="fw-bold mb-1 text-main text-truncate">{activity.title}</h6>
                                                <small className="text-light d-block text-truncate">{activity.date}</small>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="d-flex h-100 align-items-center justify-content-center text-light py-5">
                                    최근 활동 내역이 없습니다.
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Dashboard;