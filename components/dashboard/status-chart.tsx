'use client'

import { Cell, Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

const chartConfig = {
  pending: { label: "Pending", color: "var(--chart-1)" },
  approved: { label: "Approved", color: "var(--chart-2)" },
  printing: { label: "Printing", color: "var(--chart-3)" },
  finishing: { label: "Finishing", color: "var(--chart-4)" },
  ready: { label: "Ready", color: "var(--chart-5)" },
  completed: { label: "Completed", color: "var(--primary)" },
} satisfies ChartConfig

export function StatusChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) {
    return <div className="flex h-[300px] items-center justify-center text-muted-foreground">No status data yet.</div>
  }

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          innerRadius={60}
          strokeWidth={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`var(--color-${entry.status.toLowerCase()})`} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent />} className="-translate-y-2 flex-wrap gap-2" />
      </PieChart>
    </ChartContainer>
  )
}
