import { useEffect, useState } from 'react'
import { PedidosBoard } from '../../components/PedidosBoard'
import { productosApi, type Producto } from '../../api/catalogo'
import { mesasApi, type Mesa } from '../../api/mesas'
import { clientesApi, type Cliente } from '../../api/personal'

export function EmpleadoPedidosPanel() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])

  useEffect(() => {
    productosApi.list().then(setProductos).catch(() => {})
    mesasApi.list().then(setMesas).catch(() => {})
    clientesApi.list().then(setClientes).catch(() => {})
  }, [])

  return (
    <div>
      <h2>Pedidos activos</h2>
      <p className="panel-hint">Toma pedidos y actualiza su estado a medida que avanza la cocina.</p>
      <PedidosBoard productos={productos} mesas={mesas} clientes={clientes} modoStaff />
    </div>
  )
}
