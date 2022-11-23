import { buildFeedbackPath, extractFeedback } from '../feedback/index';
const handler = (req, res) => {
  const feedbackId = req.query.id;
  const filePath = buildFeedbackPath();
  const feedbackData = extractFeedback(filePath);
  const selectedFeedback = feedbackData.find(
    (feedback) => feedback.id === feedbackId
  );

  res.status(201).json({ feedback: selectedFeedback });
};

export default handler;
