import { ResourceCrud, type FieldConfig, type ColumnConfig, type FormValues } from '../../components/ResourceCrud'
import { Icon, BoolBadge } from '../../components/Icon'
import { bannersApi, type Banner } from '../../api/banners'
import { urlImagen } from '../../utils/media'

const tipoLabels: Record<string, string> = {
  hero: 'Portada principal',
  promo: 'Promoción',
  oferta: 'Oferta destacada',
}

const columns: ColumnConfig<Banner>[] = [
  { key: 'titulo', label: 'Título' },
  { key: 'tipo', label: 'Tipo', render: (b) => tipoLabels[b.tipo] ?? b.tipo },
  { key: 'orden', label: 'Orden' },
  { key: 'activo', label: 'Activo', render: (b) => <BoolBadge value={b.activo} /> },
]

const fields: FieldConfig[] = [
  { name: 'titulo', label: 'Título', type: 'text', required: true },
  { name: 'subtitulo', label: 'Subtítulo', type: 'text' },
  {
    name: 'tipo',
    label: 'Tipo',
    type: 'select',
    required: true,
    options: [
      { value: 'hero', label: 'Portada principal' },
      { value: 'promo', label: 'Promoción' },
      { value: 'oferta', label: 'Oferta destacada' },
    ],
  },
  { name: 'imagen', label: 'Imagen', type: 'image' },
  { name: 'texto_boton', label: 'Texto del botón', type: 'text' },
  { name: 'enlace', label: 'Enlace (ej. /menu)', type: 'text' },
  { name: 'orden', label: 'Orden', type: 'number' },
  { name: 'activo', label: 'Activo', type: 'checkbox' },
]

export function BannerPanel() {
  return (
    <div>
      <h2>Banners y promociones</h2>
      <p className="panel-hint">
        Administra las imágenes de portada y promociones que se muestran en la página pública. Los cambios se
        reflejan en vivo en el inicio del sitio.
      </p>
      <ResourceCrud<Banner>
        title="Banners"
        api={bannersApi}
        columns={columns}
        fields={fields}
        getId={(b) => b.id}
        icon={<Icon name="image" size={32} />}
        image={(b) => urlImagen(b)}
        emptyValues={{
          titulo: '', subtitulo: '', tipo: 'promo', texto_boton: '', enlace: '', orden: 0, activo: true,
        } satisfies FormValues}
        toFormValues={(b) => ({
          titulo: b.titulo,
          subtitulo: b.subtitulo,
          tipo: b.tipo,
          imagen: b.imagen ?? '',
          imagen_url: b.imagen_url ?? '',
          texto_boton: b.texto_boton,
          enlace: b.enlace,
          orden: b.orden,
          activo: b.activo,
        })}
      />
    </div>
  )
}
