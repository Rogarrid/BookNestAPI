import { PrismaService } from '../services/prisma/prisma.service';
import { User } from '@prisma/client';

export async function findUserByEmail(
  prisma: PrismaService,
  email: string,
  methodAuth: string,
): Promise<User | null> {
  console.log(email);
  const userExists = await prisma.user.findUnique({
    where: { email },
  });
  console.log(userExists);
  if (methodAuth === 'signup' && userExists) {
    throw new Error('Email already exists');
  }
  if (methodAuth === 'signin' && !userExists) {
    throw new Error('User not found');
  }

  return userExists;
}