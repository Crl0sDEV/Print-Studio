import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Printer, Calculator } from 'lucide-react'

interface StatsOverviewProps {
  totalOrders: number;
  presetsCount: number;
  totalRevenue: number;
}

export function StatsOverview({ totalOrders, presetsCount, totalRevenue }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card className="border-border/40 bg-card/60 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Shop Orders</CardTitle>
          <Package className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalOrders}</div>
          <p className="mt-1 text-xs text-muted-foreground">Recorded customer jobs</p>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-card/60 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Configured Presets</CardTitle>
          <Printer className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{presetsCount || 0}</div>
          <p className="mt-1 text-xs text-muted-foreground">Active size & paper templates</p>
        </CardContent>
      </Card>

      <Card className="border-border/40 bg-card/60 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue Paid</CardTitle>
          <Calculator className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            ₱{totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">From completed payments</p>
        </CardContent>
      </Card>
    </div>
  )
}
