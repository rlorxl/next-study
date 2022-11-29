import { getSession } from 'next-auth/client';
import { hashPassword, verifyPassword } from '../../../lib/auth';
import { connectToDatabase } from '../../../lib/db';

const handler = async (req, res) => {
  if (req.method !== 'PATCH') {
    return;
  }

  const session = await getSession({ req: req }); // 쿠키에 토큰 확인

  // 인증되지 않은 사용자의 api라우트 접근 제어.
  if (!session) {
    res.status(401).json({ message: 'Not authenticated!' });
    return;
  }

  // v --------------- 비밀번호 변경 로직 --------------- v //
  const userEmail = session.user.email; // session객체에는 부호화된 email데이터가 포함되어있다.
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectToDatabase();

  const usersCollection = client.db().collection('users');

  const user = await usersCollection.findOne({ email: userEmail });
  // user콜렉션에서 email데이터를 통해 (위에서 session객체로 찾은 데이터) 현재 사용자객체를 검색한다.

  if (!user) {
    res.status(404).json({ message: 'User no found.' });
    client.close();
    return;
  }

  const currentPassword = user.password;

  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordsAreEqual) {
    res.status(403).json({ message: 'Invalid password.' });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  ); // updateOne() : 첫번째 인자 - 변경할 객체, 두번째 인자 - 변경할 내용 ('$set'은 mongodb에서 사용되는 특수한 키임.)

  client.close();
  res.status(200).json({ message: 'Password updated!' });
};

export default handler;
