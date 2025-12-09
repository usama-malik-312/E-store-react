import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { queryClient } from '@/lib/queryClient';
import { router } from '@/router';
import { AuthProvider } from '@/contexts/AuthContext';
import '@/lib/i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
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
    </QueryClientProvider>
  </React.StrictMode>
);

