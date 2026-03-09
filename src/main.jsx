import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS 로드
import { BrowserRouter } from 'react-router-dom'; // Router 감싸기

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter basename="/AIBE4_FinalProject_Team2_FE">
            <App />
        </BrowserRouter>
    </React.StrictMode>
);