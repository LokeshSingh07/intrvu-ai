// ClientWrapper.tsx
'use client';
import { Provider } from 'react-redux';
import { store } from '@/redux/index';
import { ReactNode } from 'react';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
