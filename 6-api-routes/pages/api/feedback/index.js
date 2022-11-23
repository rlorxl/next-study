// localhost:3000/api/feedback
import fs from 'fs';
import path from 'path';

export const buildFeedbackPath = () => {
  return path.join(process.cwd(), 'data', 'feedback.json'); // 파일경로 (data폴더의 feedback.json파일)
};

export const extractFeedback = (filePath) => {
  const fileData = fs.readFileSync(filePath); // 저장된 파일경로에서 먼저 파일을 읽는 작업.
  const data = JSON.parse(fileData); // JSON -> JavaScript
  return data;
};

const handler = (req, res) => {
  // 서버 측 코드
  if (req.method === 'POST') {
    console.log(req.body);
    const email = req.body.email;
    const feedbackText = req.body.text;

    const newFeedback = {
      id: new Date().toISOString(),
      email: email,
      text: feedbackText,
    };

    // 데이터베이스나 파일에 저장.
    const filePath = buildFeedbackPath();
    const data = extractFeedback(filePath);
    data.push(newFeedback);
    fs.writeFileSync(filePath, JSON.stringify(data)); // 데이터를 오버라이드 (경로, 데이터양식)
    res.status(201).json({ message: 'Success', feedback: newFeedback });
  } else {
    const filePath = buildFeedbackPath();
    const data = extractFeedback(filePath);
    res.status(200).json({ feedback: data });
  }
};

export default handler;
