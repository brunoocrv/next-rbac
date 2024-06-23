'use server'

import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import Link from 'next/link'

import { getCurrentOrg } from '@/auth/auth'
import { getOrgs } from '@/http/requests/orgs/get-orgs'

import { Avatar, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export async function OrganizationSwitcher() {
  const currentOrgSlug = getCurrentOrg()
  const { organizations } = await getOrgs()

  const currentOrganization = organizations.find(
    (org) => org.slug === currentOrgSlug,
  )

  console.log(currentOrganization)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {currentOrganization ? (
          <>
            <Avatar className="size-4">
              <AvatarImage src={currentOrganization.avatarUrl ?? ''} />
            </Avatar>
            <span className="line-clamp-1 text-left">
              {currentOrganization.name}
            </span>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">
            select organization
          </span>
        )}
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
        <DropdownMenuContent
          align="end"
          className="w-[200px]"
          sideOffset={12}
          alignOffset={-16}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Organizations</DropdownMenuLabel>
            {organizations.map((org) => (
              <DropdownMenuItem key={org.id} asChild>
                <Link href={`/org/${org.slug}`}>
                  <Avatar className="mr-2 size-4">
                    <AvatarImage src={org.avatarUrl ?? ''} />
                  </Avatar>
                  <span className="line-clamp-1">{org.name}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/create-org">
              <PlusCircle className="mr-2 size-4" />
              Create organization
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuTrigger>
    </DropdownMenu>
  )
}
