"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Play, Pause } from "lucide-react"
import { AudioGenerator } from "@/lib/audio-generator"

const musicButtons = [
  { id: 1, name: "Música Relaxante", icon: "🎵", color: "from-blue-400 to-blue-500" },
  { id: 2, name: "Sons da Natureza", icon: "🌿", color: "from-green-400 to-green-500" },
  { id: 3, name: "Música Alegre", icon: "🎶", color: "from-yellow-400 to-yellow-500" },
  { id: 4, name: "Ninar", icon: "🌙", color: "from-purple-400 to-purple-500" },
  { id: 5, name: "Instrumentos", icon: "🎹", color: "from-pink-400 to-pink-500" },
  { id: 6, name: "Animais", icon: "🐱", color: "from-orange-400 to-orange-500" },
]

export default function MusicPage() {
  const [user, setUser] = useState<any>(null)
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [audioGenerator] = useState(() => new AudioGenerator())
  const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>({})
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/")
    }
  }, [router])

  const playMusic = async (id: number, name: string) => {
    // Parar música se já estiver tocando
    if (isPlaying[id]) {
      setIsPlaying((prev) => ({ ...prev, [id]: false }))
      return
    }

    // Marcar como tocando
    setIsPlaying((prev) => ({ ...prev, [id]: true }))

    try {
      // Tocar o áudio baseado no ID
      switch (id) {
        case 1: // Música Relaxante
          await audioGenerator.playRelaxingMusic()
          break
        case 2: // Sons da Natureza
          await audioGenerator.playNatureSounds()
          break
        case 3: // Música Alegre
          await audioGenerator.playHappyMusic()
          break
        case 4: // Ninar
          await audioGenerator.playLullaby()
          break
        case 5: // Instrumentos
          await audioGenerator.playInstruments()
          break
        case 6: // Animais
          await audioGenerator.playAnimalSounds()
          break
      }

      console.log(`Tocando: ${name}`)

      // Parar após alguns segundos (duração estimada de cada som)
      setTimeout(() => {
        setIsPlaying((prev) => ({ ...prev, [id]: false }))
      }, 3000)
    } catch (error) {
      console.error("Erro ao tocar áudio:", error)
      setIsPlaying((prev) => ({ ...prev, [id]: false }))
    }
  }

  const goBack = () => {
    router.push("/welcome")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-2xl">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={goBack}
            variant="outline"
            className="h-12 px-6 rounded-xl border-2 border-gray-300 hover:bg-gray-50 bg-transparent"
            aria-label="Voltar para tela de boas-vindas"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Área de Música 🎵</h1>
          <p className="text-xl text-gray-600">Toque nos botões para ouvir diferentes sons!</p>
        </div>

        {/* Grid de Botões Musicais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {musicButtons.map((music) => (
            <Card key={music.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="p-0">
                <Button
                  onClick={() => playMusic(music.id, music.name)}
                  className={`w-full h-32 text-white font-bold text-xl bg-gradient-to-r ${music.color} hover:scale-105 transition-all duration-200 rounded-none`}
                  aria-label={`${playingId === music.id ? "Pausar" : "Tocar"} ${music.name}`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-4xl">{music.icon}</div>
                    <div className="text-lg">{music.name}</div>
                    <div className="text-sm opacity-80">
                      {isPlaying[music.id] ? (
                        <div className="flex items-center">
                          <Pause className="w-4 h-4 mr-1" />
                          Tocando...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Play className="w-4 h-4 mr-1" />
                          Tocar
                        </div>
                      )}
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Indicador de Música Tocando */}
        {Object.values(isPlaying).some((playing) => playing) && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-2 border-purple-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <p className="text-lg font-semibold text-purple-800">Tocando música! 🎵</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
