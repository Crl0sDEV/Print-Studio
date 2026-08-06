import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>
      
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Terms and Conditions</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Prynt ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p>
              Prynt provides a Software-as-a-Service (SaaS) platform designed for print shop management. We offer tools for order tracking, price estimation, and file management. We do not provide physical printing services; we only supply the software for shop owners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
            <p>
              You must maintain the security of your account and password. Prynt cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Content and Assets</h2>
            <p>
              Shop owners and their customers are solely responsible for the files and assets uploaded to the Platform. Prynt does not claim ownership of your materials, but you grant us the necessary licenses to host and display them as required by the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Disclaimer of Warranties</h2>
            <p>
              The service is provided on an "as is" and "as available" basis. We do not warrant that the service will be uninterrupted, timely, secure, or error-free.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
