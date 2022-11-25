/* api/comments/some-event-id */
import {
  connectDatabase,
  insertDocument,
  getAllDocuments,
} from '../../../helpers/db-util';

const handler = async (req, res) => {
  const eventId = req.query.eventId;

  let client;

  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: 'Connectiong to the database failed!' });
    return;
  }

  if (req.method === 'POST') {
    const { email, name, text } = req.body;

    if (
      !email.includes('@') ||
      !name ||
      name.trim() === '' ||
      !text ||
      text.trim() === ''
    ) {
      res.status(422).json({ message: 'Invalid input.' });
      client.close(); // 클라이언트 연결종료
      return;
    }

    const newComment = {
      // id: new Date().toISOString(), // mongodb가 id 설정해줌.
      email,
      name,
      text,
      eventId,
    };

    // const db = client.db();

    // const result = await db.collection('comments').insertOne(newComment);

    // console.log(result); // result에는 mongodb에서 생성된 id값도 포함되어 있음.

    let result;

    try {
      result = await insertDocument(client, 'comments', newComment);
      newComment._id = result.insertedId; // newComment id를 mongodb에서 생성된 id로 할당.
      res.status(201).json({ message: 'Added comment.', comment: newComment });
    } catch (error) {
      res.status(500).json({ message: 'Inserting comment failed!' });
    }
  }

  if (req.method === 'GET') {
    try {
      const documents = getAllDocuments(client, 'comments', { _id: -1 }); // comments를 _id기준 내림차순으로 정렬해서 가장 최신의 댓글이 첫 댓글이 되도록.
      res.status(200).json({ comments: documents });
    } catch (error) {
      res.status(500).json({ message: 'Getting comments failed.' });
    }
  }

  client.close();
};

export default handler;
