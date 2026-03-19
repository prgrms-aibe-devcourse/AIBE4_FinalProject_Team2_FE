import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios'; 
import './ResumeOptionCard.css';

const ResumeOptionCard = ({ type, title, description, placeholder, buttonText, note }) => {
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (type === 'file-upload') {
      fileInputRef.current.click(); // 파일 입력 창 열기
    } else {
      // AI 새 이력서 작성 페이지로 이동 로직
      navigate('/resume/create');
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 전송을 위한 FormData 객체 생성
    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);

    try {
      // 백엔드 파싱 API 호출 (Multipart/form-data)
      const response = await axios.post('/api/v1/resumes/extract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 백엔드 ApiResponse 구조에 맞게 데이터 추출 (예: response.data.data)
      const parsedItems = response.data.data; 

      // 추출된 배열 데이터를 하나의 문자열로 보기 좋게 결합
      let combinedContent = '';
      if (parsedItems && parsedItems.length > 0) {
        combinedContent = parsedItems.map(item => `[${item.subtitle}]\n${item.content}`).join('\n\n');
      }

      alert('이력서 파일 분석이 완료되었습니다!');
      
      // 결합된 텍스트 데이터를 가지고 이력서 작성/편집 페이지로 이동
      // 이동할 경로(예: /resume/create)는 설정하신 라우터 경로에 맞춰 수정해주세요.
      navigate('/resume/create', { state: { parsedContent: combinedContent } });

    } catch (error) {
      console.error('이력서 파싱 실패:', error);
      alert('이력서 파일 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
      // 같은 파일을 다시 선택할 수 있도록 input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="resume-option-card">
      <h2 className="roc-title">{title}</h2>
      <p className="roc-description">{description}</p>
      
      {type === 'ai-create' && (
        <div className="roc-input-section">
          <input
            type="text"
            className="roc-input"
            placeholder={placeholder}
          />
        </div>
      )}
      
      <div className="roc-action-section">
        <button 
          className="roc-btn" 
          onClick={handleButtonClick}
          disabled={isLoading}
        >
          {isLoading ? '이력서 분석 중...' : buttonText}
        </button>
        {type === 'file-upload' && (
          <input
            type="file"
            className="roc-file-input"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".docx,.pdf,.hwpx" // HWPX 등 지원 확장자 추가
          />
        )}
      </div>
      
      {note && (
        <p className="roc-note">{note}</p>
      )}
    </div>
  );
};

export default ResumeOptionCard;