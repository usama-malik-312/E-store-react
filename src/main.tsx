import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { queryClient } from '@/lib/queryClient';
import { router } from '@/router';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import '@/lib/i18n';
import './index.css';

const AppWithConfig = () => {
  const { isRTL } = useLanguage();
  
  return (
    <ConfigProvider
      direction={isRTL ? 'rtl' : 'ltr'}
      theme={{
        token: {
          colorPrimary: '#0ea5e9',
        },
      }}
    >
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AppWithConfig />
      </LanguageProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

