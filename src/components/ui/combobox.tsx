"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const locations = [
  {
    value: "Playa",
    label: "Playa",
  },
  {
    value: "Plaza",
    label: "Plaza",
  },
  {
    value: "Habana Vieja",
    label: "Habana Vieja",
  },
  {
    value: "Cerro",
    label: "Cerro",
  },
  {
    value: "Habana del Este",
    label: "Habana del Este",
  },
]

export function ComboboxDemo({
  value,
  onValueChange
}: {
  value?: string;
  onValueChange?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex h-9 w-full min-w-0 justify-between text-wrap"
        >
          {value
            ? locations.find((framework) => framework.value === value)?.label
            : "Select location..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search location..."/>
          <CommandList defaultValue={locations[0].value} >
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {locations.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    onValueChange?.(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
