import { hash, compare } from 'bcryptjs';

/* 비밀번호 암호화 */
export const hashPassword = async (password) => {
  const hashedPassword = await hash(password, 12);

  return hashedPassword;
};

/* compare: 입력된 비밀번호가 해싱된 비밀번호와 일치하는지 확인 */
export const verifyPassword = async (password, hashedPassword) => {
  const isValid = await compare(password, hashedPassword);
  return isValid;
};
