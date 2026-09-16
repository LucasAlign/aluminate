export const DEMO_LOGIN = {
  email: "demo@aluminate.app",
  password: "demo1234"
} as const;

export function isDemoLogin(email: string, password: string) {
  return email.trim().toLowerCase() === DEMO_LOGIN.email && password === DEMO_LOGIN.password;
}
