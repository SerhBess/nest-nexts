'use client';

import { ComponentPropsWithoutRef, FC } from 'react';
import { loginSchema, type LoginSchema } from '@/lib/schemas/login-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '@/components/form/form-input/form-input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { AuthService } from '@/lib/services/auth-service/auth-service';
type Props = ComponentPropsWithoutRef<'form'>;

const LoginForm: FC<Props> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    const register = await AuthService.login({ ...data, userName: 'Serh' });
    console.log(register);
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
    </form>
  );
};

export default LoginForm;
