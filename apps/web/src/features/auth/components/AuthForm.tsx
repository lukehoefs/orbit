import { useId } from 'react'
import { ApiProblem } from '@orbit/api/problem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { cn } from 'cn'

/**
 * A link on an auth screen, as the lukethomas app draws it: the accent (6.3:1 on the card), a step heavier than the
 * line, underlined so it never relies on colour alone.
 */
export const AUTH_LINK = 'font-medium text-primary underline underline-offset-2 hover:no-underline'

/** Helper and status text on an auth screen: 14px, as the app's sign-in, in the muted grey (9:1 on the card). */
export const AUTH_HELP = 'text-sm leading-normal text-muted-foreground'

export function AuthInput({ label, value, onChange, type = 'text', required = true }: { label: string; value: string; onChange?: (value: string) => void; type?: string; required?: boolean }) {
  const id = useId()
  const props = { id, required, readOnly: !onChange, value, onChange: (event: React.ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value) }
  // 44px fields with 14px text and a solid grey edge, as the app's sign-in (16px on a phone so iOS does not zoom).
  return <div className="grid gap-1.5"><Label htmlFor={id} className={cn('gap-1 text-[0.8125rem] text-muted-foreground', required && onChange && "after:text-primary after:content-['*']")}>{label}</Label>{type === 'password' ? <PasswordInput className="h-11 bg-card" {...props} /> : <Input type={type} className="h-11 bg-card px-3 md:text-sm" {...props} />}</div>
}

/**
 * The centred card every auth screen sits in. It wears the lukethomas app's palette in every portal theme (the
 * `auth-screen` block in index.css; `.light` turns the dark: variants off inside it), and its buttons are flat like
 * the app's (`data-flat`, the portal's Flat style), so the portal's sign-in and the app's read as one product.
 */
export function AuthCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    // body hides overflow (the app shell scrolls its own panes), so a card taller than the window scrolls here.
    <main data-slot="auth-screen" data-flat="" className="light grid h-full place-items-center overflow-y-auto p-6 font-sans text-foreground">
      <section data-slot="auth-card" className={cn('w-[min(100%,460px)] rounded-xl border bg-card p-6 shadow-[0_2px_4px_rgb(0_0_0/0.05),0_4px_12px_rgb(0_0_0/0.10)]', className)}>{children}</section>
    </main>
  )
}

/** An auth screen's title: 24px semibold, as the app's sign-in heading. */
export const AUTH_TITLE = 'text-2xl/[1.875rem] font-semibold tracking-[-0.02em]'

export function AuthBrand() {
  // 22px keeps the 11-unit pixel logo on whole device pixels.
  return <span className="flex items-center gap-2 text-[0.8125rem] font-bold tracking-[0.08em] text-primary uppercase"><img src="/logo.svg" alt="" className="size-[22px]" />lukethomas</span>
}

/** Header, an inset panel with the fields and actions, and an optional footer row (Coolify's sign-in layout). */
export function AuthForm({ title, description, children, error, pending, submitLabel, onSubmit, actions, footer }: { title: string; description?: string; children: React.ReactNode; error: Error | null; pending: boolean; submitLabel: string; onSubmit: () => Promise<unknown>; actions?: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <AuthCard className="p-0"><form onSubmit={(event) => {
      event.preventDefault()
      // Dismiss the mobile keyboard before replacing the login form with the app.
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
      void onSubmit().catch(() => undefined)
    }}>
      <header className="grid gap-1.5 px-6 pt-6 pb-5">
        <h1 className={AUTH_TITLE}>{title}</h1>
        {description ? <p className={AUTH_HELP}>{description}</p> : null}
      </header>
      <div className={cn('-mx-px grid gap-4 rounded-xl border bg-background/40 p-6', !footer && '-mb-px')}>
        {children}
        {error ? <p className="text-sm text-destructive" role="alert">{error instanceof ApiProblem ? error.detail : 'The server could not complete the request.'}</p> : null}
        {/* Every button here is 44px with 14px text, as the app's sign-in button. */}
        <div className="grid gap-3 [&_[data-slot=button]]:h-11"><Button type="submit" size="lg" disabled={pending}>{pending ? 'Please wait…' : submitLabel}</Button>{actions}</div>
      </div>
      {/* The footer's links (plain <Link>s from each page) take AUTH_LINK's look; spelled out so Tailwind sees the classes. */}
      {footer ? <div className={cn('px-6 py-4 text-center [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:no-underline', AUTH_HELP)}>{footer}</div> : null}
    </form></AuthCard>
  )
}
