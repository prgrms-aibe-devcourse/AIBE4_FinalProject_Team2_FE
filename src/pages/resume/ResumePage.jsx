import React from 'react';
import ResumeOptionCard from '../../components/resume/ResumeOptionCard';
import './ResumePage.css';

const ResumePage = () => {
  return (
    <div className="resume-page-container">
      <header className="resume-page-header">
        <button className="back-btn" onClick={() => window.history.back()}>
          ←
        </button>
        <h1 className="resume-page-title">자기소개서(Resume) 작성</h1>
      </header>
      
      <main className="resume-page-main">
        <ResumeOptionCard 
          type="ai-create"
          title="새 자기소개서 작성"
          description="지원할 채용공고의 직무를 입력하면, AI가 자기소개서를 더 전략적으로 작성할 수 있도록 도와줍니다."
          placeholder="지원할 직무 (예: 프론트엔드 개발자)"
          buttonText="AI로 자기소개서 작성 시작하기"
        />
        <ResumeOptionCard 
          type="file-upload"
          title="기존 자기소개서로 작성"
          description="기존에 작성해둔 자기소개서 파일을 업로드하면, AI가 자동으로 자기소개서를 파싱하여 더 전략적으로 업데이트해 줍니다."
          buttonText="기존 자기소개서 업로드"
          note="* hwpx, docx, pdf 파일만 지원 (단, PDF는 인식률이 낮을 수 있음)"
        />
      </main>
    </div>
  );
};

export default ResumePage;