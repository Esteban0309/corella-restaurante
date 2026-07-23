import { ResourceCrud, type FieldConfig, type ColumnConfig, type FormValues } from '../../components/ResourceCrud'
import { Icon, BoolBadge } from '../../components/Icon'
import { empleadosApi, clientesApi, type Empleado, type Cliente } from '../../api/personal'

const ROL_OPTIONS = [
  { value: 'mesero', label: 'Mesero' },
  { value: 'cocinero', label: 'Cocinero' },
  { value: 'cajero', label: 'Cajero' },
  { value: 'admin', label: 'Administrador' },
]

const empleadoColumns: ColumnConfig<Empleado>[] = [
  { key: 'user', label: 'Usuario', render: (e) => e.user.username },
  { key: 'nombre', label: 'Nombre', render: (e) => `${e.user.first_name} ${e.user.last_name}`.trim() || '—' },
  { key: 'rol', label: 'Rol' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'activo', label: 'Activo', render: (e) => <BoolBadge value={e.activo} /> },
]

const empleadoFields: FieldConfig[] = [
  { name: 'rol', label: 'Rol', type: 'select', options: ROL_OPTIONS, required: true },
  { name: 'telefono', label: 'Teléfono', type: 'text' },
  { name: 'activo', label: 'Activo', type: 'checkbox' },
]

const clienteColumns: ColumnConfig<Cliente>[] = [
  { key: 'user', label: 'Usuario', render: (c) => c.user.username },
  { key: 'nombre', label: 'Nombre', render: (c) => `${c.user.first_name} ${c.user.last_name}`.trim() || '—' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'puntos_fidelidad', label: 'Puntos fidelidad' },
]

const clienteFields: FieldConfig[] = [
  { name: 'telefono', label: 'Teléfono', type: 'text' },
  { name: 'direccion', label: 'Dirección', type: 'textarea' },
  { name: 'fecha_nacimiento', label: 'Fecha de nacimiento', type: 'text' },
]

export function PersonalPanel() {
  return (
    <div>
      <h2>Personal y clientes</h2>
      <p className="panel-hint">
        Los usuarios se crean al registrarse (Cliente) o desde Django admin (Empleado); aquí solo se edita su rol y datos de contacto.
      </p>

      <ResourceCrud<Empleado>
        title="Empleados"
        api={empleadosApi}
        columns={empleadoColumns}
        fields={empleadoFields}
        getId={(e) => e.id}
        icon={<Icon name="chef-hat" size={32} />}
        emptyValues={{} satisfies FormValues}
        toFormValues={(e) => ({ rol: e.rol, telefono: e.telefono, activo: e.activo })}
        allowCreate={false}
        allowDelete={false}
      />

      <hr className="panel-divider" />

      <ResourceCrud<Cliente>
        title="Clientes"
        api={clientesApi}
        columns={clienteColumns}
        fields={clienteFields}
        getId={(c) => c.id}
        icon={<Icon name="user" size={32} />}
        emptyValues={{} satisfies FormValues}
        toFormValues={(c) => ({ telefono: c.telefono, direccion: c.direccion, fecha_nacimiento: c.fecha_nacimiento ?? '' })}
        allowCreate={false}
        allowDelete={false}
      />
    </div>
  )
}
