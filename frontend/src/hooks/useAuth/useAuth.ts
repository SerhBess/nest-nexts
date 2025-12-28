import { AuthService } from '@/lib/services/auth-service/auth-service';
import authStore from '@/store/auth/auth-store';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = authStore.getState();

  useEffect(() => {
    const getUser = async () => {
      if (isLoading) return;
      setIsLoading(true);
      const res = await AuthService.getMe();

      if (!res) {
        setIsLoading(false);
        return;
      }

      setUser(res);
      setIsLoading(false);
    };

    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
