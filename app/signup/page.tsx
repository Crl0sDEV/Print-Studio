import Link from 'next/link'
import { AuthCard } from '@/components/auth/auth-card'
import { SignupForm } from '@/components/auth/signup-form'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <AuthCard
      customLogo="/favicon-32x32.png"
      title="Create shop owner account"
      description="Set up your secure print shop management studio"
      error={error}
      maxWidth="lg"
      footer={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log In
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  )
}