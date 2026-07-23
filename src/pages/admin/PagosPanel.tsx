import { useEffect, useState } from 'react'
import { ResourceCrud, type FieldConfig, type ColumnConfig, type FormValues } from '../../components/ResourceCrud'
import { Icon } from '../../components/Icon'
import { pagosApi, facturasApi, pedidosApi, type Pago, type Factura, type Pedido } from '../../api/pedidos'

const METODO_OPTIONS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'app', label: 'Pago en app' },
]

const ESTADO_PAGO_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'completado', label: 'Completado' },
  { value: 'rechazado', label: 'Rechazado' },
  { value: 'reembolsado', label: 'Reembolsado' },
]

export function PagosPanel() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    pedidosApi.list().then(setPedidos).catch(() => {})
    pagosApi.list().then(setPagos).catch(() => {})
  }, [reloadKey])

  const pedidoOptions = pedidos.map((p) => ({ value: p.id, label: `Pedido #${p.id.slice(0, 8)} — $${p.total}` }))
  const pagoOptions = pagos.map((p) => ({ value: p.id, label: `Pago $${p.monto} (${p.estado})` }))

  const pagoColumns: ColumnConfig<Pago>[] = [
    { key: 'pedido', label: 'Pedido', render: (p) => `#${p.pedido.slice(0, 8)}` },
    { key: 'monto', label: 'Monto', render: (p) => `$${p.monto}` },
    { key: 'metodo', label: 'Método' },
    { key: 'estado', label: 'Estado', render: (p) => <span className={`badge badge-estado-${p.estado === 'completado' ? 'entregado' : p.estado}`}>{p.estado}</span> },
  ]

  const pagoFields: FieldConfig[] = [
    { name: 'pedido', label: 'Pedido', type: 'select', options: pedidoOptions, required: true },
    { name: 'monto', label: 'Monto', type: 'number', step: '0.01', required: true },
    { name: 'metodo', label: 'Método', type: 'select', options: METODO_OPTIONS },
    { name: 'estado', label: 'Estado', type: 'select', options: ESTADO_PAGO_OPTIONS },
    { name: 'fecha_pago', label: 'Fecha de pago', type: 'datetime-local' },
  ]

  const facturaColumns: ColumnConfig<Factura>[] = [
    { key: 'numero_factura', label: 'N° Factura' },
    { key: 'pago', label: 'Pago', render: (f) => pagos.find((p) => p.id === f.pago)?.monto ? `$${pagos.find((p) => p.id === f.pago)?.monto}` : f.pago },
    { key: 'subtotal', label: 'Subtotal', render: (f) => `$${f.subtotal}` },
    { key: 'impuesto', label: 'Impuesto', render: (f) => `$${f.impuesto}` },
    { key: 'total', label: 'Total', render: (f) => `$${f.total}` },
  ]

  const facturaFields: FieldConfig[] = [
    { name: 'pago', label: 'Pago', type: 'select', options: pagoOptions, required: true },
    { name: 'numero_factura', label: 'Número de factura', type: 'text', required: true },
    { name: 'subtotal', label: 'Subtotal', type: 'number', step: '0.01', required: true },
    { name: 'impuesto', label: 'Impuesto', type: 'number', step: '0.01' },
    { name: 'total', label: 'Total', type: 'number', step: '0.01', required: true },
  ]

  return (
    <div>
      <h2>Pagos y facturación</h2>
      <p className="panel-hint">Registra pagos por pedido y emite la factura correspondiente.</p>

      <ResourceCrud<Pago>
        title="Pagos"
        api={pagosApi}
        columns={pagoColumns}
        fields={pagoFields}
        getId={(p) => p.id}
        icon={<Icon name="credit-card" size={32} />}
        emptyValues={{ pedido: '', monto: '0', metodo: 'efectivo', estado: 'pendiente', fecha_pago: '' } satisfies FormValues}
        toFormValues={(p) => ({ pedido: p.pedido, monto: p.monto, metodo: p.metodo, estado: p.estado, fecha_pago: p.fecha_pago ?? '' })}
        onSaved={() => setReloadKey((k) => k + 1)}
      />

      <hr className="panel-divider" />

      <ResourceCrud<Factura>
        title="Facturas"
        api={facturasApi}
        columns={facturaColumns}
        fields={facturaFields}
        getId={(f) => f.id}
        icon={<Icon name="file-text" size={32} />}
        emptyValues={{ pago: '', numero_factura: '', subtotal: '0', impuesto: '0', total: '0' } satisfies FormValues}
        toFormValues={(f) => ({ pago: f.pago, numero_factura: f.numero_factura, subtotal: f.subtotal, impuesto: f.impuesto, total: f.total })}
        reloadToken={reloadKey}
      />
    </div>
  )
}
