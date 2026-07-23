import { useEffect, useState, type ReactNode } from 'react'
import type { ResourceApi } from '../api/resource'
import { Icon } from './Icon'
import '../styles/modal.css'
import './ResourceCrud.css'

export type FieldType = 'text' | 'number' | 'textarea' | 'checkbox' | 'select' | 'datetime-local' | 'file' | 'image'

export interface FieldOption {
  value: string
  label: string
}

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  options?: FieldOption[]
  required?: boolean
  step?: string
}

export interface ColumnConfig<T> {
  key: string
  label: string
  render?: (item: T) => ReactNode
}

export type FormValues = Record<string, string | number | boolean | null | undefined | File>

interface ResourceCrudProps<T, TWrite> {
  title: string
  api: ResourceApi<T, TWrite>
  columns: ColumnConfig<T>[]
  fields: FieldConfig[]
  getId: (item: T) => string
  emptyValues: FormValues
  toFormValues: (item: T) => FormValues
  allowCreate?: boolean
  allowEdit?: boolean
  allowDelete?: boolean
  listParams?: Record<string, unknown>
  reloadToken?: unknown
  onSaved?: () => void
  /** Ícono mostrado en la tarjeta cuando el recurso no tiene imagen. */
  icon?: ReactNode
  /** Si se define, cada tarjeta muestra esta imagen arriba en vez del ícono. */
  image?: (item: T) => string | null
}

