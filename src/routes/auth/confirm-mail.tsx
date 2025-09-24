import { createFileRoute } from '@tanstack/react-router'
import { ConfirmMail } from '@/pages/ConfirmMail'

export const Route = createFileRoute('/auth/confirm-mail')({
  component: ConfirmMail,
})
