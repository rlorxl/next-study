import { connectDatabase, insertDocument } from '../../helpers/db-util';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    const userEmail = req.body.email;

    if (!userEmail || !userEmail.includes('@')) {
      res.status(422).json({ message: 'Invalid email address.' });
      return;
    }

    let client;

    try {
      client = await connectDatabase();
    } catch (error) {
      res.status(500).json({ message: 'Connection to the database failed!' });
      return;
    }

    try {
      await insertDocument(client, 'emails', { email: userEmail });
      client.close();
    } catch (error) {
      res.status(500).json({ message: 'Insetring data failed!' });
      return;
    }

    // console.log(userEmail);
    res.status(201).json({ message: 'Signed up!' });
  }
};
export default handler;
