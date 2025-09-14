import LoginGitHub from '@/pages/Auth/LoginGitHub'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login-github')({
  component: RouteComponent,
})

function RouteComponent() {
  return LoginGitHub(Route)
}
