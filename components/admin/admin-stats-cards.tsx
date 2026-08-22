import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Store, Users, Crown, Clock, TrendingUp } from 'lucide-react'

interface AdminStatsCardsProps {
  stats: {
    totalShops: number
    totalUsers: number
    activeProShops: number
    pendingRequests: number
    estimatedRevenuePhp: number
  }
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const cards = [
    {
      title: 'Total Print Shops',
      value: stats.totalShops.toString(),
      description: 'Registered shop accounts',
      icon: Store,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Active Pro Subscriptions',
      value: stats.activeProShops.toString(),
      description: 'Paying print masters',
      icon: Crown,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Pending Verifications',
      value: stats.pendingRequests.toString(),
      description: 'GCash/Maya receipts to review',
      icon: Clock,
      color: stats.pendingRequests > 0 ? 'text-rose-500' : 'text-emerald-500',
      bg: stats.pendingRequests > 0 ? 'bg-rose-500/10' : 'bg-emerald-500/10',
    },
    {
      title: 'Estimated Monthly Revenue',
      value: `₱${stats.estimatedRevenuePhp.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      description: 'Active subscription run-rate',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx} className="border-border/40 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
              <card.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{card.value}</div>
            <p className="text-[11px] text-muted-foreground mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
