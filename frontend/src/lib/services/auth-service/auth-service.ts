import { User } from '@/lib/types/user-type';
import { HttpService } from '../http-service/http-service';

export type LoginProps = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message?: string;
  user?: User;
};

export type RegisterProps = LoginProps & {
  userName: string;
};

export type RegisterResponse = {
  success: boolean;
  message?: string;
  user?: User;
};

export type GetMeResponse = User | null;

class AuthApi extends HttpService {
  async login({ email, password }: LoginProps): Promise<LoginResponse> {
    try {
      const res = await this.json<LoginResponse>('auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!res) {
        return {
          success: false,
          message: 'Empty server response',
        };
      }

      return res;
    } catch (error) {
      console.error('Login error:', error);

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  async register({
    email,
    password,
    userName,
  }: RegisterProps): Promise<RegisterResponse> {
    try {
      const res = await this.json<RegisterResponse>('auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, username: userName }),
      });

      if (!res) {
        return {
          success: false,
          message: 'Empty server response',
        };
      }

      return res;
    } catch (error) {
      console.error('Register error:', error);

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
      };
    }
  }

  async getMe(): Promise<GetMeResponse> {
    try {
      const res = await this.json<User>('auth/me', {
        method: 'GET',
      });

      if (!res) return null;

      return res;
    } catch (error) {
      console.error('getMe error:', error);
      return null;
    }
  }
}

export const AuthService = new AuthApi();
