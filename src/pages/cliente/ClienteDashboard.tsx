import { DashboardLayout } from '../../components/DashboardLayout'
import { Icon } from '../../components/Icon'
import { ClienteMenuPanel } from './ClienteMenuPanel'
import { ClienteReservasPanel } from './ClienteReservasPanel'
import { ClientePedidosPanel } from './ClientePedidosPanel'

export function ClienteDashboard() {
  return (
    <DashboardLayout
      title="Mi cuenta"
      tabs={[
        { key: 'menu', label: 'Menú', icon: <Icon name="utensils" />, content: <ClienteMenuPanel /> },
        { key: 'reservas', label: 'Mis reservas', icon: <Icon name="calendar-check" />, content: <ClienteReservasPanel /> },
        { key: 'pedidos', label: 'Mis pedidos', icon: <Icon name="receipt" />, content: <ClientePedidosPanel /> },
      ]}
    />
  )
}
