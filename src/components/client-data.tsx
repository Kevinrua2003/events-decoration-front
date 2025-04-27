'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/types"
import { ContactRoundIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent } from 'react'
import Swal from 'sweetalert2'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

function ClientData() {
  const router = useRouter()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    
    Swal.fire({
      title: "Contract Created!",
      text: `Contract for ${name} has been created!`,
      icon: "success",
      confirmButtonColor: "#000",
    })

    router.push("/dashboard")
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Client Information</CardTitle>
          <CardDescription>
            Fill in the client details to create a contract
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">First Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  name="lastname"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="client@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                placeholder="+1234567890"
                required
              />
            </div>
            
            <Button type="submit" className="w-full mt-4">
              <ContactRoundIcon className="mr-2 h-4 w-4" />
              Create Contract
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ClientData;