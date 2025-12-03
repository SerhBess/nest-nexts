import { User } from '@/lib/types/user-type';
import { create } from 'zustand';

type State = {
  user: User | null;
};

type Action = {
  setUser: (user: User) => void;
};

const authStore = create<State & Action>((set) => ({
  user: null,

  setUser: (newUser) =>
    set((state) => {
      if (!state.user) {
        return { user: newUser };
      }

      return {
        user: {
          ...state.user,
          ...newUser,
        },
      };
    }),
}));

export default authStore;
