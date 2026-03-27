'use client'
import { cn } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Swal from 'sweetalert2'
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { signIn } from "next-auth/react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setLoading(true);                                        
    // const data = new FormData(e.currentTarget);
    // const email = data.get('email') as string;
    // const pass = data.get('password') as string;

    // const res = await signIn("credentials", {
    //   redirect: false,
    //   username: email,
    //   password: pass,
    //   callbackUrl: "/dashboard",
    // });

    // if (res?.error) {
    //   Swal.fire("Error", "Usuario o contraseña incorrectos", "error");
    //   setLoading(false);
    //   return;
    // }

    router.push("/dashboard"); 
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center pb-4">
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="correo@ejemplo.com"
                  required
                  className="minimal-input"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <Input id="password" type="password" name="password" required className="minimal-input" />
              </div>
              <Button className="w-full minimal-button" disabled={loading} type="submit">
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
