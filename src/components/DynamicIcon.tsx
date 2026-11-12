import React from 'react';
import * as Icons from 'lucide-react';

interface Props {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<Props> = ({ name, className = 'w-4 h-4', size }) => {
  const IconComponent = (Icons as any)[name] || Icons.Wrench;
  return <IconComponent className={className} size={size} />;
};
