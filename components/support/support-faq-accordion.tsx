import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { HelpCircle } from 'lucide-react'

export function SupportFaqAccordion() {
  const faqs = [
    {
      q: 'How do I upgrade to the Pro Print Master plan?',
      a: 'Go to Subscription & Billing in your sidebar, select Monthly (₱199) or Annual (₱1,799), scan the GCash or Maya QR code, and upload a screenshot of your receipt with the reference number. Our admin verifies and activates your Pro account promptly.',
    },
    {
      q: 'What formats can I export from Photo & Print Studio?',
      a: 'You can export high-resolution 300 DPI PNG cutouts and direct print-ready PDFs with crop marks for 4R, 5R, A4, Short Bond (Letter), Long Bond (Folio), and A3 sheets.',
    },
    {
      q: 'How does client-side AI Background Eraser work?',
      a: 'All AI processing runs 100% locally inside your browser using WebAssembly. Your customer portrait photos are processed privately on your device with zero upload latency.',
    },
    {
      q: 'How do I receive print orders from customers online?',
      a: 'Share your custom shop storefront link (e.g. /carlos-printing-studio). Customers can select print packages, upload image/PDF files, and their orders will instantly appear on your Orders Board.',
    },
  ]

  return (
    <Card className="border-border/40 bg-card/50">
      <CardHeader className="py-3 px-4 border-b border-border/40">
        <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider">
          <HelpCircle className="h-3.5 w-3.5 text-primary" />
          Frequently Asked Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 divide-y divide-border/30 space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className={idx > 0 ? 'pt-3' : ''}>
            <h4 className="text-xs font-bold text-foreground">{faq.q}</h4>
            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
