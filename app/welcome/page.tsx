"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MusicPlayer } from "@/components/music-player"
import { Calendar, Music, ArrowRight } from "lucide-react"

export default function WelcomePage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/")
    }
  }, [router])

  const goToRoutine = () => {
    router.push("/routine")
  }

  const goToMusic = () => {
    router.push("/music")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header de Boas-vindas */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Olá, {user.name}! 👋</h1>
          <p className="text-xl text-gray-600">Bem-vindo de volta!</p>
        </div>

        {/* Avatar Central */}
        <div className="flex justify-center mb-8">
          <Card className="w-40 h-40 rounded-full border-4 border-yellow-300 shadow-xl bg-gradient-to-br from-yellow-100 to-orange-100">
            <CardContent className="flex items-center justify-center h-full p-0">
              <div className="text-8xl">🐻</div>
            </CardContent>
          </Card>
        </div>

        {/* Player de Música */}
        <div className="mb-8">
          <MusicPlayer />
        </div>

        {/* Botões de Navegação */}
        <div className="space-y-4">
          <Button
            onClick={goToRoutine}
            className="w-full h-20 text-xl font-semibold rounded-2xl bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white shadow-lg transition-all duration-200 hover:scale-105"
            aria-label="Ver minhas tarefas de hoje"
          >
            <Calendar className="w-8 h-8 mr-4" />
            Minhas Tarefas de Hoje
            <ArrowRight className="w-6 h-6 ml-4" />
          </Button>

          <Button
            onClick={goToMusic}
            className="w-full h-20 text-xl font-semibold rounded-2xl bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg transition-all duration-200 hover:scale-105"
            aria-label="Ir para área de música"
          >
            <Music className="w-8 h-8 mr-4" />
            Área de Música
            <ArrowRight className="w-6 h-6 ml-4" />
          </Button>
        </div>

        {/* Rodapé */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-500 font-medium">Belinda App</p>
          <p className="text-sm text-gray-400">Sua rotina organizada com carinho</p>
        </div>
      </div>
    </div>
  )
}
