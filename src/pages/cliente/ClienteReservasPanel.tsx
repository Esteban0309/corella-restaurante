import { useEffect, useState } from 'react'
import { mesasApi, reservasApi, type Mesa, type Reserva } from '../../api/mesas'
import '../../styles/modal.css'

export function ClienteReservasPanel() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)

  const [mesaId, setMesaId] = useState('')
  const [fechaHora, setFechaHora] = useState('')
  const [numeroPersonas, setNumeroPersonas] = useState(2)
  const [notas, setNotas] = useState('')
  const [enviando, setEnviando] = useState(false)

  const cargar = () => {
    setCargando(true)
    setError(null)
    Promise.all([mesasApi.list(), reservasApi.list({ ordering: '-fecha_hora' })])
      .then(([m, r]) => {
        setMesas(m)
        setReservas(r)
      })
      .catch(() => setError('No se pudieron cargar tus reservas.'))
      .finally(() => setCargando(false))
  }

  useEffect(cargar, [])

  const mesaSeleccionada = mesas.find((m) => m.id === mesaId)

  const handleSubmit = async () => {
    setError(null)
    if (!mesaId || !fechaHora) {
      setError('Selecciona mesa y fecha/hora.')
      return
    }
    if (mesaSeleccionada && numeroPersonas > mesaSeleccionada.capacidad) {
      setError(`Esa mesa tiene capacidad para ${mesaSeleccionada.capacidad} personas.`)
      return
    }
    setEnviando(true)
    try {
      // No enviamos 'cliente': el backend lo asigna automáticamente al usuario logueado.
      await reservasApi.create({
        mesa: mesaId,
        fecha_hora: fechaHora,
        numero_personas: numeroPersonas,
        notas,
      })
      setMesaId('')
      setFechaHora('')
      setNumeroPersonas(2)
      setNotas('')
      setMostrarForm(false)
      cargar()
    } catch {
      setError('No se pudo crear la reserva. Verifica los datos.')
    } finally {
      setEnviando(false)
    }
  }

  const cancelar = async (reserva: Reserva) => {
    if (!confirm('¿Cancelar esta reserva?')) return
    try {
      await reservasApi.update(reserva.id, { estado: 'cancelada' })
      cargar()
    } catch {
      setError('No se pudo cancelar la reserva.')
    }
  }

  return (
    <div>
      <h2>Mis reservas</h2>
      <p className="panel-hint">Reserva una mesa para tu próxima visita.</p>
      {error && <p className="resource-error">{error}</p>}

      <button type="button" className="btn btn-primary" onClick={() => setMostrarForm(true)}>
        + Nueva reserva
      </button>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table className="resource-table" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>Fecha y hora</th>
              <th>Mesa</th>
              <th>Personas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <tr key={r.id}>
                <td>{new Date(r.fecha_hora).toLocaleString()}</td>
                <td>Mesa {r.mesa_numero}</td>
                <td>{r.numero_personas}</td>
                <td><span className={`badge badge-estado-${r.estado}`}>{r.estado}</span></td>
                <td>
                  {r.estado !== 'cancelada' && r.estado !== 'completada' && (
                    <button type="button" className="btn-link btn-link-danger" onClick={() => void cancelar(r)}>
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {reservas.length === 0 && (
              <tr>
                <td colSpan={5}>Todavía no tienes reservas.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {mostrarForm && (
        <div className="modal-overlay" onClick={() => setMostrarForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setMostrarForm(false)} aria-label="Cerrar">
              ×
            </button>
            <h3 className="modal-title">Nueva reserva</h3>

            <label className="modal-label">Mesa</label>
            <select className="modal-input" value={mesaId} onChange={(e) => setMesaId(e.target.value)}>
              <option value="">-- Selecciona --</option>
              {mesas.map((m) => (
                <option key={m.id} value={m.id}>Mesa {m.numero} ({m.zona_nombre}, cap. {m.capacidad})</option>
              ))}
            </select>

            <label className="modal-label">Fecha y hora</label>
            <input
              className="modal-input"
              type="datetime-local"
              value={fechaHora}
              onChange={(e) => setFechaHora(e.target.value)}
            />

            <label className="modal-label">Número de personas</label>
            <input
              className="modal-input"
              type="number"
              min={1}
              value={numeroPersonas}
              onChange={(e) => setNumeroPersonas(Number(e.target.value))}
            />

            <label className="modal-label">Notas</label>
            <textarea className="modal-input" value={notas} onChange={(e) => setNotas(e.target.value)} />

            <button type="button" className="btn btn-primary modal-submit" disabled={enviando} onClick={() => void handleSubmit()}>
              {enviando ? 'Reservando...' : 'Reservar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
