// App-level shell. Providers wrap the app (TanStack Router, React Query, etc.)
// Keep this file minimal and free of page logic.
import Providers from './providers'

const App = () => {
  return (
    <>
      {/* Providers mount here. See src/providers.tsx for configuration and team notes. */}
      <Providers />
    </>
  )
}

export default App
