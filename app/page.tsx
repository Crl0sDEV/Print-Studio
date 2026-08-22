import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Scissors,
  UserCheck,
  FileText,
  Layers,
  QrCode,
  ListTodo,
  Check,
  ArrowRight,
  ShieldCheck,
  Printer,
  Sliders,
  Cpu,
} from 'lucide-react'

export const metadata = {
  title: 'Prynt - Operating System for Philippine Print & Photo Studios',
  description: 'Manage online storefronts, client-side AI background removal, Philippine formal attire suites, government ID packages, and gang-sheet imposition layouts.',
}

export default function Home() {
  const coreFeatures = [
    {
      icon: Scissors,
      title: 'Client-Side AI Background Remover',
      description: 'Executes locally inside the browser using WebAssembly. Customer portraits are processed with zero upload latency, full privacy, and no server fees.',
      spec: 'WebAssembly WASM Engine',
    },
    {
      icon: UserCheck,
      title: 'Philippine Formal Attire Suite',
      description: 'Equip ID photos with Barong Tagalog, Executive Suits, Formal Blazers, Filipiniana, and Hijab with realistic neck matching and color calibration.',
      spec: '5 Formal Attire Categories',
    },
    {
      icon: FileText,
      title: 'PRC & CSC Government Nametag Lab',
      description: 'Generate standardized government nametags conforming strictly to Philippine Civil Service Commission and PRC licensure examination standards.',
      spec: 'CSC & PRC Format Compliant',
    },
    {
      icon: Layers,
      title: 'Imposition Gang-Sheet Engine',
      description: 'Automatically tile 1x1, 2x2, Passport Size, 3R, and 4R package combinations across standard paper sizes with cutting crop marks and spacing controls.',
      spec: '6 Supported Sheet Formats',
    },
    {
      icon: QrCode,
      title: 'Custom Storefront & QR Ordering',
      description: 'Provide walk-in customers and remote clients with a dedicated ordering link and printable QR code with instant pricing matrix calculations.',
      spec: 'Direct File & PDF Uploads',
    },
    {
      icon: ListTodo,
      title: 'Live Orders Board & Notifications',
      description: 'Track incoming jobs from submission to completion, manage file assets, and receive real-time notification alerts whenever new orders arrive.',
      spec: 'Real-Time Status Synchronization',
    },
  ]

  const sheetSpecs = [
    { name: '4R Photo Paper', dimensions: '4.0 x 6.0 in (102 x 152 mm)', typicalYield: '8 pcs (1x1) or 2 pcs (2x2)', bestFor: 'Photo card kiosks and minilabs' },
    { name: '5R Photo Paper', dimensions: '5.0 x 7.0 in (127 x 178 mm)', typicalYield: '12 pcs (1x1) or 4 pcs (2x2)', bestFor: 'Studio portrait packages' },
    { name: 'A4 Standard Paper', dimensions: '8.27 x 11.69 in (210 x 297 mm)', typicalYield: 'Up to 30 pcs (1x1) or combo sheets', bestFor: 'Commercial inkjet and laser printers' },
    { name: 'Short Bond (Letter)', dimensions: '8.5 x 11.0 in (216 x 279 mm)', typicalYield: 'Up to 28 pcs (1x1) or combo packages', bestFor: 'Standard document and photo paper' },
    { name: 'Long Bond (Folio)', dimensions: '8.5 x 13.0 in (216 x 330 mm)', typicalYield: 'Up to 35 pcs (1x1) or high-yield combos', bestFor: 'Philippine legal and commercial printing' },
    { name: 'A3 Production Sheet', dimensions: '11.69 x 16.54 in (297 x 420 mm)', typicalYield: 'High-volume commercial gang runs', bestFor: 'Heavy duty production printers' },
  ]

  const pricingFeatures = {
    starter: [
      '10 AI Background Eraser runs per month',
      'Standard 1x1 and 2x2 ID Photo Lab',
      '4R Photo Paper Gang-Sheet Layout',
      'Branded Customer Storefront Link',
      'Orders Board & Status Management',
      'Standard 150 DPI PNG Export',
    ],
    pro: [
      'Unlimited AI Background Eraser processing',
      'Full Philippine Attire Suite (Barong, Suits, Hijab)',
      'PRC & CSC Government Nametag Generator',
      'All Sheet Formats (4R, 5R, A4, Short, Long, A3)',
      '300 DPI Watermark-Free PDF & PNG Exports',
      'Cutting Guides and Precision Crop Marks',
      'Real-Time Notification Center Alerts',
      'Priority Support Helpdesk Access',
    ],
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-base font-bold tracking-tight">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
              <Image src="/favicon-32x32.png" width={18} height={18} alt="Prynt Logo" className="rounded-xs" />
            </div>
            <span>Prynt<span className="text-primary">.</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Core Features</a>
            <a href="#imposition" className="hover:text-foreground transition-colors">Imposition Specs</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Plans & Pricing</a>
            <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Button
              size="sm"
              nativeButton={false}
              className="font-bold text-xs h-8 px-3.5 shadow-xs"
              render={<Link href="/signup" />}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border/40 py-16 sm:py-24 bg-card/20">
          <div className="container mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 space-y-6">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Cpu className="h-3.5 w-3.5 text-primary" />
              <span>Commercial Print Shop Operating Software</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground max-w-4xl mx-auto leading-tight">
              The complete operating system for modern print shops.
            </h1>

            <p className="mx-auto max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Unify online customer ordering, client-side AI background matting, Philippine formal attire suites, PRC and CSC government nametag generators, and multi-size gang-sheet imposition layouts into a single production workspace.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row pt-2">
              <Button
                size="default"
                nativeButton={false}
                className="w-full sm:w-auto font-bold text-xs h-9 px-6 shadow-xs"
                render={<Link href="/signup" />}
              >
                <span>Create Free Shop Account</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                nativeButton={false}
                size="default"
                className="w-full sm:w-auto text-xs h-9 px-6 border-border/60 font-semibold"
                render={<Link href="/login" />}
              >
                <span>Shop Owner Login</span>
              </Button>
            </div>

            {/* Technical Verification Strip */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
              <div className="p-3 rounded-lg border border-border/40 bg-card/60 space-y-1">
                <div className="text-[10px] uppercase font-mono text-muted-foreground">Processing</div>
                <div className="text-xs font-bold text-foreground">100% In-Browser WASM</div>
              </div>
              <div className="p-3 rounded-lg border border-border/40 bg-card/60 space-y-1">
                <div className="text-[10px] uppercase font-mono text-muted-foreground">Attire Suite</div>
                <div className="text-xs font-bold text-foreground">Barong, Suits, Hijab</div>
              </div>
              <div className="p-3 rounded-lg border border-border/40 bg-card/60 space-y-1">
                <div className="text-[10px] uppercase font-mono text-muted-foreground">Output Quality</div>
                <div className="text-xs font-bold text-foreground">300 DPI PDF with Crop Marks</div>
              </div>
              <div className="p-3 rounded-lg border border-border/40 bg-card/60 space-y-1">
                <div className="text-[10px] uppercase font-mono text-muted-foreground">Billing</div>
                <div className="text-xs font-bold text-foreground">GCash & Maya Verified</div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section id="features" className="py-16 sm:py-20 border-b border-border/40 scroll-mt-14">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="space-y-1.5 text-left sm:text-center max-w-2xl sm:mx-auto">
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-primary border-primary/30">
                Core Capabilities
              </Badge>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                Engineered for daily studio operations
              </h2>
              <p className="text-xs text-muted-foreground">
                Eliminate disconnected desktop editors and manual layout calculations with purpose-built tools.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {coreFeatures.map((item, idx) => {
                const IconComponent = item.icon
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-border/50 bg-card p-5 space-y-3 shadow-xs hover:border-border transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/60 text-primary border border-border/40">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {item.spec}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Imposition Specifications Table */}
        <section id="imposition" className="py-16 sm:py-20 border-b border-border/40 bg-card/20 scroll-mt-14">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-1.5 text-left sm:text-center max-w-2xl sm:mx-auto">
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-primary border-primary/30">
                Imposition Specifications
              </Badge>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                Standard Philippine print paper sizes
              </h2>
              <p className="text-xs text-muted-foreground">
                Automatic photo tiling with precise spacing, alignment, and cutting crop marks.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border/50 bg-card shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border/40 font-semibold text-muted-foreground">
                  <tr>
                    <th className="p-3.5">Sheet Format</th>
                    <th className="p-3.5">Dimensions</th>
                    <th className="p-3.5">Typical Photo Yield</th>
                    <th className="p-3.5">Production Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {sheetSpecs.map((spec, idx) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      <td className="p-3.5 font-bold text-foreground">{spec.name}</td>
                      <td className="p-3.5 font-mono text-muted-foreground">{spec.dimensions}</td>
                      <td className="p-3.5 text-foreground">{spec.typicalYield}</td>
                      <td className="p-3.5 text-muted-foreground">{spec.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 sm:py-20 border-b border-border/40 scroll-mt-14">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="space-y-1.5 text-left sm:text-center max-w-2xl sm:mx-auto">
              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-primary border-primary/30">
                Transparent Pricing
              </Badge>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                Predictable plans for every print volume
              </h2>
              <p className="text-xs text-muted-foreground">
                Start with our free starter plan. Upgrade anytime with local GCash or Maya payments.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto items-stretch">
              {/* Starter Plan */}
              <div className="rounded-xl border border-border/50 bg-card p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xs">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold">Free Starter</h3>
                    <p className="text-xs text-muted-foreground">
                      Essential capabilities for small shops and solo print operators.
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold">PHP 0</span>
                    <span className="text-xs text-muted-foreground">/ forever</span>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border/40">
                    {pricingFeatures.starter.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  nativeButton={false}
                  className="w-full font-bold text-xs h-9 rounded-lg"
                  render={<Link href="/signup" />}
                >
                  Get Started Free
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="rounded-xl border-2 border-primary bg-card p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-md relative">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-foreground">Pro Print Master</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded">
                        Full Studio
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Unrestricted processing for commercial studios and print centers.
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-extrabold text-primary">PHP 199</span>
                      <span className="text-xs text-muted-foreground">/ month</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground font-medium">
                      or PHP 1,799 billed annually (Save 25%)
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border/40">
                    {pricingFeatures.pro.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs font-medium text-foreground">
                        <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  nativeButton={false}
                  className="w-full font-bold text-xs h-9 rounded-lg shadow-xs"
                  render={<Link href="/signup" />}
                >
                  <span>Upgrade to Pro</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Payments verified directly via GCash and Maya reference receipts.</span>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-14 bg-card/40 text-center">
          <div className="container mx-auto max-w-3xl px-4 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to streamline your print studio?
            </h2>
            <p className="text-xs text-muted-foreground">
              Create your account in less than a minute. No credit card required.
            </p>
            <div className="pt-2">
              <Button
                size="default"
                nativeButton={false}
                className="font-bold text-xs h-9 px-6 shadow-xs"
                render={<Link href="/signup" />}
              >
                <span>Get Started Now</span>
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 bg-background">
        <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Image src="/favicon-32x32.png" width={16} height={16} alt="Prynt Logo" className="rounded-xs" />
            <span>Prynt SaaS</span>
            <span className="text-muted-foreground font-normal text-[11px] ml-2">
              © {new Date().getFullYear()} All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}