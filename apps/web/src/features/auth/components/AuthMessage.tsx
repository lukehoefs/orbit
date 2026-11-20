import { cn } from 'cn'
import { AUTH_HELP, AUTH_TITLE, AuthCard } from './AuthForm'

export function AuthMessage({ title, detail }: { title: string; detail: string }) {
  return <AuthCard><h1 className={cn('mb-1.5', AUTH_TITLE)}>{title}</h1><p className={AUTH_HELP}>{detail}</p></AuthCard>
}
