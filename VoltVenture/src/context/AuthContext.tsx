import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  HAS_REGISTERED: 'has_registered',
} as const;

// ─── State & Actions ──────────────────────────────────────────────────────────
export type AuthState = {
  isLoading: boolean;
  userToken: string | null;
  isSignout: boolean;
  hasRegistered: boolean;
};

type AuthAction =
  | { type: 'RESTORE_TOKEN'; token: string | null; hasRegistered: boolean }
  | { type: 'SIGN_IN'; token: string }
  | { type: 'SIGN_OUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        userToken: action.token,
        hasRegistered: action.hasRegistered,
        isLoading: false,
      };
    case 'SIGN_IN':
      return { ...state, isSignout: false, userToken: action.token };
    case 'SIGN_OUT':
      return { ...state, isSignout: true, userToken: null };
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
export type AuthContextValue = {
  state: AuthState;
  signIn(token: string): Promise<void>;
  signOut(): Promise<void>;
  signUp(token: string): Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    isLoading: true,
    userToken: null,
    isSignout: false,
    hasRegistered: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const [token, hasRegisteredRaw] = await Promise.all([
          SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN),
          SecureStore.getItemAsync(STORAGE_KEYS.HAS_REGISTERED),
        ]);
        dispatch({
          type: 'RESTORE_TOKEN',
          token,
          hasRegistered: hasRegisteredRaw === 'true',
        });
      } catch {
        dispatch({ type: 'RESTORE_TOKEN', token: null, hasRegistered: false });
      }
    })();
  }, []);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      state,
      async signIn(token) {
        await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
        dispatch({ type: 'SIGN_IN', token });
      },
      async signOut() {
        // Only delete auth_token — NOT has_registered (D-02: registered users
        // skip onboarding on next launch even after logout).
        await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
        dispatch({ type: 'SIGN_OUT' });
      },
      async signUp(token) {
        await Promise.all([
          SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token),
          SecureStore.setItemAsync(STORAGE_KEYS.HAS_REGISTERED, 'true'),
        ]);
        dispatch({ type: 'SIGN_IN', token });
      },
    }),
    [state],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// ─── Convenience hook ─────────────────────────────────────────────────────────
export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx || !('state' in ctx)) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
}
