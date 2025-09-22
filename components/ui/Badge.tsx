import React from 'react';
import clsx from 'clsx';

type Color = 'gray' | 'blue' | 'green' | 'yellow' | 'red';

type Props = {
  children: React.ReactNode;
  color?: Color;
  className?: string;
};

export default function Badge({ children, color = 'gray', className }: Props) {
  const colors: Record<Color, string> = {
    gray: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  };
  return (
    <span className={clsx('inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full', colors[color], className)}>
      {children}
    </span>
  );
}
