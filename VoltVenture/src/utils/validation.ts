export function validateEmail(email: string): string | null {
  if (!email.includes('@') || !email.includes('.')) {
    return 'Please enter a valid email address.';
  }
  return null;
}

export function validatePassword(
  password: string,
  mode: 'signup' | 'login',
): string | null {
  if (mode === 'signup' && password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  // Login: wrong password is a server error, not a format error
  return null;
}
