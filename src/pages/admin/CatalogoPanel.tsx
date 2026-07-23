import { useEffect, useState } from 'react'
import { ResourceCrud, type FieldConfig, type ColumnConfig, type FormValues } from '../../components/ResourceCrud'
import { Icon, BoolBadge } from '../../components/Icon'
import {
  categoriasApi,
  productosApi,
  variantesApi,
  type Categoria,
  type Producto,
  type ProductoVariante,
} from '../../api/catalogo'
import { urlImagen } from '../../utils/media'

const categoriaColumns: ColumnConfig<Categoria>[] = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'orden', label: 'Orden' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'activa', label: 'Activa', render: (c) => <BoolBadge value={c.activa} /> },
]

const categoriaFields: FieldConfig[] = [
  { name: 'nombre', label: 'Nombre', type: 'text', required: true },
  { name: 'descripcion', label: 'Descripción', type: 'textarea' },
  { name: 'orden', label: 'Orden', type: 'number' },
  { name: 'activa', label: 'Activa', type: 'checkbox' },
]

export function CatalogoPanel() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    categoriasApi.list({ ordering: 'orden' }).then(setCategorias).catch(() => {})
    productosApi.list().then(setProductos).catch(() => {})
  }, [reloadKey])

  const refrescar = () => setReloadKey((k) => k + 1)

  const categoriaOptions = categorias.map((c) => ({ value: c.id, label: c.nombre }))
  const productoOptions = productos.map((p) => ({ value: p.id, label: p.nombre }))

  const productoColumns: ColumnConfig<Producto>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria_nombre', label: 'Categoría' },
    { key: 'precio_base', label: 'Precio', render: (p) => `$${p.precio_base}` },
    { key: 'disponible', label: 'Disponible', render: (p) => <BoolBadge value={p.disponible} /> },
  ]

  const productoFields: FieldConfig[] = [
    { name: 'categoria', label: 'Categoría', type: 'select', options: categoriaOptions, required: true },
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'descripcion', label: 'Descripción', type: 'textarea' },
    { name: 'precio_base', label: 'Precio base', type: 'number', step: '0.01', required: true },
    { name: 'tiempo_preparacion', label: 'Tiempo de preparación (min)', type: 'number' },
    { name: 'imagen', label: 'Imagen', type: 'image' },
    { name: 'disponible', label: 'Disponible', type: 'checkbox' },
  ]

  const varianteColumns: ColumnConfig<ProductoVariante>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'producto', label: 'Producto', render: (v) => productos.find((p) => p.id === v.producto)?.nombre ?? v.producto },
    { key: 'tipo', label: 'Tipo' },
    { key: 'precio_extra', label: 'Precio extra', render: (v) => `$${v.precio_extra}` },
    { key: 'disponible', label: 'Disponible', render: (v) => <BoolBadge value={v.disponible} /> },
  ]

  const varianteFields: FieldConfig[] = [
    { name: 'producto', label: 'Producto', type: 'select', options: productoOptions, required: true },
    { name: 'nombre', label: 'Nombre (ej. Grande, Sin gluten)', type: 'text', required: true },
    { name: 'tipo', label: 'Tipo (ej. tamaño, extra)', type: 'text' },
    { name: 'precio_extra', label: 'Precio extra', type: 'number', step: '0.01' },
    { name: 'disponible', label: 'Disponible', type: 'checkbox' },
  ]

  return (
    <div>
      <h2>Catálogo</h2>
      <p className="panel-hint">Categorías y productos del menú. Los cambios se reflejan en vivo en la página pública.</p>

      <ResourceCrud<Categoria>
        title="Categorías"
        api={categoriasApi}
        columns={categoriaColumns}
        fields={categoriaFields}
        getId={(c) => c.id}
        icon={<Icon name="folder" size={32} />}
        emptyValues={{ nombre: '', descripcion: '', orden: 0, activa: true } satisfies FormValues}
        toFormValues={(c) => ({ nombre: c.nombre, descripcion: c.descripcion, orden: c.orden, activa: c.activa })}
        onSaved={refrescar}
      />

      <hr className="panel-divider" />

      <ResourceCrud<Producto>
        title="Productos"
        api={productosApi}
        columns={productoColumns}
        fields={productoFields}
        getId={(p) => p.id}
        icon={<Icon name="utensils" size={32} />}
        image={(p) => urlImagen(p)}
        emptyValues={{
          categoria: '', nombre: '', descripcion: '', precio_base: '0', tiempo_preparacion: 15, disponible: true,
        } satisfies FormValues}
        toFormValues={(p) => ({
          categoria: p.categoria, nombre: p.nombre, descripcion: p.descripcion,
          precio_base: p.precio_base, tiempo_preparacion: p.tiempo_preparacion,
          imagen: p.imagen ?? '', imagen_url: p.imagen_url ?? '', disponible: p.disponible,
        })}
        reloadToken={reloadKey}
        onSaved={refrescar}
      />

      <hr className="panel-divider" />

      <ResourceCrud<ProductoVariante>
        title="Variantes de producto"
        api={variantesApi}
        columns={varianteColumns}
        fields={varianteFields}
        getId={(v) => v.id}
        icon={<Icon name="plus-circle" size={32} />}
        emptyValues={{ producto: '', nombre: '', tipo: '', precio_extra: '0', disponible: true } satisfies FormValues}
        toFormValues={(v) => ({
          producto: v.producto, nombre: v.nombre, tipo: v.tipo, precio_extra: v.precio_extra, disponible: v.disponible,
        })}
        reloadToken={reloadKey}
      />
    </div>
  )
}
