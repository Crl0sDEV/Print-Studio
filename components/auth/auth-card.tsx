import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface AuthCardProps {
  icon?: LucideIcon;
  customLogo?: string;
  title: string;
  description: string;
  error?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'md' | 'lg';
}

const maxWidthClasses = {
  md: 'max-w-md',
  lg: 'max-w-lg',
}

import Image from 'next/image'

export function AuthCard({
  icon: Icon,
  customLogo,
  title,
  description,
  error,
  children,
  footer,
  maxWidth = 'md',
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className={`w-full ${maxWidthClasses[maxWidth]} border-border/40 bg-card/60 backdrop-blur-md`}>
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary overflow-hidden">
            {customLogo ? (
              <Image src={customLogo} alt="Logo" width={32} height={32} className="rounded-sm" />
            ) : Icon ? (
              <Icon className="h-6 w-6" />
            ) : null}
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {children}
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
