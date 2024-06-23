import { FormEvent, useState, useTransition } from 'react'

interface FormState {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export function useForm(
  action: (data: FormData) => Promise<FormState>,
  onSuccess: () => Promise<void> | void,
  initialState?: FormState,
) {
  const [state, setState] = useState(
    initialState ?? { success: true, message: null, errors: null },
  )

  const [isPending, startTransition] = useTransition()

  async function handleAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = await action(formData)

      if (result.success && onSuccess) {
        await onSuccess()
      }

      setState(result)
    })
  }

  return [state, handleAction, isPending] as const
}
