import Link from "next/link"
import { ArrowLeft, HelpCircle } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata = {
  title: "Frequently Asked Questions | Prynt Studio",
  description: "Common questions and detailed answers regarding Prynt print shop software, ID studio, and subscription billing.",
}

export default function FAQPage() {
  const faqCategories = [
    {
      category: "Platform & Printing Operations",
      items: [
        {
          id: "item-1",
          question: "What is Prynt and who is it designed for?",
          answer: "Prynt is a specialized Software-as-a-Service (SaaS) operating system designed specifically for commercial print shops, photo studios, and copy centers in the Philippines. It unifies online customer storefront ordering, automated pricing calculations, client-side AI background matting, formal attire replacements, and gang-sheet imposition print layouts into a single dashboard.",
        },
        {
          id: "item-2",
          question: "Does Prynt handle the physical printing of jobs?",
          answer: "No. Prynt is exclusively the software provider that empowers shop owners with automated workflows. Physical printing, paper selection, and machine operations are handled directly by your print shop.",
        },
        {
          id: "item-3",
          question: "How do walk-in and online customers place print orders?",
          answer: "Each registered shop receives a unique public storefront link (e.g. /your-shop-slug) and an auto-generated printable QR code. Customers can scan the QR code using their smartphones, choose printing presets, upload photos or PDF files, and instantly submit orders to your dashboard.",
        },
        {
          id: "item-4",
          question: "Can I customize my shop's pricing matrix?",
          answer: "Yes. You can configure custom pricing for different paper sizes, print presets, rush fees, and color options (full color vs grayscale) to provide instant and accurate cost calculations to customers.",
        },
      ],
    },
    {
      category: "Photo Studio & Imposition Engine",
      items: [
        {
          id: "item-5",
          question: "How does the AI Background Remover process customer portraits privately?",
          answer: "The AI matting engine executes 100% locally inside the browser using WebAssembly. Customer photos never get transmitted or stored on remote AI servers, ensuring zero upload latency, strict confidentiality, and continuous operation even on limited internet connections.",
        },
        {
          id: "item-6",
          question: "What attire styles and sizes are available in the ID Photo Lab?",
          answer: "The studio includes Philippine Barong Tagalog (classic and modern pina), Executive Men's and Women's Suits, Formal Blazers, Filipiniana, and Hijab. Supported ID formats include 1x1, 2x2, Philippine Passport Size, 3R, 4R, and standardized PRC/CSC government nametags.",
        },
        {
          id: "item-7",
          question: "What sheet sizes and output formats are supported for print layouts?",
          answer: "The Imposition Gang-Sheet Engine supports 4R (4x6 in), 5R (5x7 in), A4, Short Bond (Letter: 8.5x11 in), Long Bond (Folio: 8.5x13 in), and A3 sheets. Outputs can be exported as print-ready 300 DPI PDFs with cutting crop marks or high-resolution PNG files.",
        },
      ],
    },
    {
      category: "Billing, Plans & Support",
      items: [
        {
          id: "item-8",
          question: "What are the pricing plans available for shop owners?",
          answer: "Prynt provides a Free Starter Plan (PHP 0 forever with 10 AI runs/month, 1x1/2x2 lab, 4R gang sheet) and a Pro Print Master Plan (PHP 199/month or PHP 1,799/year) featuring unlimited AI removals, the full Philippine attire library, PRC/CSC nametag generator, all sheet formats (A4/Long/A3), and 300 DPI watermark-free exports.",
        },
        {
          id: "item-9",
          question: "How do I pay and activate the Pro subscription?",
          answer: "We support direct local payments through GCash and Maya QR. Simply scan the QR code from the Subscription & Billing tab in your dashboard, enter your 12-digit reference number, and upload your payment proof slip for prompt administrative verification.",
        },
        {
          id: "item-10",
          question: "How do I contact customer support if I need assistance?",
          answer: "Shop owners can submit support tickets directly from the 'Support & Help' tab in their dashboard. You can chat in real time with our support administrators and track ticket statuses from submission to resolution.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to Overview
        </Link>

        <div className="mb-10 space-y-2 border-b border-border/40 pb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
            <HelpCircle className="h-4 w-4" />
            <span>Knowledge Base</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-muted-foreground">
            Find answers to common inquiries regarding platform operations, photo studio features, and subscription billing.
          </p>
        </div>

        <div className="space-y-10">
          {faqCategories.map((cat, catIdx) => (
            <div key={catIdx} className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                {cat.category}
              </h2>
              <Accordion className="w-full divide-y divide-border/40 rounded-xl border border-border/50 bg-card p-2 shadow-xs">
                {cat.items.map((item) => (
                  <AccordionItem key={item.id} value={item.id} className="border-none px-4 py-1">
                    <AccordionTrigger className="text-left text-sm font-bold hover:text-primary transition-colors py-3">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground leading-relaxed pt-1 pb-3">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border/40 bg-muted/30 p-6 text-center space-y-2">
          <h3 className="text-sm font-bold">Still have questions?</h3>
          <p className="text-xs text-muted-foreground">
            Our support team is ready to assist you. Log in to your shop dashboard to submit a ticket.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors"
            >
              Sign In to Support Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
