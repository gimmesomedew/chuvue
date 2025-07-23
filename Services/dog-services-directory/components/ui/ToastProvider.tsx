'use client';

import * as React from 'react';
import { Toaster } from 'react-hot-toast';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#11055F',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            maxWidth: '350px',
          },
          success: {
            style: {
              background: '#219982',
              border: '1px solid #185a87',
              borderLeft: '6px solid #185a87',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#219982',
            },
          },
          error: {
            style: {
              background: '#e91a7e',
              border: '1px solid #b1135e',
              borderLeft: '6px solid #b1135e',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#e91a7e',
            },
          },
          loading: {
            style: {
              background: '#add4fa',
              border: '1px solid #185a87',
              borderLeft: '6px solid #185a87',
            },
            iconTheme: {
              primary: '#11055F',
              secondary: '#add4fa',
            },
          },
        }}
      />
    </>
  );
}
