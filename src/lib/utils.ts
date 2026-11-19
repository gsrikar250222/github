import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
