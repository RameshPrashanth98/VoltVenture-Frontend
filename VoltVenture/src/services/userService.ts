export type MockUser = {
  name: string;
  email: string;
  avatarUri: string | null;
  memberSince: string;
};

export const mockUser: MockUser = {
  name: 'Jamie Torres',
  email: 'jamie@voltventure.app',
  avatarUri: null,
  memberSince: '2026-08-18',
};
