'use client';

import { ComponentPropsWithoutRef, FC } from 'react';
import { loginSchema, type LoginSchema } from '@/lib/schemas/login-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '@/components/form/form-input/form-input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { AuthService } from '@/lib/services/auth-service/auth-service';
import { ROUTES } from '@/lib/routes';
import { useRouter } from 'next/navigation';

type Props = ComponentPropsWithoutRef<'form'>;

const LoginForm: FC<Props> = () => {
  const router = useRouter();

  const navigateToSignUp = () => router.push(ROUTES.register);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    const res = await AuthService.login({ ...data });
    if (res.user) {
      router.push(ROUTES.home);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-96 sm:w-72 max-w-sm bg-stone-700 p-4 rounded-xl"
    >
      <FormInput
        label="Email"
        type="email"
        error={errors.email?.message}
        registration={register('email')}
      />
      <FormInput
        label="Password"
        type="password"
        error={errors.password?.message}
        registration={register('password')}
      />
      <Button type="submit">Log in</Button>
      <div className="flex items-center gap-3 text-center dark:text-white px-5">
        <div className="flex-1 h-px bg-white/50 dark:bg-white"></div>
        <span>or</span>
        <div className="flex-1 h-px bg-white/50 dark:bg-white"></div>
      </div>
      <Button variant={'secondary'} onClick={navigateToSignUp} type="button">
        Sign up
      </Button>
    </form>
  );
};

export default LoginForm;
