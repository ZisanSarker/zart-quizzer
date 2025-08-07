"use client"

interface QuizCardHeaderProps {
  title: string
  status: "completed" | "recommended" | "created"
}

export function QuizCardHeader({ title, status }: QuizCardHeaderProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "completed":
        return { color: "bg-green-500", text: "Completed" }
      case "recommended":
        return { color: "bg-blue-500", text: "Recommended" }
      case "created":
        return { color: "bg-purple-500", text: "Created" }
      default:
        return { color: "bg-gray-500", text: "Unknown" }
    }
  }

  const statusConfig = getStatusConfig()

  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 truncate">
          {title}
        </h3>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <div className={`w-2 h-2 ${statusConfig.color} rounded-full`}></div>
        <span className="text-xs text-muted-foreground">{statusConfig.text}</span>
      </div>
    </div>
  )
} 