'use client';

import { ComponentPropsWithoutRef, FC } from 'react';
import { navLinks } from '../../data/navLinks';
import NavItem from '../NavItem/NavItem';

type Props = ComponentPropsWithoutRef<'ul'> & {
  collapsed: boolean;
};

const NavList: FC<Props> = ({ collapsed }) => {
  return (
    <ul className="flex flex-col gap-1 mt-4 p-2">
      {navLinks.map((item) => (
        <NavItem key={item.link} collapsed={collapsed} {...item} />
      ))}
    </ul>
  );
};

export default NavList;
