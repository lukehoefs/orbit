import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { ApiProblem } from '@orbit/api/problem'
import { useConfirmEmailChange } from '@/features/auth/api'
import { cn } from 'cn'
import { AUTH_HELP, AUTH_LINK, AUTH_TITLE, AuthCard } from '@/features/auth/components/AuthForm'
import { AuthMessage } from '@/features/auth/components/AuthMessage'
import { useConsumedToken } from '@/features/auth/useConsumedToken'

const ERROR_TITLES: Record<string, string> = {
  invalid_email_change_token: 'This link does not work',
  email_taken: 'This email is taken',
}

/**
 * `/confirm-email?token=…`: the link that an email change sends to the new address. Opens with or without a session,
 * since the person may read the email on another device.
 */
export function ConfirmEmailPage() {
  const token = useConsumedToken()
  const confirm = useConfirmEmailChange()
  const started = useRef(false)

  useEffect(() => {
    // The token works once.
    if (started.current || !token) return
    started.current = true
    confirm.mutate(token)
  }, [confirm, token])

  if (!token) return <AuthMessage title="This link does not work" detail="The link is missing its token. Open the link from the email again." />
  if (confirm.isSuccess) {
    return (
      <AuthCard>
        <h1 className={cn('mb-1.5', AUTH_TITLE)}>Your email is changed</h1>
        <p className={AUTH_HELP}>You now sign in with {confirm.data}. Your other devices are signed out.</p>
        <p className="mt-4 text-sm"><Link to="/" className={AUTH_LINK}>Continue to lukethomas</Link></p>
      </AuthCard>
    )
  }
  if (confirm.isError) {
    const problem = confirm.error instanceof ApiProblem ? confirm.error : null
    return (
      <AuthCard>
        <h1 className={cn('mb-1.5', AUTH_TITLE)}>{(problem && ERROR_TITLES[problem.code]) ?? 'Your email is not changed'}</h1>
        <p role="alert" className={AUTH_HELP}>{problem ? problem.detail : 'The server could not change the email. Try opening the link again.'}</p>
        <p className="mt-4 text-sm"><Link to="/profile" className={AUTH_LINK}>Go to your account settings</Link></p>
      </AuthCard>
    )
  }
  return <AuthMessage title="Changing your email" detail="One moment." />
}
