import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function CustomersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: shop } = await supabase
    .from('shops')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!shop) redirect('/onboarding')

  // Fetch all completed/paid orders to aggregate customer data
  const { data: orders } = await supabase
    .from('orders')
    .select('customer_name, customer_contact, total_amount, payment_status, created_at')
    .eq('shop_id', shop.id)
    .neq('status', 'cancelled')

  // Aggregate Customer Data
  const customersMap: Record<string, any> = {}

  orders?.forEach((order) => {
    const key = `${order.customer_name}-${order.customer_contact}`
    
    if (!customersMap[key]) {
      customersMap[key] = {
        name: order.customer_name,
        contact: order.customer_contact || 'N/A',
        totalOrders: 0,
        lifetimeValue: 0,
        lastOrder: order.created_at,
      }
    }
    
    customersMap[key].totalOrders += 1
    
    if (order.payment_status === 'paid') {
      customersMap[key].lifetimeValue += Number(order.total_amount || 0)
    }

    if (new Date(order.created_at) > new Date(customersMap[key].lastOrder)) {
      customersMap[key].lastOrder = order.created_at
    }
  })

  const customers = Object.values(customersMap).sort((a, b) => b.lifetimeValue - a.lifetimeValue)

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Customer CRM</h1>
        <p className="text-muted-foreground">Manage your clients, track their lifetime value (LTV), and identify repeat customers.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
          <CardDescription>All customers who have placed orders with your shop, sorted by highest spender.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/40">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-center">Total Orders</TableHead>
                  <TableHead className="text-right">Lifetime Value</TableHead>
                  <TableHead className="text-right">Last Order Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {customer.name}
                          {customer.totalOrders >= 5 && <Badge className="bg-amber-500 hover:bg-amber-600 text-[10px] px-1.5">VIP</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>{customer.contact}</TableCell>
                      <TableCell className="text-center">{customer.totalOrders}</TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        ₱{customer.lifetimeValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm">
                        {new Date(customer.lastOrder).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
