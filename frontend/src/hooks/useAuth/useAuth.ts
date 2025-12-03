import { AuthService } from '@/lib/services/auth-service/auth-service';
import { User } from '@/lib/types/user-type';
import authStore from '@/store/auth/auth-store';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = authStore.getState();

  useEffect(() => {
    const getUser = async () => {
      const res = await AuthService.getMe();

      if (!res) {
        return;
      }

      setUser(res);
    };
  }, []);
};
