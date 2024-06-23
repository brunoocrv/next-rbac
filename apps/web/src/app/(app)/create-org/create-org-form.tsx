'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'

import { createOrgAction } from '@/app/(app)/create-org/actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from '@/hooks/use-form'

export function CreateOrgForm() {
  const [state, handleCreateOrg, isPending] = useForm(createOrgAction, () => {
    // router.push('/auth/sign-in')
  })

  return (
    <form
      onSubmit={handleCreateOrg}
      className="mt-8 flex w-full max-w-[500px] flex-col items-center justify-center space-y-4"
    >
      {state.success === false && state.message && (
        <Alert variant="destructive">
          <AlertTriangle />
          <AlertTitle>Sign failed!</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      <div className="w-full space-y-1">
        <Label htmlFor="name">Organization Name</Label>
        <Input id="name" type="name" name="name" />
        {state.errors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {state.errors.name[0]}
          </p>
        )}
      </div>
      <div className="w-full space-y-1">
        <Label htmlFor="domain">Email domain</Label>
        <Input
          id="domain"
          name="domain"
          inputMode="url"
          placeholder="example.com"
        />
        {state.errors?.domain && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {state.errors.domain[0]}
          </p>
        )}
      </div>
      <div className="w-full space-y-1">
        <div className="flex items-start space-x-2">
          <Checkbox
            name="shouldAttachusersByDomain"
            id="shouldAttachusersByDomain"
            className="translate-y-0.5"
          />
          <label htmlFor="shouldAttachusersByDomain" className="space-y-1">
            <span className="text-sm font-medium leading-none">
              Auto join new members
            </span>
            <p className="text-sm text-muted-foreground">
              This will automatically invite all members with same e-mail domain
              to this organization
            </p>
          </label>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          'Create Organization'
        )}
      </Button>
    </form>
  )
}
