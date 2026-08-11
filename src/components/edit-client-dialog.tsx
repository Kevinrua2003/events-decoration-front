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
import { Client } from "@/lib/types"
import { modifyClient } from "@/api/clients/main"
import { SaveIcon } from "lucide-react"
import Swal from "sweetalert2"
import {
  getErrorMessage,
  injectSwalStyles,
  showError,
  showSuccess,
} from "@/lib/swal-config"

interface EditClientDialogProps {
  client: Client | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: (updated: Client) => void
}

function EditClientDialog({
  client,
  open,
  onOpenChange,
  onSaved,
}: EditClientDialogProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (client) {
      setFirstName(client.firstName)
      setLastName(client.lastName)
      setEmail(client.email)
      setPhone(client.phone)
    }
  }, [client])

  const handleSubmit = async () => {
    if (!client) return
    injectSwalStyles()

    const missing: string[] = []
    if (!firstName.trim()) missing.push("nombre")
    if (!lastName.trim()) missing.push("apellido")
    if (!email.trim()) missing.push("email")
    if (!phone.trim()) missing.push("teléfono")

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

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Swal.fire({
        title: "Email inválido",
        text: "Por favor ingresa una dirección de email válida",
        icon: "error",
        confirmButtonColor: "#d4af37",
        background: "#1a1a1a",
        color: "#f5f5f0",
      })
    }

    if (!/^\+?\d{7,15}$/.test(phone)) {
      return Swal.fire({
        title: "Teléfono inválido",
        text: "El número de teléfono debe tener entre 7 y 15 dígitos",
        icon: "error",
        confirmButtonColor: "#d4af37",
        background: "#1a1a1a",
        color: "#f5f5f0",
      })
    }

    setSaving(true)
    try {
      const updated = await modifyClient(client.id, {
        id: client.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      })
      showSuccess("¡Actualizado!", "El cliente ha sido actualizado correctamente")
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar cliente</DialogTitle>
          <DialogDescription>
            Actualiza los datos del cliente {client ? `#${client.id}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-client-first">Nombre</Label>
              <Input
                id="edit-client-first"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Juan"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-client-last">Apellido</Label>
              <Input
                id="edit-client-last"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Pérez"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-client-email">Email</Label>
              <Input
                id="edit-client-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@ejemplo.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-client-phone">Teléfono</Label>
              <Input
                id="edit-client-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
              />
            </div>
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

export default EditClientDialog
