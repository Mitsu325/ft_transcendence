import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string>
{
  const salt = 15;
  const hashPass = await bcrypt.hash(password, salt);
  return hashPass;
}