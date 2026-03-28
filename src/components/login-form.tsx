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
import { showWelcomeMessage, injectSwalStyles } from "@/lib/swal-config"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);                                        
    const data = new FormData(e.currentTarget);
    const email = data.get('email') as string;
    const pass = data.get('password') as string;

    const res = await signIn("credentials", {
      redirect: false,
      username: email,
      password: pass,
      callbackUrl: "/dashboard",
    });

    if (res?.error) {
      injectSwalStyles();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Usuario o contraseña incorrectos',
        background: '#1a1a1a',
        color: '#f5f5f0',
        confirmButtonColor: '#d4af37',
        confirmButtonText: 'Aceptar',
      });
      setLoading(false);
      return;
    }

    const userName = email.split('@')[0];
    showWelcomeMessage(userName);
    router.push("/dashboard"); 
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-[#1a1a1a] border-[#333333] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl text-[#f5f5f0] font-serif" style={{ fontFamily: 'var(--font-playfair)' }}>
            Bienvenido
          </CardTitle>
          <CardDescription className="text-[#737373]">
            Ingresa tus credenciales para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[#a3a3a3] text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="correo@ejemplo.com"
                  required
                  className="bg-[#262626] border-[#333333] text-[#f5f5f0] placeholder:text-[#525252] focus:border-[#d4af37] focus:ring-[#d4af37] transition-all duration-300"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-[#a3a3a3] text-sm">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  name="password" 
                  required 
                  className="bg-[#262626] border-[#333333] text-[#f5f5f0] placeholder:text-[#525252] focus:border-[#d4af37] focus:ring-[#d4af37] transition-all duration-300" 
                />
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-[#d4af37] via-[#f5d67b] to-[#d4af37] text-[#0c0c0c] font-semibold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 mt-2" 
                disabled={loading} 
                type="submit"
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
