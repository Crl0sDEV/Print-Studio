export type PlanTierKey = 'free' | 'pro_monthly' | 'pro_annual' | 'pro'

export interface PlanFeature {
  name: string
  description: string
  isProOnly: boolean
}

export interface PlanDefinition {
  id: PlanTierKey
  name: string
  pricePhp: number
  billingInterval: 'month' | 'year' | 'forever'
  discountBadge?: string
  description: string
  features: string[]
  limits: {
    maxAiRemovalsPerMonth: number | 'unlimited'
    hasAttireSuite: boolean
    hasNametagGen: boolean
    hasAllImpositionPapers: boolean
    hasWatermarkFreeExport: boolean
    hasPriorityRealtime: boolean
  }
}

export const ADMIN_PAYMENT_INFO = {
  accountName: 'Prynt Studio Admin',
  gcash: {
    mobileNumber: '0912-345-6789',
    qrImage: '/gcash-qr-sample.png',
  },
  maya: {
    mobileNumber: '0912-345-6789',
    qrImage: '/maya-qr-sample.png',
  },
}

export const SAAS_PLANS: Record<string, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'Free Starter',
    pricePhp: 0,
    billingInterval: 'forever',
    description: 'Essential tools for micro-shops and casual ID printing.',
    features: [
      'Public Customer Storefront Link (/[slug])',
      'Basic 1x1 & 2x2 Philippine ID Maker',
      'Standard 4R Photo Paper Imposition',
      'Up to 10 AI Background Eraser uses / month',
      'Basic Document Scan Enhancer',
      'Standard Order Management Board',
    ],
    limits: {
      maxAiRemovalsPerMonth: 10,
      hasAttireSuite: false,
      hasNametagGen: false,
      hasAllImpositionPapers: false,
      hasWatermarkFreeExport: false,
      hasPriorityRealtime: false,
    },
  },
  pro_monthly: {
    id: 'pro_monthly',
    name: 'Pro Print Master (Monthly)',
    pricePhp: 199,
    billingInterval: 'month',
    description: 'Full studio firepower for busy printing shops & studios.',
    features: [
      'Unlimited AI Background Eraser',
      'Full Formal Attire Suite (Barong, Suits, Filipiniana)',
      'Official PRC & CSC Nametag Overlay Generator',
      'All Gang Sheet Sizes (4R, 5R, A4, Short, Long, A3)',
      'High-Resolution 300 DPI PNG & PDF Export',
      'Priority Realtime Notifications & Offline Sync',
      'Unlimited Public Orders & Storefront Customization',
    ],
    limits: {
      maxAiRemovalsPerMonth: 'unlimited',
      hasAttireSuite: true,
      hasNametagGen: true,
      hasAllImpositionPapers: true,
      hasWatermarkFreeExport: true,
      hasPriorityRealtime: true,
    },
  },
  pro_annual: {
    id: 'pro_annual',
    name: 'Pro Print Master (Annual)',
    pricePhp: 1799,
    billingInterval: 'year',
    discountBadge: 'Save ₱589 (25% OFF)',
    description: 'Best value for dedicated shop owners. Get 3 months free.',
    features: [
      'Everything in Pro Monthly',
      'Discounted Rate (Only ₱149 / month)',
      'VIP Priority Support & Early Feature Access',
      '1 Year Uninterrupted Full Studio Access',
    ],
    limits: {
      maxAiRemovalsPerMonth: 'unlimited',
      hasAttireSuite: true,
      hasNametagGen: true,
      hasAllImpositionPapers: true,
      hasWatermarkFreeExport: true,
      hasPriorityRealtime: true,
    },
  },
}

/**
 * Checks if a shop currently has an active Pro subscription
 */
export function isProPlanActive(shop?: {
  plan?: string | null
  plan_expires_at?: string | null
  subscription_status?: string | null
} | null): boolean {
  if (!shop) return false

  const plan = (shop.plan || 'free').toLowerCase()
  if (plan === 'free') return false

  if (plan === 'pro' || plan === 'pro_monthly' || plan === 'pro_annual' || plan === 'enterprise') {
    // If no expiration date is set, consider it lifetime/active
    if (!shop.plan_expires_at) return true
    
    // Check if current date is before expiration date
    const expirationDate = new Date(shop.plan_expires_at)
    return expirationDate.getTime() > Date.now()
  }

  return false
}
