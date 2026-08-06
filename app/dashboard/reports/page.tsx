import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { StatusChart } from '@/components/dashboard/status-chart'
import { BarChart3, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'

export default async function ReportsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: shop } = await supabase
    .from('shops')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!shop) redirect('/onboarding')

  // Fetch all orders for this shop
  const { data: orders } = await supabase
    .from('orders')
    .select('created_at, total_amount, payment_status, status')
    .eq('shop_id', shop.id)
    .neq('status', 'cancelled')
    .order('created_at', { ascending: true })

  // Data processing
  let totalRevenue = 0
  let pendingRevenue = 0
  let totalCompleted = 0
  
  const dailyData: Record<string, number> = {}
  const statusData: Record<string, number> = {
    pending: 0,
    approved: 0,
    printing: 0,
    finishing: 0,
    ready: 0,
    completed: 0
  }

  orders?.forEach((order) => {
    // Analytics Metrics
    if (order.payment_status === 'paid') {
      totalRevenue += Number(order.total_amount || 0)
    } else {
      pendingRevenue += Number(order.total_amount || 0)
    }

    if (order.status === 'completed') totalCompleted++

    // Grouping by Date for Revenue Chart
    const date = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (order.payment_status === 'paid') {
      dailyData[date] = (dailyData[date] || 0) + Number(order.total_amount || 0)
    }

    // Grouping by Status for Pie Chart
    if (statusData[order.status] !== undefined) {
      statusData[order.status]++
    }
  })

  // Format data for Recharts
  const revenueChartData = Object.keys(dailyData).map(date => ({
    date,
    revenue: dailyData[date]
  }))

  const statusChartData = Object.keys(statusData).map(status => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count: statusData[status],
    fill: `var(--color-${status})`
  })).filter(d => d.count > 0)

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Sales & Reports</h1>
        <p className="text-muted-foreground">Monitor your shop's performance, revenue trends, and order distribution.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₱{totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Collectibles</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">₱{pendingRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">Unpaid orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompleted}</div>
            <p className="text-xs text-muted-foreground mt-1">Total fulfilled orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Orders</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Excluding cancelled</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Daily Revenue</CardTitle>
            <CardDescription>Your shop's daily earnings from paid orders.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart data={revenueChartData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>Breakdown of current order statuses.</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusChart data={statusChartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
