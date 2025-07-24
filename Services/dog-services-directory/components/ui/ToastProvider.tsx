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
            background: '#E91A7E',
            color: '#ffffff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            maxWidth: '350px',
          },
          success: {
            style: {
              background: '#E91A7E',
              border: '1px solid #b1135e',
              borderLeft: '6px solid #b1135e',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#E91A7E',
            },
          },
          error: {
            style: {
              background: '#E91A7E',
              border: '1px solid #b1135e',
              borderLeft: '6px solid #b1135e',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#E91A7E',
            },
          },
          loading: {
            style: {
              background: '#E91A7E',
              border: '1px solid #b1135e',
              borderLeft: '6px solid #b1135e',
            },
            iconTheme: {
              primary: '#ffffff',
              secondary: '#E91A7E',
            },
          },
        }}
      />
    </>
  );
}
