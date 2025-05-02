import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { EmployeeRole, EventType } from "@/lib/types"
import { LucideIcon } from "lucide-react"

export default function ToggleItemsSelector({ 
  items,
  value,
  onValueChange
}: { 
  items: {
    id: number
    name: EventType | EmployeeRole
    icon: LucideIcon
  }[]
  value?: string
  onValueChange?: (value: string) => void
}) {
  return (
    <ToggleGroup 
      type="single" 
      value={value}
      onValueChange={onValueChange}
      className="w-full grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 justify-center"
    >
      {items.map((item) => (
        <ToggleGroupItem 
          className="w-full px-4 py-2 border-2 rounded-md border-black 
                    whitespace-normal break-words h-auto min-h-[60px] 
                    flex flex-col items-center justify-center gap-1
                    hover:bg-gray-50 data-[state=on]:bg-black data-[state=on]:text-white"
          key={item.id} 
          value={item.name.toString()}
          aria-label={`Select ${item.name}`}
        >
          <item.icon className="h-5 w-5 flex-shrink-0"/>
          <span className="text-xs font-medium leading-tight">
            {item.name.length > 15 ? `${item.name.substring(0,15)}...` : item.name}
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}