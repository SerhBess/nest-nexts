import { Home, MessageCircle } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

export type NavLinks = {
  text: string;
  link: string;
  icon: React.ElementType;
};

export const navLinks: NavLinks[] = [
  {
    text: 'Home',
    link: ROUTES.home,
    icon: Home,
  },
  {
    text: 'My Chats',
    link: ROUTES.myChats,
    icon: MessageCircle,
  },
];
