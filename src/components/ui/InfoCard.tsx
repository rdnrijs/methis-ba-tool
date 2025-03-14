
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InfoCardProps {
  title: string;
  description?: string;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  glassmorphism?: boolean;
  hoverEffect?: boolean;
  animateIn?: boolean;
  delay?: 'none' | 'short' | 'medium' | 'long';
}

const InfoCard = ({
  title,
  description,
  className,
  contentClassName,
  headerClassName,
  footerClassName,
  children,
  footer,
  icon,
  glassmorphism = false,
  hoverEffect = false,
  animateIn = false,
  delay = 'none',
}: InfoCardProps) => {
  const delayClasses = {
    'none': '',
    'short': 'animate-delay-100',
    'medium': 'animate-delay-200',
    'long': 'animate-delay-300',
  };

  return (
    <Card className={cn(
      glassmorphism && 'glass-card',
      hoverEffect && 'hover-lift',
      animateIn && 'animate-scale-in animate-once',
      delayClasses[delay],
      className
    )}>
      <CardHeader className={cn("flex flex-row items-center gap-4", headerClassName)}>
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent className={cn("pt-2", contentClassName)}>
        {children}
      </CardContent>
      {footer && (
        <CardFooter className={cn("pt-2", footerClassName)}>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

export default InfoCard;
