"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip } from "recharts"

interface StatsLineChartProps {
  scoreChartData: Array<{
    day: string
    score: number
    target: number
    aboveTarget: boolean
  }>
}

export function StatsLineChart({ scoreChartData }: StatsLineChartProps) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={scoreChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="day" 
            stroke="#6b7280" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(value) => `${value}%`}
            allowDataOverflow={false}
            scale="linear"
            type="number"
            tickCount={6}
            minTickGap={10}
          />
          {/* Grid lines for each range */}
          <ReferenceLine y={20} stroke="#374151" strokeDasharray="3 3" strokeWidth={1} opacity={0.3} />
          <ReferenceLine y={40} stroke="#374151" strokeDasharray="3 3" strokeWidth={1} opacity={0.3} />
          <ReferenceLine y={60} stroke="#374151" strokeDasharray="3 3" strokeWidth={1} opacity={0.3} />
          <ReferenceLine y={80} stroke="#374151" strokeDasharray="3 3" strokeWidth={1} opacity={0.3} />
          <ReferenceLine 
            y={85} 
            stroke="#3b82f6" 
            strokeDasharray="3 3" 
            strokeWidth={2}
            label={{ value: "Target", position: "insideTopRight", fontSize: 10, fill: "#3b82f6" }}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-sm text-muted-foreground">Score: {payload[0].value}%</p>
                  </div>
                )
              }
              return null
            }}
          />
          {/* Performance line with conditional colors */}
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={(props) => {
              const { cx, cy, payload } = props;
              const color = payload.aboveTarget ? '#f59e0b' : '#10b981';
              return (
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={4} 
                  fill={color} 
                  stroke={color} 
                  strokeWidth={2}
                />
              );
            }}
            activeDot={(props) => {
              const { cx, cy, payload } = props;
              const color = payload.aboveTarget ? '#f59e0b' : '#10b981';
              return (
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={6} 
                  fill="#ffffff" 
                  stroke={color} 
                  strokeWidth={2}
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 