import { CreateOrgForm } from '@/app/(app)/create-org/create-org-form'
import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export default function CreateOrgPage() {
  return (
    <Sheet defaultOpen>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Create Organization</SheetTitle>
        </SheetHeader>
        <CreateOrgForm />
      </InterceptedSheetContent>
    </Sheet>
  )
}
