import { useEffect, useState } from 'react'
import { mesasApi, type Mesa, type MesaEstado } from '../../api/mesas'

const ESTADOS: { value: MesaEstado; label: string }[] = [
  { value: 'libre', label: 'Libre' },
  { value: 'ocupada', label: 'Ocupada' },
  { value: 'reservada', label: 'Reservada' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
]

export function EmpleadoMesasPanel() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = () => {
    setCargando(true)
    mesasApi
      .list({ ordering: 'numero' })
      .then(setMesas)
      .catch(() => setError('No se pudieron cargar las mesas.'))
      .finally(() => setCargando(false))
  }

  useEffect(cargar, [])

  const cambiarEstado = async (mesa: Mesa, estado: MesaEstado) => {
    try {
      await mesasApi.update(mesa.id, { estado })
      cargar()
    } catch {
      setError('No se pudo actualizar el estado de la mesa.')
    }
  }

  return (
    <div>
      <h2>Mesas</h2>
      <p className="panel-hint">Actualiza el estado de cada mesa según la operación del salón.</p>
      {error && <p className="resource-error">{error}</p>}
      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table className="resource-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Zona</th>
              <th>Capacidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {mesas.map((mesa) => (
              <tr key={mesa.id}>
                <td>{mesa.numero}</td>
                <td>{mesa.zona_nombre}</td>
                <td>{mesa.capacidad}</td>
                <td>
                  <select
                    className="modal-input"
                    value={mesa.estado}
                    onChange={(e) => void cambiarEstado(mesa, e.target.value as MesaEstado)}
                  >
                    {ESTADOS.map((e) => (
                      <option key={e.value} value={e.value}>{e.label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
