// ClientWrapper.tsx
'use client';
import { Provider } from 'react-redux';
import { store } from '@/redux/index';
import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      storageKey="ai-intrvu-theme"
    >
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
}
