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
import ToggleItemsSelector from "@/components/toggle-items-selector"
import { Employee, EmployeeRole } from "@/lib/types"
import { employeeRoleItems } from "@/lib/constants"
import { updateEmployee } from "@/api/employees/main"
import { SaveIcon } from "lucide-react"
import Swal from "sweetalert2"
import {
  getErrorMessage,
  injectSwalStyles,
  showError,
  showSuccess,
} from "@/lib/swal-config"

interface EditEmployeeDialogProps {
  employee: Employee | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: (updated: Employee) => void
}

function EditEmployeeDialog({
  employee,
  open,
  onOpenChange,
  onSaved,
}: EditEmployeeDialogProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [username, setUsername] = useState("")
  const [role, setRole] = useState("")
  const [password, setPassword] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (employee) {
      setFirstName(employee.firstName)
      setLastName(employee.lastName)
      setEmail(employee.email)
      setPhone(employee.phone)
      setUsername(employee.username)
      setRole(employee.role)
      setPassword("")
    }
  }, [employee])

  const handleSubmit = async () => {
    if (!employee) return
    injectSwalStyles()

    const missing: string[] = []
    if (!firstName.trim()) missing.push("nombre")
    if (!lastName.trim()) missing.push("apellido")
    if (!email.trim()) missing.push("email")
    if (!phone.trim()) missing.push("teléfono")
    if (!username.trim()) missing.push("usuario")
    if (!role) missing.push("rol")

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

    if (!/^\d{8}$/.test(phone)) {
      return Swal.fire({
        title: "Teléfono inválido",
        text: "El número de teléfono debe tener exactamente 8 dígitos",
        icon: "error",
        confirmButtonColor: "#d4af37",
        background: "#1a1a1a",
        color: "#f5f5f0",
      })
    }

    if (password && password.length < 6) {
      return Swal.fire({
        title: "Contraseña débil",
        text: "La contraseña debe tener al menos 6 caracteres",
        icon: "error",
        confirmButtonColor: "#d4af37",
        background: "#1a1a1a",
        color: "#f5f5f0",
      })
    }

    setSaving(true)
    try {
      const updated = await updateEmployee(employee.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        username: username.trim(),
        role: role as EmployeeRole,
        ...(password ? { password } : {}),
      })
      showSuccess("¡Actualizado!", "El empleado ha sido actualizado correctamente")
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
          <DialogTitle>Editar empleado</DialogTitle>
          <DialogDescription>
            Actualiza los datos del empleado{" "}
            {employee ? `#${employee.id}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-employee-first">Nombre</Label>
              <Input
                id="edit-employee-first"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Nombre"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-employee-last">Apellido</Label>
              <Input
                id="edit-employee-last"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Apellido"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-employee-email">Email</Label>
              <Input
                id="edit-employee-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-employee-phone">Teléfono</Label>
              <Input
                id="edit-employee-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="55555555"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-employee-username">Usuario</Label>
              <Input
                id="edit-employee-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="usuario"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-employee-password">
                Contraseña (opcional)
              </Label>
              <Input
                id="edit-employee-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Dejar vacío para no cambiar"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Rol</Label>
            <ToggleItemsSelector
              items={employeeRoleItems}
              value={role}
              onValueChange={setRole}
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

export default EditEmployeeDialog
