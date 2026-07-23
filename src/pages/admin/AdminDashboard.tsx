import { DashboardLayout } from '../../components/DashboardLayout'
import { Icon } from '../../components/Icon'
import { CatalogoPanel } from './CatalogoPanel'
import { BannerPanel } from './BannerPanel'
import { InventarioPanel } from './InventarioPanel'
import { MesasPanel } from './MesasPanel'
import { ReservasPanel } from './ReservasPanel'
import { PedidosPanel } from './PedidosPanel'
import { PagosPanel } from './PagosPanel'
import { PersonalPanel } from './PersonalPanel'

export function AdminDashboard() {
  return (
    <DashboardLayout
      title="Panel Admin"
      tabs={[
        { key: 'catalogo', label: 'Catálogo', icon: <Icon name="utensils" />, content: <CatalogoPanel /> },
        { key: 'banners', label: 'Banners', icon: <Icon name="image" />, content: <BannerPanel /> },
        { key: 'inventario', label: 'Inventario', icon: <Icon name="archive" />, content: <InventarioPanel /> },
        { key: 'mesas', label: 'Mesas y zonas', icon: <Icon name="grid" />, content: <MesasPanel /> },
        { key: 'reservas', label: 'Reservas', icon: <Icon name="calendar-check" />, content: <ReservasPanel /> },
        { key: 'pedidos', label: 'Pedidos', icon: <Icon name="receipt" />, content: <PedidosPanel /> },
        { key: 'pagos', label: 'Pagos y facturas', icon: <Icon name="credit-card" />, content: <PagosPanel /> },
        { key: 'personal', label: 'Personal y clientes', icon: <Icon name="users" />, content: <PersonalPanel /> },
      ]}
    />
  )
}
