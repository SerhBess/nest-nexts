import { User } from '@/lib/types/user-type';
import { createStore } from '@/store/utils/createStore';
import { useStore as useZustandStore } from 'zustand';

type State = {
  user: User | null;
};

type Actions = {
  setUser: (user: User) => void;
};

export type AuthStore = State & Actions;

const store = createStore<AuthStore>('authStore', (set) => ({
  user: null,

  setUser: (newUser) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...newUser } : newUser,
    })),
}));

export const useAuthStore = <T>(selector: (state: AuthStore) => T) =>
  useZustandStore(store, selector);

export const selectAuthStoreUser = (s: AuthStore) => s.user;

export default store;
