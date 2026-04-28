import AppRoutes from './routes/AppRoutes'
import { useNotificationRealtimeBridge } from './features/notifications/hooks/useNotificationRealtimeBridge'

function App() {
  useNotificationRealtimeBridge()
  return <AppRoutes />
}

export default App
