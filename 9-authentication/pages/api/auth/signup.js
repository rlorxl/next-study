import { hashPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return;
  }

  const data = req.body;

  const { email, password } = data;

  if (
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message:
        'Invalid input - password should also be at least 7 characters long.',
    });
    return;
  }

  // connect to database
  const client = await connectToDatabase();

  const db = client.db();

  // check user already exist
  const existingUser = await db.collection('users').findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: 'User exists already!' });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);

  const result = await db.collection('users').insertOne({
    email: email,
    password: hashedPassword, // 암호화된 비밀번호
  });

  res.status(201).json({ message: 'Created user!' });
  client.close();
};

export default handler;
