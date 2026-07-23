import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Producto, ProductoVariante } from '../api/catalogo'

export interface CartItem {
  id: string
  producto: Producto
  variante: ProductoVariante | null
  cantidad: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (producto: Producto, variante: ProductoVariante | null, cantidad: number) => void
  setCantidad: (id: string, cantidad: number) => void
  removeItem: (id: string) => void
  clear: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((producto: Producto, variante: ProductoVariante | null, cantidad: number) => {
    setItems((prev) => {
      const existente = prev.find((it) => it.producto.id === producto.id && it.variante?.id === variante?.id)
      if (existente) {
        return prev.map((it) => (it.id === existente.id ? { ...it, cantidad: it.cantidad + cantidad } : it))
      }
      return [...prev, { id: crypto.randomUUID(), producto, variante, cantidad }]
    })
  }, [])

  const setCantidad = useCallback((id: string, cantidad: number) => {
    setItems((prev) =>
      cantidad <= 0
        ? prev.filter((it) => it.id !== id)
        : prev.map((it) => (it.id === id ? { ...it, cantidad } : it)),
    )
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const total = useMemo(
    () =>
      items.reduce((acc, it) => {
        const precio = Number(it.producto.precio_base) + Number(it.variante?.precio_extra ?? 0)
        return acc + precio * it.cantidad
      }, 0),
    [items],
  )

  const count = useMemo(() => items.reduce((acc, it) => acc + it.cantidad, 0), [items])

  return (
    <CartContext.Provider value={{ items, addItem, setCantidad, removeItem, clear, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }
  return ctx
}
