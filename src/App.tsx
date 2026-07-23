import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { EmpleadoDashboard } from './pages/empleado/EmpleadoDashboard'
import { ClienteDashboard } from './pages/cliente/ClienteDashboard'
import { ProtectedRoute } from './router/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/empleado"
        element={
          <ProtectedRoute roles={['empleado', 'admin']}>
            <EmpleadoDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cliente"
        element={
          <ProtectedRoute roles={['cliente']}>
            <ClienteDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<HomePage />} />
    </Routes>
  )
}

export default App
