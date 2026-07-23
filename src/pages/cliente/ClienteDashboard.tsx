import { useState } from 'react'
import { DashboardLayout } from '../../components/DashboardLayout'
import { Icon } from '../../components/Icon'
import { CartProvider } from '../../context/CartContext'
import { ClienteMenuPanel } from './ClienteMenuPanel'
import { ClienteReservasPanel } from './ClienteReservasPanel'
import { ClientePedidosPanel } from './ClientePedidosPanel'

export function ClienteDashboard() {
  const [activeTab, setActiveTab] = useState('menu')

  return (
    <CartProvider>
      <DashboardLayout
        title="Mi cuenta"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          {
            key: 'menu',
            label: 'Menú',
            icon: <Icon name="utensils" />,
            content: <ClienteMenuPanel onIrAPedidos={() => setActiveTab('pedidos')} />,
          },
          { key: 'reservas', label: 'Mis reservas', icon: <Icon name="calendar-check" />, content: <ClienteReservasPanel /> },
          { key: 'pedidos', label: 'Mis pedidos', icon: <Icon name="receipt" />, content: <ClientePedidosPanel /> },
        ]}
      />
    </CartProvider>
  )
}
