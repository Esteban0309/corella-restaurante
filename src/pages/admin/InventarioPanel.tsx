import { useEffect, useState } from 'react'
import { ResourceCrud, type FieldConfig, type ColumnConfig, type FormValues } from '../../components/ResourceCrud'
import { Icon, BoolBadge } from '../../components/Icon'
import {
  proveedoresApi,
  ingredientesApi,
  recetasApi,
  productosApi,
  type Proveedor,
  type Ingrediente,
  type RecetaIngrediente,
  type Producto,
} from '../../api/catalogo'

export function InventarioPanel() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    proveedoresApi.list().then(setProveedores).catch(() => {})
    ingredientesApi.list().then(setIngredientes).catch(() => {})
    productosApi.list().then(setProductos).catch(() => {})
  }, [reloadKey])

  const refrescar = () => setReloadKey((k) => k + 1)

  const proveedorColumns: ColumnConfig<Proveedor>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'contacto', label: 'Contacto' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'activo', label: 'Activo', render: (p) => <BoolBadge value={p.activo} /> },
  ]

  const proveedorFields: FieldConfig[] = [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'contacto', label: 'Contacto', type: 'text' },
    { name: 'telefono', label: 'Teléfono', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'direccion', label: 'Dirección', type: 'textarea' },
    { name: 'activo', label: 'Activo', type: 'checkbox' },
  ]

  const proveedorOptions = proveedores.map((p) => ({ value: p.id, label: p.nombre }))
  const productoOptions = productos.map((p) => ({ value: p.id, label: p.nombre }))

  const ingredienteColumns: ColumnConfig<Ingrediente>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'unidad_medida', label: 'Unidad' },
    { key: 'stock_actual', label: 'Stock actual' },
    { key: 'stock_minimo', label: 'Stock mínimo' },
    {
      key: 'stock_bajo',
      label: 'Estado',
      render: (i) => (i.stock_bajo ? <span className="badge badge-danger">Stock bajo</span> : <span className="badge badge-ok">OK</span>),
    },
    { key: 'proveedor_nombre', label: 'Proveedor' },
  ]

  const ingredienteFields: FieldConfig[] = [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'unidad_medida', label: 'Unidad de medida (kg, l, unidad)', type: 'text', required: true },
    { name: 'stock_actual', label: 'Stock actual', type: 'number', step: '0.01' },
    { name: 'stock_minimo', label: 'Stock mínimo', type: 'number', step: '0.01' },
    { name: 'proveedor', label: 'Proveedor', type: 'select', options: proveedorOptions },
  ]

  const recetaColumns: ColumnConfig<RecetaIngrediente>[] = [
    { key: 'producto', label: 'Producto', render: (r) => productos.find((p) => p.id === r.producto)?.nombre ?? r.producto },
    { key: 'ingrediente_nombre', label: 'Ingrediente' },
    { key: 'cantidad_necesaria', label: 'Cantidad necesaria' },
  ]

  const recetaFields: FieldConfig[] = [
    { name: 'producto', label: 'Producto', type: 'select', options: productoOptions, required: true },
    { name: 'ingrediente', label: 'Ingrediente', type: 'select', options: ingredientes.map((i) => ({ value: i.id, label: i.nombre })), required: true },
    { name: 'cantidad_necesaria', label: 'Cantidad necesaria', type: 'number', step: '0.01', required: true },
  ]

  return (
    <div>
      <h2>Inventario</h2>
      <p className="panel-hint">Proveedores, ingredientes y las recetas que consumen stock por producto.</p>

      <ResourceCrud<Proveedor>
        title="Proveedores"
        api={proveedoresApi}
        columns={proveedorColumns}
        fields={proveedorFields}
        getId={(p) => p.id}
        icon={<Icon name="truck" size={32} />}
        emptyValues={{ nombre: '', contacto: '', telefono: '', email: '', direccion: '', activo: true } satisfies FormValues}
        toFormValues={(p) => ({ ...p })}
        onSaved={refrescar}
      />

      <hr className="panel-divider" />

      <ResourceCrud<Ingrediente>
        title="Ingredientes"
        api={ingredientesApi}
        columns={ingredienteColumns}
        fields={ingredienteFields}
        getId={(i) => i.id}
        icon={<Icon name="package" size={32} />}
        emptyValues={{ nombre: '', unidad_medida: '', stock_actual: 0, stock_minimo: 0, proveedor: '' } satisfies FormValues}
        toFormValues={(i) => ({
          nombre: i.nombre, unidad_medida: i.unidad_medida, stock_actual: i.stock_actual,
          stock_minimo: i.stock_minimo, proveedor: i.proveedor ?? '',
        })}
        reloadToken={reloadKey}
        onSaved={refrescar}
      />

      <hr className="panel-divider" />

      <ResourceCrud<RecetaIngrediente>
        title="Recetas (ingredientes por producto)"
        api={recetasApi}
        columns={recetaColumns}
        fields={recetaFields}
        getId={(r) => r.id}
        icon={<Icon name="clipboard-list" size={32} />}
        emptyValues={{ producto: '', ingrediente: '', cantidad_necesaria: '0' } satisfies FormValues}
        toFormValues={(r) => ({ producto: r.producto, ingrediente: r.ingrediente, cantidad_necesaria: r.cantidad_necesaria })}
        reloadToken={reloadKey}
      />
    </div>
  )
}
