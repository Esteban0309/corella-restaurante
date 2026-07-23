import { useEffect, useState } from 'react'
import { PedidosBoard } from '../../components/PedidosBoard'
import { productosApi, type Producto } from '../../api/catalogo'
import { mesasApi, type Mesa } from '../../api/mesas'

export function ClientePedidosPanel() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [mesas, setMesas] = useState<Mesa[]>([])

  useEffect(() => {
    productosApi.list().then(setProductos).catch(() => {})
    mesasApi.list().then(setMesas).catch(() => {})
  }, [])

  return (
    <div>
      <h2>Hacer un pedido</h2>
      <p className="panel-hint">Arma tu pedido y síguelo en tiempo real. El pedido queda asociado a tu cuenta.</p>
      <PedidosBoard productos={productos} mesas={mesas} modoStaff={false} />
    </div>
  )
}
