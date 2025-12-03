'use client';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { ComponentPropsWithoutRef, FC } from 'react';

type Props = ComponentPropsWithoutRef<'div'>;

const AuthButtons: FC<Props> = () => {
  const router = useRouter();

  const handleRoute = (direction: string) => {
    router.push(direction);
  };

  return (
    <div className="flex justify-center gap-2.5">
      <Button
        onClick={() => handleRoute(ROUTES.login)}
        variant="secondary"
        size="lg"
      >
        Log in
      </Button>
      <Button
        onClick={() => handleRoute(ROUTES.register)}
        variant="outline"
        size="lg"
      >
        Sign up
      </Button>
    </div>
  );
};

export default AuthButtons;
