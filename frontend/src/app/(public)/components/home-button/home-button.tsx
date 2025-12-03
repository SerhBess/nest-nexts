'use client';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';
import { ComponentPropsWithoutRef, FC } from 'react';

type Props = ComponentPropsWithoutRef<'button'>;

const HomeButton: FC<Props> = () => {
  const router = useRouter();

  const handleRoute = () => {
    router.push(ROUTES.home);
  };
  return (
    <Button onClick={handleRoute} type="button" size={'lg'} variant={'default'}>
      To Home
    </Button>
  );
};

export default HomeButton;
