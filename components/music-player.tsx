"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, Volume2 } from "lucide-react"
import { useState } from "react"
import { AudioGenerator } from "@/lib/audio-generator"

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioGenerator] = useState(() => new AudioGenerator())

  const toggleMusic = async () => {
    if (isPlaying) {
      setIsPlaying(false)
      console.log("Pausando música")
    } else {
      setIsPlaying(true)
      console.log("Tocando música relaxante")

      try {
        await audioGenerator.playRelaxingMusic()
        // Parar após 5 segundos
        setTimeout(() => {
          setIsPlaying(false)
        }, 5000)
      } catch (error) {
        console.error("Erro ao tocar música:", error)
        setIsPlaying(false)
      }
    }
  }

  return (
    <Card className="w-full bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-center space-x-4">
          <Volume2 className="w-8 h-8 text-purple-600" />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Música Relaxante</h3>
            <Button
              onClick={toggleMusic}
              className="w-20 h-20 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-all duration-200 hover:scale-105"
              aria-label={isPlaying ? "Pausar música" : "Tocar música"}
            >
              {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
