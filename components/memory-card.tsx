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
}

export function MemoryCard({ id, image, alt, isFlipped, isMatched, onClick, disabled }: MemoryCardProps) {
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
              ? "bg-white border-2 border-green-300"
              : "bg-gradient-to-br from-blue-300 to-blue-400 hover:from-blue-400 hover:to-blue-500"
          }`}
          aria-label={isFlipped || isMatched ? `Carta revelada: ${alt}` : "Carta virada para baixo"}
        >
          {isFlipped || isMatched ? (
            <div className="flex flex-col items-center justify-center h-full">
              <img
                src={image || "/placeholder.svg"}
                alt={alt}
                className="w-16 h-16 object-cover rounded-lg mb-2"
                crossOrigin="anonymous"
              />
              {isMatched && (
                <div className="absolute top-2 right-2">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white">
              <HelpCircle className="w-12 h-12 mb-2" />
              <span className="text-lg font-bold">?</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
