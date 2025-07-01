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
            background: '#22C55E',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            maxWidth: '350px',
          },
          success: {
            style: {
              background: '#059669',
              border: '1px solid #047857',
              borderLeft: '6px solid #047857',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#059669',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              border: '1px solid #dc2626',
              borderLeft: '6px solid #dc2626',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#ef4444',
            },
          },
          loading: {
            style: {
              background: '#3b82f6',
              border: '1px solid #2563eb',
              borderLeft: '6px solid #2563eb',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#3b82f6',
            },
          },
        }}
      />
    </>
  );
}
