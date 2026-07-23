import { DashboardLayout } from '../../components/DashboardLayout'
import { Icon } from '../../components/Icon'
import { EmpleadoPedidosPanel } from './EmpleadoPedidosPanel'
import { EmpleadoMesasPanel } from './EmpleadoMesasPanel'
import { ReservasPanel } from '../admin/ReservasPanel'

export function EmpleadoDashboard() {
  return (
    <DashboardLayout
      title="Panel Empleado"
      tabs={[
        { key: 'pedidos', label: 'Pedidos', icon: <Icon name="receipt" />, content: <EmpleadoPedidosPanel /> },
        { key: 'mesas', label: 'Mesas', icon: <Icon name="grid" />, content: <EmpleadoMesasPanel /> },
        { key: 'reservas', label: 'Reservas', icon: <Icon name="calendar-check" />, content: <ReservasPanel /> },
      ]}
    />
  )
}
