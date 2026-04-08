// useDuplicateLoginCheck.jsx (보완 버전)
import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const useDuplicateLoginCheck = (username) => {
    useEffect(() => {
        // username이 없으면 실행하지 않음
        if (!username) return;

        const socket = new SockJS('http://localhost:8080/ws-security');
        const stompClient = Stomp.over(socket);

        // 디버그 로그가 너무 많으면 끄기 가능
        // stompClient.debug = () => {};

        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame);

            stompClient.subscribe(`/topic/logout/${username}`, (message) => {
                alert(message.body);

                // 1. 로컬 저장소 비우기
                localStorage.clear();

                // 2. 로그인 페이지로 강제 이동
                window.location.replace('/login');
            });
        });

        // 컴포넌트 언마운트 시 또는 username 변경 시 연결 해제
        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, [username]); // username이 바뀔 때마다 실행
};

export default useDuplicateLoginCheck;