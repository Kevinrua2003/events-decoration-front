"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/ui/datepicker"
import { ComboboxDemo } from "@/components/ui/combobox"
import ToggleItemsSelector from "@/components/toggle-items-selector"
import { Event, EventType } from "@/lib/types"
import { eventTypeItems } from "@/lib/constants"
import { updateEvent } from "@/api/events/main"
import { DateRange } from "react-day-picker"
import { SaveIcon } from "lucide-react"
import Swal from "sweetalert2"
import {
  getErrorMessage,
  injectSwalStyles,
  showError,
  showSuccess,
} from "@/lib/swal-config"

interface EditEventDialogProps {
  event: Event | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: (updated: Event) => void
}

function EditEventDialog({
  event,
  open,
  onOpenChange,
  onSaved,
}: EditEventDialogProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("")
  const [location, setLocation] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (event) {
      setName(event.name)
      setAmount(String(event.amount))
      setType(event.type)
      setLocation(event.location)
      setDateRange({
        from: new Date(event.startDate),
        to: new Date(event.endDate),
      })
    }
  }, [event])

  const handleSubmit = async () => {
    if (!event) return
    injectSwalStyles()

    const guests = parseInt(amount, 10)
    const missing: string[] = []
    if (!name.trim()) missing.push("nombre")
    if (!amount.trim() || isNaN(guests) || guests <= 0)
      missing.push("cantidad de invitados")
    if (!type) missing.push("tipo")
    if (!location) missing.push("ubicación")

    if (missing.length > 0) {
      return Swal.fire({
        title: "Campos incompletos",
        text: `Por favor completa: ${missing.join(", ")}`,
        icon: "error",
        confirmButtonColor: "#d4af37",
        background: "#1a1a1a",
        color: "#f5f5f0",
      })
    }

    if (!dateRange?.from || !dateRange?.to) {
      return Swal.fire({
        title: "Campos incompletos",
        text: "Por favor selecciona un rango de fechas válido",
        icon: "error",
        confirmButtonColor: "#d4af37",
        background: "#1a1a1a",
        color: "#f5f5f0",
      })
    }

    if (dateRange.from > dateRange.to) {
      return Swal.fire({
        title: "Fechas inválidas",
        text: "La fecha final no puede ser anterior a la fecha de inicio",
        icon: "error",
        confirmButtonColor: "#d4af37",
        background: "#1a1a1a",
        color: "#f5f5f0",
      })
    }

    setSaving(true)
    try {
      const updated = await updateEvent(event.id, {
        name: name.trim(),
        type: type as EventType,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        location: location as Event["location"],
        amount: guests,
      })
      showSuccess("¡Actualizado!", "El evento ha sido actualizado correctamente")
      onSaved(updated)
      onOpenChange(false)
    } catch (error: any) {
      showError("Error", getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar evento</DialogTitle>
          <DialogDescription>
            Actualiza los datos del evento {event ? `#${event.id}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-event-name">Nombre del evento</Label>
            <Input
              id="edit-event-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mi evento"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-event-guests">Cantidad de invitados</Label>
              <Input
                id="edit-event-guests"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10"
              />
            </div>
            <div className="grid gap-2">
              <Label>Ubicación</Label>
              <ComboboxDemo value={location} onValueChange={setLocation} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Rango de fechas</Label>
            <DatePickerWithRange
              date={dateRange}
              onDateChange={setDateRange}
            />
          </div>

          <div className="grid gap-2">
            <Label>Tipo de evento</Label>
            <ToggleItemsSelector
              items={eventTypeItems}
              value={type}
              onValueChange={setType}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            <SaveIcon className="h-4 w-4 mr-2" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditEventDialog
