import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export function Card({ children, hover = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-gray-200/80 bg-white dark:border-gray-700/60 dark:bg-gray-900/60 ${
        hover
          ? 'transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/5 hover:border-brand-300 dark:hover:border-brand-700 dark:hover:shadow-black/20'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
