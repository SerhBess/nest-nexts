'use client';

import { ComponentPropsWithoutRef, FC, useState } from 'react';
import { cn } from '@/lib/utils';
import NavList from './navigation/NavList/NavList';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = ComponentPropsWithoutRef<'aside'>;

const Sidebar: FC<Props> = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'h-100dvh dark:bg-primary bg-primary border-r border-neutral-300 dark:border-neutral-800 transition-all duration-300  overflow-hidden',
        collapsed ? 'w-[60px]' : 'w-[255px]',
      )}
    >
      <div className="flex items-center justify-end p-2">
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-2 rounded hover:bg-neutral-300 dark:hover:bg-stone-500 */ cursor-pointer text-white transition"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <NavList collapsed={collapsed} />
    </aside>
  );
};

export default Sidebar;
