import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { EventType } from "@/lib/types"
import { LucideIcon } from "lucide-react"

export default function ToggleItemsSelector({ 
  items,
  value,
  onValueChange
}: { 
  items: {
    id: number
    name: EventType
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
      className="flex w-full"
    >
      {items.map((item) => (
        <ToggleGroupItem 
          className="m-1 p-1 border-2 rounded-md border-black"
          key={item.id} 
          value={item.name.toString()}
          aria-label={`Select ${item.name}`}
        >
          <item.icon className="h-4 w-4 mr-2"/>
          {item.name}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}