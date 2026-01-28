import { ReactNode } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <a
            href="https://arkadiuszkulpa.co.uk"
            className="text-sm text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="hidden sm:inline">arkadiuszkulpa.co.uk</span>
            <span className="sm:hidden">Portfolio</span>
          </a>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {children}
      </main>
    </div>
  );
}
