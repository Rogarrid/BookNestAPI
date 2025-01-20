import { PrismaService } from '../../services/prisma/prisma.service';
import { findUserByEmail } from '../../libs/utils';
import { User } from '@prisma/client';

describe('findUserByEmail', () => {
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
    } as unknown as PrismaService;
  });

  it('should throw an error if email already exists during signup', async () => {
    const email = 'test@example.com';
    const methodAuth = 'signup';
    const user = { email } as User;

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

    await expect(findUserByEmail(prisma, email, methodAuth)).rejects.toThrow(
      'Email already exists',
    );
  });

  it('should throw an error if user is not found during signin', async () => {
    const email = 'test@example.com';
    const methodAuth = 'signin';

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(findUserByEmail(prisma, email, methodAuth)).rejects.toThrow(
      'User not found',
    );
  });

  it('should return the user if email exists during signin', async () => {
    const email = 'test@example.com';
    const methodAuth = 'signin';
    const user = { email } as User;

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);

    const result = await findUserByEmail(prisma, email, methodAuth);
    expect(result).toEqual(user);
  });

  it('should return null if email does not exist during signup', async () => {
    const email = 'test@example.com';
    const methodAuth = 'signup';

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await findUserByEmail(prisma, email, methodAuth);
    expect(result).toBeNull();
  });
});
