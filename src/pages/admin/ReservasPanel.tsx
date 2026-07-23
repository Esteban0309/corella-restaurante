import { useEffect, useState } from 'react'
import { ResourceCrud, type FieldConfig, type ColumnConfig, type FormValues } from '../../components/ResourceCrud'
import { Icon } from '../../components/Icon'
import { mesasApi, reservasApi, type Mesa, type Reserva, type ReservaWrite } from '../../api/mesas'
import { clientesApi, type Cliente } from '../../api/personal'

const ESTADO_RESERVA_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'cancelada', label: 'Cancelada' },
  { value: 'completada', label: 'Completada' },
]

export function ReservasPanel() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])

  useEffect(() => {
    mesasApi.list().then(setMesas).catch(() => {})
    clientesApi.list().then(setClientes).catch(() => {})
  }, [])

  const mesaOptions = mesas.map((m) => ({ value: m.id, label: `Mesa ${m.numero} (${m.zona_nombre}, cap. ${m.capacidad})` }))
  const clienteOptions = clientes.map((c) => ({
    value: c.id,
    label: c.user.first_name || c.user.last_name ? `${c.user.first_name} ${c.user.last_name}`.trim() : c.user.username,
  }))

  const columns: ColumnConfig<Reserva>[] = [
    { key: 'fecha_hora', label: 'Fecha y hora', render: (r) => new Date(r.fecha_hora).toLocaleString() },
    { key: 'mesa_numero', label: 'Mesa' },
    { key: 'cliente_nombre', label: 'Cliente' },
    { key: 'numero_personas', label: 'Personas' },
    {
      key: 'estado',
      label: 'Estado',
      render: (r) => <span className={`badge badge-estado-${r.estado}`}>{ESTADO_RESERVA_OPTIONS.find((o) => o.value === r.estado)?.label}</span>,
    },
  ]

  const fields: FieldConfig[] = [
    { name: 'mesa', label: 'Mesa', type: 'select', options: mesaOptions, required: true },
    { name: 'cliente', label: 'Cliente', type: 'select', options: clienteOptions, required: true },
    { name: 'fecha_hora', label: 'Fecha y hora', type: 'datetime-local', required: true },
    { name: 'numero_personas', label: 'Número de personas', type: 'number', required: true },
    { name: 'estado', label: 'Estado', type: 'select', options: ESTADO_RESERVA_OPTIONS },
    { name: 'notas', label: 'Notas', type: 'textarea' },
  ]

  return (
    <div>
      <h2>Reservas</h2>
      <p className="panel-hint">
        El backend valida que el número de personas no supere la capacidad de la mesa elegida.
      </p>
      <ResourceCrud<Reserva, ReservaWrite>
        title="Reservas"
        api={reservasApi}
        columns={columns}
        fields={fields}
        getId={(r) => r.id}
        icon={<Icon name="calendar-check" size={32} />}
        emptyValues={{
          mesa: '', cliente: '', fecha_hora: '', numero_personas: 2, estado: 'pendiente', notas: '',
        } satisfies FormValues}
        toFormValues={(r) => ({
          mesa: r.mesa, cliente: r.cliente, fecha_hora: r.fecha_hora.slice(0, 16),
          numero_personas: r.numero_personas, estado: r.estado, notas: r.notas,
        })}
        listParams={{ ordering: '-fecha_hora' }}
      />
    </div>
  )
}
