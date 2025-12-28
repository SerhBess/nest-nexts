import {
  createStore as vanillaCreateStore,
  StateCreator,
  StoreApi,
} from 'zustand';
import { devtools } from 'zustand/middleware';

export function createStore<T extends object>(
  name: string,
  initializer: StateCreator<T, [], []>,
): StoreApi<T> {
  const withDevtools: StateCreator<T, [], [['zustand/devtools', never]]> =
    devtools(initializer, {
      name,
      enabled: process.env.NODE_ENV === 'development',
    });

  return vanillaCreateStore<T>()(withDevtools);
}
