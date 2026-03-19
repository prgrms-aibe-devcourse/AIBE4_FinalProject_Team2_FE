import React, { useState, useEffect } from 'react';
import api from '../../api/axios.js'; // 기존 설정된 axios 인스턴스
import { Table, Form, Button, Card, Badge, Modal, InputGroup } from 'react-bootstrap';

const LogDashboard = () => {
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedLog, setSelectedLog] = useState(null); // 상세 보기용
    const [showModal, setShowModal] = useState(false);

    // JSON 데이터를 보기 좋게 포맷팅하는 헬퍼 함수
    const formatJson = (jsonString) => {
        try {
            const obj = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
            // 마지막 인자 '2'는 들여쓰기 칸 수입니다.
            return JSON.stringify(obj, null, 2);
        } catch (e) {
            return jsonString; // JSON 형식이 아니면 그대로 반환
        }
    };

    // 1. 로그 데이터 가져오기
    const fetchLogs = async () => {
        try {
            const response = await api.get(`/admin/logs?date=${selectedDate}`);
            setLogs(response.data);
        } catch (error) {
            console.error("로그 로드 실패:", error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [selectedDate]);

    // 2. 검색 필터링 (URI, 이메일, 요청 본문 등 전체 검색)
    const filteredLogs = logs.filter(log =>
        log.uri.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.requestBody && log.requestBody.includes(searchTerm))
    );

    const getStatusBadge = (status) => {
        if (status >= 200 && status < 300) return <Badge bg="success">{status}</Badge>;
        if (status >= 400 && status < 500) return <Badge bg="warning">{status}</Badge>;
        return <Badge bg="danger">{status}</Badge>;
    };

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-white py-3">
                    <h5 className="mb-0 fw-bold" style={{ color: '#1976d2' }}>SyncTalk API 실시간 로그 모니터링</h5>
                </Card.Header>
                <Card.Body>
                    {/* 상단 컨트롤 바 */}
                    <div className="d-flex flex-wrap gap-3 mb-4">
                        <Form.Group style={{ width: '200px' }}>
                            <Form.Label className="small fw-bold">조회 날짜</Form.Label>
                            <Form.Control
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="flex-grow-1">
                            <Form.Label className="small fw-bold">로그 검색 (URI, 이메일, 본문 키워드)</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    placeholder="검색어를 입력하세요..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button variant="outline-primary" onClick={fetchLogs}>새로고침</Button>
                            </InputGroup>
                        </Form.Group>
                    </div>

                    {/* 로그 테이블 */}
                    <div className="table-responsive">
                        <Table hover className="align-middle">
                            <thead className="table-light">
                            <tr>
                                <th>시간</th>
                                <th>메서드</th>
                                <th>URI</th>
                                <th>상태</th>
                                <th>사용자</th>
                                <th>소요시간</th>
                                <th>상세</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredLogs.map((log, index) => (
                                <tr key={index} style={{ cursor: 'pointer' }} onClick={() => { setSelectedLog(log); setShowModal(true); }}>
                                    <td className="small">{log.timestamp.split('T')[1].substring(0, 8)}</td>
                                    <td><Badge bg="secondary">{log.method}</Badge></td>
                                    <td className="text-truncate" style={{ maxWidth: '200px' }}>{log.uri}</td>
                                    <td>{getStatusBadge(log.status)}</td>
                                    <td className="small">{log.userEmail}</td>
                                    <td className={log.elapsedTime > 500 ? 'text-danger fw-bold' : ''}>
                                        {log.elapsedTime}ms
                                    </td>
                                    <td><Button size="sm" variant="light">🔍</Button></td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* 로그 상세 내역 모달 */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="h6">로그 상세 정보 [{selectedLog?.requestId}]</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-light">
                    <div className="mb-3">
                        <h6 className="fw-bold">Request Body</h6>
                        <pre className="p-3 bg-dark text-success rounded small border shadow-inner"
                             style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '250px', overflowY: 'auto' }}>
        {formatJson(selectedLog?.requestBody) || 'Empty'}
      </pre>
                    </div>
                    <div>
                        <h6 className="fw-bold">Response Body</h6>
                        <pre className="p-3 bg-white border rounded small text-dark"
                             style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '400px', overflowY: 'auto' }}>
        {formatJson(selectedLog?.responseBody) || 'Empty'}
      </pre>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default LogDashboard;