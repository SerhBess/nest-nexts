'use client';

import { ComponentPropsWithoutRef, FC } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { NavLinks } from '../../data/navLinks';

type Props = ComponentPropsWithoutRef<'li'> &
  NavLinks & {
    collapsed: boolean;
  };

const NavItem: FC<Props> = ({ link, text, icon: Icon, collapsed }) => {
  return (
    <li>
      <Link
        href={link}
        className={cn(
          'flex items-center gap-3 px-4 py-2 rounded-sm no-underline dark:text-white dark:hover:bg-stone-500 hover:bg-cyan-600 transition-all',
          collapsed && 'justify-center px-2',
        )}
      >
        <Icon size={20} />

        {!collapsed && <span className="text-lg dark:text-white">{text}</span>}
      </Link>
    </li>
  );
};

export default NavItem;
