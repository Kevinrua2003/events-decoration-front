'use client'
import { Sparkles, Gem } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#0c0c0c] to-[#0c0c0c]" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="text-center mb-10 animate-[fadeIn_0.8s_ease-out]">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#d4af37] via-[#f5d67b] to-[#d4af37] mb-6 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
            <Gem className="h-9 w-9 text-[#0c0c0c]" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#f5f5f0] tracking-wide" style={{ fontFamily: 'var(--font-playfair)' }}>
            Decorations
          </h1>
          <p className="text-sm text-[#a3a3a3] mt-2 tracking-[0.3em] uppercase" style={{ fontFamily: 'var(--font-lato)' }}>
            Enterprise
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-6" />
        </div>
        
        <div className="animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
          <LoginForm />
        </div>
        
        <p className="text-center text-xs text-[#525252] mt-8" style={{ fontFamily: 'var(--font-lato)' }}>
          © 2026 Decorations Enterprise. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