// El formulario interno trabaja con FormValues (dinámico, define los campos
// en tiempo de ejecución vía `fields`), y se castea al TWrite real de cada
// recurso al llamar a la API. Esto es intencional: un formulario genérico
// no puede conocer estáticamente la forma exacta de cada recurso.
export function ResourceCrud<T, TWrite = Partial<T>>({
  title,
  api,
  columns,
  fields,
  getId,
  emptyValues,
  toFormValues,
  allowCreate = true,
  allowEdit = true,
  allowDelete = true,
  listParams,
  reloadToken,
  onSaved,
  icon,
  image,
}: ResourceCrudProps<T, TWrite>) {
  const [items, setItems] = useState<T[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editando, setEditando] = useState<T | 'nuevo' | null>(null)
  const [form, setForm] = useState<FormValues>(emptyValues)
  const [guardando, setGuardando] = useState(false)

  const cargar = () => {
    setCargando(true)
    setError(null)
    api
      .list(listParams)
      .then(setItems)
      .catch(() => setError(`No se pudo cargar ${title}.`))
      .finally(() => setCargando(false))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(cargar, [reloadToken])

  const abrirNuevo = () => {
    setForm(emptyValues)
    setEditando('nuevo')
  }

  const abrirEditar = (item: T) => {
    setForm(toFormValues(item))
    setEditando(item)
  }

  const cerrar = () => setEditando(null)

  const handleChange = (name: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (name: string, file: File | null) => {
    setForm((prev) => ({ ...prev, [name]: file ?? undefined }))
  }

  // Los campos de tipo 'file'/'image' solo se envían si el usuario eligió un
  // archivo nuevo; si quedaron con el valor original (string con la URL, o
  // vacío) se omiten para no pisar la imagen ya guardada en el backend.
  const buildPayload = (): FormValues => {
    const payload: FormValues = { ...form }
    for (const field of fields) {
      if ((field.type === 'file' || field.type === 'image') && !(payload[field.name] instanceof File)) {
        delete payload[field.name]
      }
    }
    return payload
  }

  const handleSubmit = async () => {
    setGuardando(true)
    setError(null)
    try {
      const payload = buildPayload()
      if (editando === 'nuevo') {
        await api.create(payload as unknown as TWrite)
      } else if (editando) {
        await api.update(getId(editando), payload as unknown as Partial<TWrite>)
      }
      cerrar()
      cargar()
      onSaved?.()
    } catch {
      setError('No se pudo guardar. Verifica los datos.')
    } finally {
      setGuardando(false)
    }
  }

  const handleDelete = async (item: T) => {
    if (!confirm('¿Eliminar este registro?')) return
    try {
      await api.remove(getId(item))
      cargar()
      onSaved?.()
    } catch {
      setError('No se pudo eliminar (puede tener registros relacionados).')
    }
  }

  return (
    <div className="resource-crud">
      <div className="resource-header">
        <h3>{title}</h3>
        {allowCreate && (
          <button type="button" className="btn btn-primary" onClick={abrirNuevo}>
            + Nuevo
          </button>
        )}
      </div>

      {error && <p className="resource-error">{error}</p>}
      {cargando ? (
        <p>Cargando...</p>
      ) : items.length === 0 ? (
        <p className="resource-empty">Sin registros todavía.</p>
      ) : (
        <div className="resource-grid">
          {items.map((item) => {
            const imagenItem = image?.(item) ?? null
            return (
              <div className="resource-card" key={getId(item)}>
                <div className="resource-card-media">
                  {imagenItem ? (
                    <img src={imagenItem} alt="" />
                  ) : (
                    <span className="resource-card-icon">{icon ?? <Icon name="folder" size={32} />}</span>
                  )}
                </div>
                <div className="resource-card-body">
                  {columns.map((col) => (
                    <div className="resource-card-row" key={col.key}>
                      <span className="resource-card-label">{col.label}</span>
                      <span className="resource-card-value">
                        {col.render
                          ? col.render(item)
                          : String((item as Record<string, unknown>)[col.key] ?? '') || '—'}
                      </span>
                    </div>
                  ))}
                </div>
                {(allowEdit || allowDelete) && (
                  <div className="resource-card-actions">
                    {allowEdit && (
                      <button
                        type="button"
                        className="btn-icon"
                        title="Editar"
                        aria-label="Editar"
                        onClick={() => abrirEditar(item)}
                      >
                        <Icon name="pencil" size={16} />
                      </button>
                    )}
                    {allowDelete && (
                      <button
                        type="button"
                        className="btn-icon btn-icon-danger"
                        title="Eliminar"
                        aria-label="Eliminar"
                        onClick={() => void handleDelete(item)}
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {editando && (
        <div className="modal-overlay" onClick={cerrar}>
          <div className="modal-content modal-wide" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" type="button" onClick={cerrar} aria-label="Cerrar">
              ×
            </button>
            <h3 className="modal-title">{editando === 'nuevo' ? `Nuevo ${title}` : `Editar ${title}`}</h3>
            <div className="modal-form">
              {fields.map((field) => (
                <div key={field.name} className="form-field">
                  <label className="modal-label" htmlFor={field.name}>
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      id={field.name}
                      className="modal-input"
                      value={(form[field.name] as string) ?? ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    >
                      <option value="">-- Selecciona --</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      className="modal-input"
                      value={(form[field.name] as string) ?? ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    />
                  ) : field.type === 'checkbox' ? (
                    <input
                      id={field.name}
                      type="checkbox"
                      checked={Boolean(form[field.name])}
                      onChange={(e) => handleChange(field.name, e.target.checked)}
                    />
                  ) : field.type === 'file' ? (
                    <div className="form-file-field">
                      {typeof form[field.name] === 'string' && form[field.name] && (
                        <img className="form-file-preview" src={form[field.name] as string} alt="Imagen actual" />
                      )}
                      <input
                        id={field.name}
                        className="modal-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(field.name, e.target.files?.[0] ?? null)}
                      />
                      {editando !== 'nuevo' && (
                        <small className="form-file-hint">Deja este campo vacío para mantener la imagen actual.</small>
                      )}
                    </div>
                  ) : field.type === 'image' ? (
                    (() => {
                      const urlFieldName = `${field.name}_url`
                      const archivoActual = form[field.name]
                      const link = (form[urlFieldName] as string) ?? ''
                      const preview =
                        typeof archivoActual === 'string' && archivoActual ? archivoActual : link || null
                      return (
                        <div className="form-image-field">
                          {preview && <img className="form-file-preview" src={preview} alt="Vista previa" />}
                          <input
                            id={field.name}
                            className="modal-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(field.name, e.target.files?.[0] ?? null)}
                          />
                          <span className="form-image-or">o pega un link de imagen</span>
                          <input
                            id={urlFieldName}
                            className="modal-input"
                            type="text"
                            placeholder="https://..."
                            value={link}
                            onChange={(e) => handleChange(urlFieldName, e.target.value)}
                          />
                          <small className="form-file-hint">
                            Si subes un archivo, se usa ese en vez del link.
                            {editando !== 'nuevo' && ' Deja ambos vacíos para mantener la imagen actual.'}
                          </small>
                        </div>
                      )
                    })()
                  ) : (
                    <input
                      id={field.name}
                      className="modal-input"
                      type={field.type}
                      step={field.step}
                      value={(form[field.name] as string) ?? ''}
                      required={field.required}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    />
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-primary modal-submit" disabled={guardando} onClick={() => void handleSubmit()}>
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
