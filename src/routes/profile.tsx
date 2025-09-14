import { Card, CardHeader } from '@/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Card>
        <CardHeader>Hello</CardHeader>
      </Card>
    </>
  )
}
