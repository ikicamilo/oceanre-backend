jest.mock('../../../src/auth/user.model', () => ({
  findOne: jest.fn(),
}));

const User = require('../../../src/auth/user.model');

test('finds user by email', async () => {
  User.findOne.mockResolvedValue({ id: 1, name: 'Camilo' });
  const result = await User.findOne({ where: { email: 'test@example.com' } });
  expect(result.name).toBe('Camilo');
});
