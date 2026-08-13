export interface AuthService {
  signUp(email: string, password: string): Promise<{ token: string }>;
  signIn(email: string, password: string): Promise<{ token: string }>;
  sendPasswordResetEmail(email: string): Promise<void>;
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export const mockAuthService: AuthService = {
  async signUp(email, _password) {
    await delay(1200);
    if (email === 'taken@example.com') {
      throw { code: 'EMAIL_ALREADY_IN_USE' };
    }
    return { token: 'mock-jwt-token-signup-' + Date.now() };
  },

  async signIn(_email, password) {
    await delay(1000);
    if (password !== 'password123') {
      throw { code: 'WRONG_PASSWORD' };
    }
    return { token: 'mock-jwt-token-signin-' + Date.now() };
  },

  async sendPasswordResetEmail(_email) {
    await delay(800);
    // Always succeeds — security best practice (don't reveal if email exists)
  },
};

export const authService: AuthService = mockAuthService;
