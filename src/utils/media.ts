/** Prioriza el archivo subido; si no hay, usa el link pegado por el usuario. */
export function urlImagen(item: { imagen?: string | null; imagen_url?: string | null }): string | null {
  return item.imagen || item.imagen_url || null
}
