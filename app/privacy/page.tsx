import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/" className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>
      
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, including your name, email address, shop details, and any print assets or files uploaded during the order process.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to operate, maintain, and provide the features of Prynt. We also use this information to communicate with you, process transactions, and send related information including confirmations and receipts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
            <p>
              We implement industry-standard security measures, including Row-Level Security (RLS) on our databases, to protect your personal information and uploaded files from unauthorized access or disclosure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Sharing of Information</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except as necessary to provide the service (e.g., cloud hosting providers).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at support@prynt.vercel.app.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
