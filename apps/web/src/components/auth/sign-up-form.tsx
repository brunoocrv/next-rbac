'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { signUpWithCredentialsAction } from '@/app/auth/sign-up/actions'
import { useForm } from '@/hooks/use-form'

import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export function SignUpForm() {
  const router = useRouter()
  const [state, handleSignUp, isPending] = useForm(
    signUpWithCredentialsAction,
    () => {
      router.push('/auth/sign-in')
    },
  )
  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      {state.success === false && state.message && (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Sign failed!</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="name" name="name" />
        {state.errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {state.errors.name[0]}
          </p>
        )}
      </div>
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
      </div>
      <div className="space-y-1">
        <Label htmlFor="confirPassword">Confirm your password</Label>
        <Input id="confirPassword" type="password" name="confirmPassword" />
        {state.errors?.confirm_password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {state.errors.confirm_password[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        {isPending ? <Loader2 className="animate-spin" /> : 'Create account'}
      </Button>
      <Button variant="link" className="w-full text-sm" asChild>
        <Link href="/auth/sign-in">Already registered? Sign in</Link>
      </Button>
    </form>
  )
}
