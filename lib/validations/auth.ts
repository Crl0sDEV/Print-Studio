import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  cfTurnstileResponse: z.string().optional(),
})

export const SignupSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
    shopName: z.string().trim().min(2, 'Shop name must be at least 2 characters'),
    email: z.string().trim().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password confirmation is required'),
    cfTurnstileResponse: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const OnboardingSchema = z.object({
  shopName: z.string().trim().min(2, 'Shop name is required'),
  shopSlug: z
    .string()
    .trim()
    .min(2, 'Shop slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  address: z.string().trim().optional(),
  contactNumber: z.string().trim().optional(),
})

export const AdminLoginSchema = z.object({
  email: z.string().trim().email('Please enter a valid admin email'),
  password: z.string().min(6, 'Admin password is required'),
})

export type LoginInput = z.infer<typeof LoginSchema>
export type SignupInput = z.infer<typeof SignupSchema>
export type OnboardingInput = z.infer<typeof OnboardingSchema>
export type AdminLoginInput = z.infer<typeof AdminLoginSchema>
