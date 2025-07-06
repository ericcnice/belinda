"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useState } from "react"
import "./task-animations.css"

interface TaskCardProps {
  task: {
    id: string
    title: string
    icon: string
    completed: boolean
  }
  onComplete: (taskId: string) => void
  index: number
}

export function TaskCard({ task, onComplete, index }: TaskCardProps) {
  const [justCompleted, setJustCompleted] = useState(false)

  // Mapear tarefas para suas animações
  const getAnimationClass = (title: string) => {
    const titleLower = title.toLowerCase()

    if (titleLower.includes("escovar") || titleLower.includes("dente")) {
      return "brush-teeth"
    }
    if (
      titleLower.includes("café") ||
      titleLower.includes("comer") ||
      titleLower.includes("almoç") ||
      titleLower.includes("lanche")
    ) {
      return "eating"
    }
    if (titleLower.includes("vestir") || titleLower.includes("roupa")) {
      return "dressing"
    }
    if (titleLower.includes("cama") || titleLower.includes("arrumar")) {
      return "make-bed"
    }
    if (titleLower.includes("brincar") || titleLower.includes("jogar")) {
      return "playing"
    }
    if (titleLower.includes("estudar") || titleLower.includes("ler") || titleLower.includes("livro")) {
      return "studying"
    }
    if (titleLower.includes("banho") || titleLower.includes("lavar")) {
      return "bathing"
    }
    if (titleLower.includes("dormir") || titleLower.includes("sono")) {
      return "sleeping"
    }

    return "playing" // animação padrão
  }

  const handleComplete = () => {
    setJustCompleted(true)
    setTimeout(() => {
      onComplete(task.id)
      setJustCompleted(false)
    }, 600)
  }

  return (
    <Card
      className={`w-full transition-all duration-300 slide-in-up ${
        task.completed ? "bg-green-100 border-green-300 shadow-md" : "bg-white border-gray-200 hover:shadow-lg"
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`text-4xl task-icon ${
                task.completed ? (justCompleted ? "completed" : "") : getAnimationClass(task.title)
              }`}
              role="img"
              aria-label={task.title}
            >
              {task.icon}
            </div>
            <div>
              <h3
                className={`text-xl font-semibold transition-all duration-300 ${
                  task.completed ? "text-green-800 line-through" : "text-gray-800"
                }`}
              >
                {task.title}
              </h3>
              {!task.completed && <p className="text-sm text-gray-500 mt-1">Toque para completar</p>}
            </div>
          </div>

          <Button
            onClick={handleComplete}
            disabled={task.completed}
            className={`w-16 h-16 rounded-full text-white font-bold text-lg transition-all duration-200 ${
              task.completed
                ? "bg-green-500 cursor-default"
                : "bg-blue-500 hover:bg-blue-600 hover:scale-105 pulse-button"
            }`}
            aria-label={task.completed ? "Tarefa concluída" : `Marcar ${task.title} como concluída`}
          >
            {task.completed ? <Check className="w-8 h-8" /> : <div className="text-2xl">✓</div>}
          </Button>
        </div>

        {/* Barra de progresso visual para tarefa não concluída */}
        {!task.completed && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-400 h-2 rounded-full transition-all duration-1000" style={{ width: "0%" }}></div>
            </div>
          </div>
        )}

        {/* Mensagem de parabéns quando concluída */}
        {task.completed && (
          <div className="mt-3 text-center">
            <span className="text-green-600 font-medium text-sm">🎉 Muito bem! Tarefa concluída!</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
