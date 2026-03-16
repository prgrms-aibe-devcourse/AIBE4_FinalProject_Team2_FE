import React from 'react';
import { Outlet } from 'react-router-dom';
import MyPageSidebar from './MyPageSidebar';
import './MyPageLayout.css';

const MyPageLayout = () => {
    return (
        <div className="app-layout">
            <div className="sidebar-wrapper">
                <MyPageSidebar />
            </div>

            <div className="main-wrapper">
                <div className="content-container">
                    <Outlet /> {/* 여기에 Dashboard, Profile 등이 들어감 */}
                </div>
            </div>
        </div>
    );
};

export default MyPageLayout;