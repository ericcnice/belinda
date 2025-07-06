"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Erro no login:", error.message)
        alert("Erro no login. Verifique suas credenciais.")
      } else {
        // Salvar dados do usuário no localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.user?.id,
            email: data.user?.email,
            name: data.user?.email?.split("@")[0] || "Criança",
            is_guest: false,
          }),
        )
        router.push("/welcome")
      }
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = () => {
    // Login como convidado
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: "guest",
        name: "Lucas",
        is_guest: true,
      }),
    )
    router.push("/welcome")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="text-6xl mb-4">🧩</div>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">Belinda</CardTitle>
          <p className="text-lg text-gray-600">Minha Rotina Divertida</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg font-medium text-gray-700">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-400"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-lg font-medium text-gray-700">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-400"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-xl font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-200 hover:scale-105"
              aria-label="Fazer login"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-gray-500 mb-3">ou</p>
            <Button
              onClick={handleGuestLogin}
              variant="outline"
              className="w-full h-12 text-lg font-medium rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 bg-transparent"
              aria-label="Entrar como convidado"
            >
              Entrar como Convidado
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
