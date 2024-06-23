import { Header } from '@/components/header'

import { CreateOrgForm } from './create-org-form'

export default function CreateOrgPage() {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center">
        <h1 className="mt-8 self-start text-2xl font-bold">
          Create an organization
        </h1>
        <CreateOrgForm />
      </main>
    </div>
  )
}
