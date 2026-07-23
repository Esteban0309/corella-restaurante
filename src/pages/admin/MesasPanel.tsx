import { useEffect, useState } from 'react'
import { ResourceCrud, type FieldConfig, type ColumnConfig, type FormValues } from '../../components/ResourceCrud'
import { Icon } from '../../components/Icon'
import { zonasApi, mesasApi, type Zona, type Mesa } from '../../api/mesas'

const ESTADO_MESA_OPTIONS = [
  { value: 'libre', label: 'Libre' },
  { value: 'ocupada', label: 'Ocupada' },
  { value: 'reservada', label: 'Reservada' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
]

const zonaColumns: ColumnConfig<Zona>[] = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'descripcion', label: 'Descripción' },
]

const zonaFields: FieldConfig[] = [
  { name: 'nombre', label: 'Nombre', type: 'text', required: true },
  { name: 'descripcion', label: 'Descripción', type: 'textarea' },
]

export function MesasPanel() {
  const [zonas, setZonas] = useState<Zona[]>([])
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    zonasApi.list().then(setZonas).catch(() => {})
  }, [reloadKey])

  const zonaOptions = zonas.map((z) => ({ value: z.id, label: z.nombre }))

  const mesaColumns: ColumnConfig<Mesa>[] = [
    { key: 'numero', label: 'Número' },
    { key: 'zona_nombre', label: 'Zona' },
    { key: 'capacidad', label: 'Capacidad' },
    {
      key: 'estado',
      label: 'Estado',
      render: (m) => <span className={`badge badge-estado-${m.estado}`}>{ESTADO_MESA_OPTIONS.find((o) => o.value === m.estado)?.label}</span>,
    },
  ]

  const mesaFields: FieldConfig[] = [
    { name: 'zona', label: 'Zona', type: 'select', options: zonaOptions, required: true },
    { name: 'numero', label: 'Número', type: 'number', required: true },
    { name: 'capacidad', label: 'Capacidad', type: 'number', required: true },
    { name: 'estado', label: 'Estado', type: 'select', options: ESTADO_MESA_OPTIONS },
  ]

  return (
    <div>
      <h2>Mesas y zonas</h2>
      <p className="panel-hint">Define las áreas del restaurante y las mesas físicas de cada una.</p>

      <ResourceCrud<Zona>
        title="Zonas"
        api={zonasApi}
        columns={zonaColumns}
        fields={zonaFields}
        getId={(z) => z.id}
        icon={<Icon name="map-pin" size={32} />}
        emptyValues={{ nombre: '', descripcion: '' } satisfies FormValues}
        toFormValues={(z) => ({ ...z })}
        onSaved={() => setReloadKey((k) => k + 1)}
      />

      <hr className="panel-divider" />

      <ResourceCrud<Mesa>
        title="Mesas"
        api={mesasApi}
        columns={mesaColumns}
        fields={mesaFields}
        getId={(m) => m.id}
        icon={<Icon name="table" size={32} />}
        emptyValues={{ zona: '', numero: 1, capacidad: 4, estado: 'libre' } satisfies FormValues}
        toFormValues={(m) => ({ zona: m.zona, numero: m.numero, capacidad: m.capacidad, estado: m.estado })}
        reloadToken={reloadKey}
      />
    </div>
  )
}
