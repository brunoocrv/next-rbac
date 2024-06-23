import { Slash } from 'lucide-react'

import { ability } from '@/auth/auth'

import { ThemeSwitcher } from '../theme-switcher'
import { Separator } from '../ui/separator'
import { OrganizationSwitcher } from './organization-switcher'
import { ProfileButton } from './profile-button'

export async function Header() {
  const permissions = await ability()

  return (
    <div className="mx-auto mt-8 flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        <strong className="text-sm dark:invert">
          next rbac (role based access control)
        </strong>

        <Slash className="size-3 -rotate-[24deg] text-border" />

        <OrganizationSwitcher />

        {permissions?.can('get', 'Project') && <p>Projetos</p>}
      </div>
      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </div>
  )
}
