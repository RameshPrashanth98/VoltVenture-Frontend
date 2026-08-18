import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { mockUser } from '../services/userService';

export type UserProfile = {
  name: string;
  email: string;
  avatarUri: string | null;
  memberSince: string;
};

type ProfileContextValue = {
  profile: UserProfile;
  updateProfile: (patch: Partial<UserProfile>) => void;
};

export const ProfileContext = createContext<ProfileContextValue>({} as ProfileContextValue);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({
    name: mockUser.name,
    email: mockUser.email,
    avatarUri: mockUser.avatarUri,
    memberSince: mockUser.memberSince,
  });

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      updateProfile: (patch) => setProfile((prev) => ({ ...prev, ...patch })),
    }),
    [profile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfileContext(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx || !('profile' in ctx)) {
    throw new Error('useProfileContext must be used within ProfileProvider');
  }
  return ctx;
}
