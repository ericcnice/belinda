"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, HelpCircle } from "lucide-react"
import { useState } from "react"

interface MemoryCardProps {
  id: number
  image: string
  alt: string
  isFlipped: boolean
  isMatched: boolean
  onClick: (id: number) => void
  disabled: boolean
  isEmoji?: boolean
}

export function MemoryCard({
  id,
  image,
  alt,
  isFlipped,
  isMatched,
  onClick,
  disabled,
  isEmoji = false,
}: MemoryCardProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    if (disabled || isFlipped || isMatched) return

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
    onClick(id)
  }

  return (
    <Card className="w-full aspect-square overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200">
      <CardContent className="p-0 h-full">
        <Button
          onClick={handleClick}
          disabled={disabled || isMatched}
          className={`w-full h-full rounded-lg transition-all duration-300 ${isAnimating ? "scale-95" : "scale-100"} ${
            isFlipped || isMatched
              ? "bg-white border-2 border-green-300 hover:bg-white"
              : "bg-gradient-to-br from-blue-300 to-blue-400 hover:from-blue-400 hover:to-blue-500"
          }`}
          aria-label={isFlipped || isMatched ? `Carta revelada: ${alt}` : "Carta virada para baixo"}
        >
          {isFlipped || isMatched ? (
            <div className="flex flex-col items-center justify-center h-full relative">
              {isEmoji ? (
                <div className="text-6xl mb-2" role="img" aria-label={alt}>
                  {image}
                </div>
              ) : (
                <img
                  src={image || "/placeholder.svg"}
                  alt={alt}
                  className="w-20 h-20 object-cover rounded-lg mb-2 shadow-md"
                  crossOrigin="anonymous"
                />
              )}

              {/* Nome da imagem */}
              <span className="text-sm font-semibold text-gray-700 bg-white/80 px-2 py-1 rounded-full">{alt}</span>

              {isMatched && (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white">
              <HelpCircle className="w-12 h-12 mb-2" />
              <span className="text-2xl font-bold">?</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
