import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>
      
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground">Everything you need to know about using Prynt for your business.</p>
      </div>
      
      <Accordion className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is Prynt?</AccordionTrigger>
          <AccordionContent>
            Prynt is a specialized Software-as-a-Service (SaaS) platform built for small to medium print shops. It helps you manage online orders, automate price calculations based on paper/color/quantity, and track job statuses using a Kanban board.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>Do you handle the actual printing?</AccordionTrigger>
          <AccordionContent>
            No. Prynt is solely the software provider. We give print shop owners the tools to run their own business. If you are a customer placing an order, the physical printing is handled by the specific print shop you are ordering from.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>How secure are my uploaded files?</AccordionTrigger>
          <AccordionContent>
            Very secure. All uploaded print assets are stored in our secure cloud storage (powered by Supabase) and are only accessible by the specific print shop owner handling your order.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger>Can I customize my shop's pricing?</AccordionTrigger>
          <AccordionContent>
            Absolutely! Our Dynamic Pricing Engine allows shop owners to set complex pricing matrices (e.g., different prices for Rush vs Standard, or Grayscale vs Colored).
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger>Does Prynt work offline?</AccordionTrigger>
          <AccordionContent>
            Prynt includes robust offline-sync capabilities for shop owners. You can update order statuses even when your internet drops, and the system will automatically sync with the cloud once your connection is restored.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
