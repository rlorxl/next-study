import { useState } from 'react';
import { buildFeedbackPath, extractFeedback } from './api/feedback/index';

const FeedbackPage = (props) => {
  const [feedbackData, setFeedbackData] = useState();

  // 버튼을 누를 때 더 많은 데이터가 렌더링 되도록 요청을 보냄.
  const loadFeedbackHandler = (id) => {
    fetch(`/api/feedback/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setFeedbackData(data.feedback);
      });
  };

  return (
    <>
      {feedbackData && <p>{feedbackData.email}</p>}
      <ul>
        {props.feedbackItems.map((item) => (
          <li key={item.id}>
            {item.text}
            <button onClick={loadFeedbackHandler.bind(null, item.id)}>
              Show Details
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

// 사전에 저장된 데이터를 가져와 설정하고 컴포넌트에서 props로 데이터를 렌더링할 수 있음.
export const getStaticProps = async () => {
  const filePath = buildFeedbackPath();
  const data = extractFeedback(filePath);

  return {
    props: {
      feedbackItems: data,
    },
  };
};

export default FeedbackPage;
