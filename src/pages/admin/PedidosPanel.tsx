import { useEffect, useState } from 'react'
import { PedidosBoard } from '../../components/PedidosBoard'
import { productosApi, type Producto } from '../../api/catalogo'
import { mesasApi, type Mesa } from '../../api/mesas'
import { clientesApi, type Cliente } from '../../api/personal'

export function PedidosPanel() {
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
      <h2>Pedidos</h2>
      <p className="panel-hint">Gestión completa de pedidos: crear, cambiar de estado y eliminar.</p>
      <PedidosBoard productos={productos} mesas={mesas} clientes={clientes} modoStaff />
    </div>
  )
}
