import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS 로드
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App';
import { HashRouter, BrowserRouter } from 'react-router-dom'; // Router 감싸기

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);