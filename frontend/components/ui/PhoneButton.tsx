import { Phone } from 'lucide-react'
import { PHONE_NUMBER } from '@/utils/constants'
import { Button } from './Button'

interface PhoneButtonProps {
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  className?: string
}

export function PhoneButton({ size = 'md', fullWidth = false, className }: PhoneButtonProps) {
  return (
    <a href={`tel:${PHONE_NUMBER.replace(/\s/g, '')}`} className={fullWidth ? 'w-full block' : 'inline-block'}>
      <Button variant="outline" size={size} fullWidth={fullWidth} className={className}>
        <Phone size={16} />
        {PHONE_NUMBER}
      </Button>
    </a>
  )
}
