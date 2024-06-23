import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

import { isAuthenticated } from '@/auth/auth'

export default async function AppLayout({
  children,
  sheet,
}: Readonly<{ children: ReactNode; sheet: ReactNode }>) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  return (
    <>
      {children}
      {sheet}
    </>
  )
}
