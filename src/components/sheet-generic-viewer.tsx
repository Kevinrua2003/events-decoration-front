import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ReactNode } from "react"

interface SheetProps {
  trigger: ReactNode,
  title: ReactNode,
  description?: ReactNode,
  body: ReactNode,
  footer?: ReactNode,
}

export function SheetViewer({trigger, title, description, body, footer} : SheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description &&
            <SheetDescription>
              {description}
            </SheetDescription>
          }
        </SheetHeader>
        {body}
        {footer && 
          <SheetFooter>
            <SheetClose asChild>
              {footer}
            </SheetClose>
          </SheetFooter>
        }
      </SheetContent>
    </Sheet>
  )
}
