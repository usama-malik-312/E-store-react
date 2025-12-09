import { User } from '@/types';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const tokenStorage = {
  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Get user data from localStorage
   */
  getUser(): User | null {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr) return null;
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  /**
   * Set access token
   */
  setAccessToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  /**
   * Set refresh token
   */
  setRefreshToken(token: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  /**
   * Set user data
   */
  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /**
   * Store all auth data (tokens + user)
   * This is the main method to use after login
   */
  setAuthData(token: string, refreshToken: string, user: User): void {
    this.setAccessToken(token);
    this.setRefreshToken(refreshToken);
    this.setUser(user);
  },

  /**
   * Update access token (keep refresh token and user)
   */
  updateAccessToken(token: string): void {
    this.setAccessToken(token);
  },

  /**
   * Update tokens (keep user)
   */
  updateTokens(token: string, refreshToken?: string): void {
    this.setAccessToken(token);
    if (refreshToken) {
      this.setRefreshToken(refreshToken);
    }
  },

  /**
   * Remove all auth data
   */
  remove(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Check if access token exists
   */
  hasToken(): boolean {
    return !!this.getAccessToken();
  },

  /**
   * Legacy method for backward compatibility
   */
  get(): string | null {
    return this.getAccessToken();
  },

  /**
   * Legacy method for backward compatibility
   */
  set(token: string): void {
    this.setAccessToken(token);
  },

  /**
   * Get all auth data (for backward compatibility with old code)
   */
  getAuthData(): { accessToken: string; refreshToken: string; user: User } | null {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const user = this.getUser();

    if (!accessToken || !refreshToken || !user) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      user,
    };
  },
};
