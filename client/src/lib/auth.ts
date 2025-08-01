// Simple auth utility - in a real app, you'd use a proper auth library
export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "rd" | "production" | "finance";
  firstName: string;
  lastName: string;
}

class AuthManager {
  private user: User | null = null;

  getCurrentUser(): User | null {
    if (!this.user && typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.user = JSON.parse(stored);
      }
    }
    return this.user;
  }

  login(user: User) {
    this.user = user;
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  logout() {
    this.user = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

  hasRole(role: string): boolean {
    return this.user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return this.user ? roles.includes(this.user.role) : false;
  }
}

export const auth = new AuthManager();
