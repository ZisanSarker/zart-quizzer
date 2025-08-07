"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface StatsPieChartProps {
  completedQuizzes: number
  attemptedQuizzes: number
}

export function StatsPieChart({ completedQuizzes, attemptedQuizzes }: StatsPieChartProps) {
  const pieChartData = [
    { name: 'Completed', value: completedQuizzes, color: '#8b5cf6' },
    { name: 'Attempted', value: Math.max(attemptedQuizzes - completedQuizzes, 0), color: '#ddd6fe' },
  ]

  return (
    <div className="h-48 w-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieChartData}
            cx="50%"
            cy="50%"
            innerRadius={25}
            outerRadius={50}
            paddingAngle={5}
            dataKey="value"
          >
            {pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
} 