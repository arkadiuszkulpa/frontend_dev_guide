import { ReactNode } from 'react';

interface FormCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function FormCard({ title, subtitle, children }: FormCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-500 text-lg">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
