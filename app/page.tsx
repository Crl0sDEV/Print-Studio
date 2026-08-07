import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Printer, ArrowRight, Kanban, Calculator, UploadCloud, ListTodo, QrCode, WifiOff, Maximize } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
            <Image src="/favicon-32x32.png" width={24} height={24} alt="Prynt Logo" className="rounded-sm" />
            <span>Prynt<span className="text-primary">.</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Sign In
            </Link>
            <Button size="sm" nativeButton={false} render={<Link href="/signup" />}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
          
          <div className="container relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-primary"></span>
              The all-in-one OS for modern print shops
            </div>
            
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Manage your print shop <br className="hidden sm:block" />
              <span className="text-primary">without the chaos.</span>
            </h1>
            
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Transform your printing business with automated pricing calculators, real-time paginated order tracking, and seamless customer file uploads. Built specifically for SME print shops.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" nativeButton={false} className="w-full rounded-full px-8 sm:w-auto" render={<Link href="/signup" />}>
                  Start your shop for free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" nativeButton={false} size="lg" className="w-full rounded-full px-8 sm:w-auto" render={<Link href="/login" />}>
                Shop Owner Login
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-card/30 py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to scale</h2>
              <p className="text-muted-foreground">Replace your messy spreadsheets and Facebook chat orders with a professional system.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-2xl border border-border/40 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Calculator className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Dynamic Pricing Engine</h3>
                <p className="text-muted-foreground">Set complex pricing matrices based on paper size, color mode, and quantity. Customers get instant, accurate quotes.</p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-border/40 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ListTodo className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Smart Orders Table</h3>
                <p className="text-muted-foreground">Manage thousands of print jobs with a paginated, real-time data table. Instantly update statuses without losing track.</p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-border/40 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Secure Asset Storage</h3>
                <p className="text-muted-foreground">Customers upload PDFs and images directly to your shop. Download them instantly from your dashboard securely.</p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-2xl border border-border/40 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <QrCode className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Shop QR Generator</h3>
                <p className="text-muted-foreground">Automatically generate a custom branded QR code for your public storefront. Print it and let walk-in customers scan it!</p>
              </div>

              {/* Feature 5 */}
              <div className="rounded-2xl border border-border/40 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <WifiOff className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Offline-First PWA</h3>
                <p className="text-muted-foreground">Keep working even if your internet goes down. Our offline-sync engine saves your changes locally and uploads them later.</p>
              </div>

              {/* Feature 6 */}
              <div className="rounded-2xl border border-border/40 bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Maximize className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Auto-Layout Studio</h3>
                <p className="text-muted-foreground">Built-in visual studio for ID cards and merchandise. Automatically tile images for printing directly from the browser.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex items-center gap-2 text-lg font-bold tracking-tighter text-foreground">
              <Image src="/favicon-32x32.png" width={20} height={20} alt="Prynt Logo" className="rounded-sm" />
              <span>Prynt.</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Prynt SaaS. Built for printing businesses.
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}