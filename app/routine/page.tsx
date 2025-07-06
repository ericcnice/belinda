"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/task-card"
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react"
import { supabase, type Task } from "@/lib/supabase"

const defaultTasks: Task[] = [
  { id: "1", title: "Escovar os Dentes", icon: "🦷", completed: false },
  { id: "2", title: "Tomar Café da Manhã", icon: "🥐", completed: false },
  { id: "3", title: "Se Vestir", icon: "👕", completed: false },
  { id: "4", title: "Arrumar a Cama", icon: "🛏️", completed: false },
  { id: "5", title: "Brincar", icon: "🧸", completed: false },
]

export default function RoutinePage() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks)
  const [user, setUser] = useState<any>(null)
  const [completedCount, setCompletedCount] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
      loadTasks(JSON.parse(userData))
    } else {
      router.push("/")
    }
  }, [router])

  useEffect(() => {
    const completed = tasks.filter((task) => task.completed).length
    const previousCount = completedCount
    setCompletedCount(completed)

    // Mostrar celebração quando completar todas as tarefas
    if (completed === tasks.length && completed > previousCount) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [tasks, completedCount])

  const loadTasks = async (userData: any) => {
    if (userData.is_guest) {
      // Para convidados, usar localStorage
      const savedTasks = localStorage.getItem("guestTasks")
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks))
      }
    } else {
      // Para usuários logados, carregar do Supabase
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", userData.id)
          .eq("date", new Date().toISOString().split("T")[0])

        if (error) {
          console.error("Erro ao carregar tarefas:", error)
        } else if (data && data.length > 0) {
          setTasks(data)
        }
      } catch (error) {
        console.error("Erro:", error)
      }
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    const updatedTasks = tasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task))
    setTasks(updatedTasks)

    if (user?.is_guest) {
      // Salvar no localStorage para convidados
      localStorage.setItem("guestTasks", JSON.stringify(updatedTasks))
    } else {
      // Salvar no Supabase para usuários logados
      try {
        const { error } = await supabase.from("tasks").upsert({
          id: taskId,
          user_id: user.id,
          title: tasks.find((t) => t.id === taskId)?.title,
          icon: tasks.find((t) => t.id === taskId)?.icon,
          completed: true,
          date: new Date().toISOString().split("T")[0],
        })

        if (error) {
          console.error("Erro ao salvar tarefa:", error)
        }
      } catch (error) {
        console.error("Erro:", error)
      }
    }
  }

  const resetTasks = () => {
    const resetTasks = tasks.map((task) => ({ ...task, completed: false }))
    setTasks(resetTasks)

    if (user?.is_guest) {
      localStorage.setItem("guestTasks", JSON.stringify(resetTasks))
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
            onClick={resetTasks}
            variant="outline"
            className="h-12 px-6 rounded-xl border-2 border-orange-300 hover:bg-orange-50 text-orange-600 bg-transparent"
            aria-label="Reiniciar todas as tarefas"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reiniciar
          </Button>
        </div>

        {/* Título e Progresso */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Minhas Tarefas de Hoje 📋</h1>
          <div className="bg-white rounded-2xl p-4 shadow-lg inline-block">
            <p className="text-2xl font-semibold text-gray-700">
              {completedCount} de {tasks.length} concluídas
            </p>
            <div className="w-64 bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="bg-gradient-to-r from-green-400 to-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / tasks.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Lista de Tarefas */}
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <TaskCard key={task.id} task={task} onComplete={handleCompleteTask} index={index} />
          ))}
        </div>

        {/* Mensagem de Parabéns */}
        {completedCount === tasks.length && (
          <div
            className={`text-center mt-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl border-2 border-yellow-300 ${showCelebration ? "animate-bounce" : ""}`}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-orange-800 mb-2">Parabéns, {user.name}!</h2>
            <p className="text-xl text-orange-700 mb-4">Você completou todas as tarefas de hoje!</p>
            <div className="flex justify-center space-x-2">
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" style={{ animationDelay: "0.2s" }} />
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
