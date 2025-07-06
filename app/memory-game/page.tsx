"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MemoryCard } from "@/components/memory-card"
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react"

// Array de imagens para o jogo (facilmente substituível por URLs do Supabase Storage)
const gameImages = [
  { id: 1, src: "🐶", alt: "Cachorro", isEmoji: true },
  { id: 2, src: "🐱", alt: "Gato", isEmoji: true },
  { id: 3, src: "🐰", alt: "Coelho", isEmoji: true },
  { id: 4, src: "🦋", alt: "Borboleta", isEmoji: true },
  { id: 5, src: "🍎", alt: "Maçã", isEmoji: true },
  { id: 6, src: "🍌", alt: "Banana", isEmoji: true },
  { id: 7, src: "🍓", alt: "Morango", isEmoji: true },
  { id: 8, src: "🌻", alt: "Girassol", isEmoji: true },
]

interface GameCard {
  id: number
  pairId: number
  image: string
  alt: string
  isFlipped: boolean
  isMatched: boolean
  isEmoji: boolean
}

export default function MemoryGamePage() {
  const [user, setUser] = useState<any>(null)
  const [cards, setCards] = useState<GameCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      router.push("/")
    }
    initializeGame()
  }, [router])

  const initializeGame = () => {
    // Criar pares de cartas
    const pairs: GameCard[] = []
    gameImages.forEach((image, index) => {
      // Primeira carta do par
      pairs.push({
        id: index * 2,
        pairId: image.id,
        image: image.src,
        alt: image.alt,
        isFlipped: false,
        isMatched: false,
        isEmoji: image.isEmoji,
      })
      // Segunda carta do par
      pairs.push({
        id: index * 2 + 1,
        pairId: image.id,
        image: image.src,
        alt: image.alt,
        isFlipped: false,
        isMatched: false,
        isEmoji: image.isEmoji,
      })
    })

    // Embaralhar as cartas
    const shuffledCards = pairs.sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs([])
    setMoves(0)
    setGameCompleted(false)
    setIsChecking(false)
  }

  const handleCardClick = (cardId: number) => {
    if (isChecking || flippedCards.length >= 2) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    // Atualizar estado das cartas
    setCards((prevCards) => prevCards.map((card) => (card.id === cardId ? { ...card, isFlipped: true } : card)))

    // Se duas cartas foram viradas, verificar se é um par
    if (newFlippedCards.length === 2) {
      setIsChecking(true)
      setMoves((prev) => prev + 1)

      const [firstCardId, secondCardId] = newFlippedCards
      const firstCard = cards.find((card) => card.id === firstCardId)
      const secondCard = cards.find((card) => card.id === secondCardId)

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Par encontrado!
        const newMatchedPairs = [...matchedPairs, firstCard.pairId]
        setMatchedPairs(newMatchedPairs)

        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstCardId || card.id === secondCardId ? { ...card, isMatched: true } : card,
          ),
        )

        setFlippedCards([])
        setIsChecking(false)

        // Verificar se o jogo foi completado
        if (newMatchedPairs.length === gameImages.length) {
          setTimeout(() => setGameCompleted(true), 500)
        }
      } else {
        // Não é um par, virar as cartas de volta após 1 segundo
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCardId || card.id === secondCardId ? { ...card, isFlipped: false } : card,
            ),
          )
          setFlippedCards([])
          setIsChecking(false)
        }, 1000)
      }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
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

          <Button
            onClick={initializeGame}
            variant="outline"
            className="h-12 px-6 rounded-xl border-2 border-blue-300 hover:bg-blue-50 text-blue-600 bg-transparent"
            aria-label="Reiniciar jogo"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Novo Jogo
          </Button>
        </div>

        {/* Título e Estatísticas */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Jogo da Memória 🧠</h1>
          <div className="bg-white rounded-2xl p-4 shadow-lg inline-block">
            <p className="text-xl font-semibold text-gray-700">
              Pares encontrados: {matchedPairs.length} de {gameImages.length}
            </p>
            <p className="text-lg text-gray-600 mt-1">Tentativas: {moves}</p>
          </div>
        </div>

        {/* Grid do Jogo */}
        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
          {cards.map((card) => (
            <MemoryCard
              key={card.id}
              id={card.id}
              image={card.image}
              alt={card.alt}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onClick={handleCardClick}
              disabled={isChecking}
              isEmoji={card.isEmoji}
            />
          ))}
        </div>

        {/* Mensagem de Parabéns */}
        {gameCompleted && (
          <Card className="max-w-md mx-auto bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 shadow-xl">
            <CardContent className="text-center p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-orange-800 mb-4">Parabéns, {user.name}!</h2>
              <p className="text-xl text-orange-700 mb-2">Você encontrou todos os pares!</p>
              <p className="text-lg text-orange-600 mb-6">Completou em {moves} tentativas</p>

              <div className="flex justify-center space-x-2 mb-6">
                <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" />
                <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
                <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>

              <Button
                onClick={initializeGame}
                className="w-full h-16 text-xl font-semibold rounded-2xl bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white shadow-lg transition-all duration-200 hover:scale-105"
                aria-label="Jogar novamente"
              >
                Jogar Novamente
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
