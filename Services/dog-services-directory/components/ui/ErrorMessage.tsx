'use client';

interface ErrorMessageProps {
  message: string;
  error?: Error | null;
}

export function ErrorMessage({ message, error }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
      {error && process.env.NODE_ENV === 'development' && (
        <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">
          {error.message}
        </pre>
      )}
    </div>
  );
} 