'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Client, cn, Contract } from "@/lib/types"
import { ContactRoundIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import Swal from 'sweetalert2'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { getClientByEmail, createClient } from "@/api/clients/main"
import { getContracts, createContract } from "@/api/contracts/main"

interface ClientDataProps {
  eventId: number
  productIds: number[]
  serviceIds: number[]
}

function ClientData({ eventId, productIds, serviceIds }: ClientDataProps) {
  
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    lastname: '',
    email: '',
    phone: '',
    resources: ''
  })

  const validateFields = (name: string, lastname: string, email: string, phone: string) => {
    const newErrors = {
      name: !name.trim() ? 'Name required' : '',
      lastname: !lastname.trim() ? 'Last name required' : '',
      email: !email.trim() ? 'Email required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Invalid email' : '',
      phone: !phone.trim() ? 'Phone required' : !/^\+?\d{7,15}$/.test(phone) ? 'Invalid phone' : '',
      resources: (productIds.length === 0 && serviceIds.length === 0) ? 'Must select at least a product or service' : ''
    }
    
    setErrors(newErrors)
    return Object.values(newErrors).every(error => error === '')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const { name, lastname, email, phone } = formData;
    if (!validateFields(name, lastname, email, phone)) {
      setIsSubmitting(false);
      return;
    }
  
    try {
      let client: Client;
      try {
        client = await getClientByEmail(email);
        console.log("Client found:", client);
      } catch (error: any) {
        console.warn("Client not found, creating new one");
        client = await createClient({
          id: 0, 
          firstName: name,
          lastName: lastname,
          email,
          phone,
        });
        console.log("Client created:", client);
      }
  
      const contracts = await getContracts();
      const exists = contracts.some((cont) => cont.eventId === eventId && cont.clientId === client.id);
  
      const createAndNotifyContract = async (client: Client) => {
        const contract: Contract = {
          id: 0, 
          clientId: client.id,
          eventId,
          createdAt: new Date(),
        };
        await createContract(contract);
        Swal.fire({
          title: 'Successful operation',
          text: 'Contract has been created.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#000',
        });
        
      };
  
      if (exists) {
        const selection = await Swal.fire({
          title: '¿Create new contract?',
          html: `El cliente ya tiene un contrato para este evento.<br>¿Desea crear otro?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, crear nuevo',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#000',
        });
  
        if (selection.isConfirmed) {
          await createAndNotifyContract(client);
        }
      } else {
        await createAndNotifyContract(client);
      }
    } catch (error: any) {
      console.error("Error en handleSubmit:", error);
      Swal.fire({
        title: 'Error',
        text: error instanceof Error ? error.message : 'Ocurrió un error en la operación',
        icon: 'error',
        confirmButtonColor: '#000',
      });
    } finally {
      setIsSubmitting(false);
      router.push("/dashboard");
    }
  };
  

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Información del Cliente</CardTitle>
          <CardDescription>
            Completa los datos para crear cliente y contrato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Juan"
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Apellido</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                  placeholder="Pérez"
                  disabled={isSubmitting}
                />
                {errors.lastname && <p className="text-red-500 text-xs">{errors.lastname}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="cliente@ejemplo.com"
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+1234567890"
                disabled={isSubmitting}
              />
              {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-4"
              disabled={isSubmitting || (productIds.length === 0 && serviceIds.length === 0)}
            >
              <ContactRoundIcon className="mr-2 h-4 w-4" />
              {isSubmitting ? "Procesando..." : "Crear Cliente y Contrato"}
            </Button>
            {errors.resources && <p className="text-red-500 text-xs text-center">{errors.resources}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ClientData