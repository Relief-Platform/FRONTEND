// ============================================================
//  Token Storage – localStorage wrapper
//  Dùng thay cho localStorage.setItem trực tiếp ở khắp nơi
// ============================================================

const TOKEN_KEY = 'auth_token'

export const tokenStorage = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },

  set(token: string): void {
    localStorage.setItem(TOKEN_KEY, token)
  },

  remove(): void {
    localStorage.removeItem(TOKEN_KEY)
  },

  exists(): boolean {
    return !!localStorage.getItem(TOKEN_KEY)
  },
}
