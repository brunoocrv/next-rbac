'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { signInWithCredentialsAction } from '@/app/auth/sign-in/actions'
import { useForm } from '@/hooks/use-form'

import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export function SignInForm() {
  const router = useRouter()
  const [state, handleSignIn, isPending] = useForm(
    signInWithCredentialsAction,
    () => {
      router.push('/')
    },
  )

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      {state.success === false && state.message && (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Sign failed!</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" name="email" />

        {state.errors?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {state.errors.email[0]}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" name="password" />
        {state.errors?.password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {state.errors.password[0]}
          </p>
        )}
        <Link
          href="/auth/forgot-password"
          className="text-xs font-medium text-foreground hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="animate-spin" /> : 'Sign in'}
      </Button>
      <Button variant="link" className="w-full text-sm" asChild>
        <Link href="/auth/sign-up">Don't have an account? Sign up</Link>
      </Button>
      {/* <Separator /> */}
      {/* <Button type="button" className="w-full gap-2">
        <Image src={githubMark} alt="GitHub logo" className="w-5 dark:invert" />
        Sign in with GitHub
      </Button> */}
    </form>
  )
}
