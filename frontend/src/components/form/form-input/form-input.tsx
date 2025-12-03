'use client';

import { ComponentPropsWithoutRef, FC } from 'react';
import { cn } from '@/lib/utils';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';

type Props = ComponentPropsWithoutRef<'input'> & {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
};

const FormInput: FC<Props> = ({
  label,
  error,
  registration,
  className,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full pb-4 relative">
      <label className="text-sm font-medium text-white mb-1">{label}</label>

      <Input
        {...registration}
        {...props}
        className={cn(error && 'border-red-500', className)}
      />

      {error && (
        <p className="text-red-500 text-sm absolute top-16 left-0">{error}</p>
      )}
    </div>
  );
};

export default FormInput;
