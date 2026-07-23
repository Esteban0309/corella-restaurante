<div align="center">

# 🔥 La Estación del Sabor

**Sitio web y panel de administración para un restaurante — construido con React, TypeScript y Vite.**

[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)

</div>

---

## 🌐 Demo en vivo

**https://food-ec.uaeftt-ute.site**

Front y backend desplegados juntos (mismo dominio, HTTPS real con Let's Encrypt) en una VM Ubuntu en AWS. Usuarios de prueba: `admin` / `dinosaurio12` (Admin), `mesero1` / `Mesero123!` (Empleado), `cliente1` / `Cliente123!` (Cliente).

## ✨ Qué es esto

El frontend de **La Estación del Sabor**: un sitio público de restaurante (menú, banners promocionales, reservas) más un panel de administración completo con control de acceso por rol. Consume la [API REST en Django](../restaurant-corella) del mismo proyecto.

- 🌐 **Sitio público** — sin necesidad de iniciar sesión para ver el menú.
- 🔐 **Autenticación JWT** con refresco automático de token.
- 🧑‍🍳 **Tres roles**: Administrador, Empleado y Cliente, cada uno con su propio panel.
- 🖼️ **Banners y platos con imagen** — subida de archivo o link externo, a elección.
- 🗂️ **CRUD en tarjetas**, no en tablas planas — para cada recurso del backend.
- 🎨 Identidad visual propia (logo, paleta e íconos hechos a mano en SVG, sin librerías de íconos externas).

## 🧱 Stack

| | |
|---|---|
| **UI** | React 19 + TypeScript |
| **Build/dev server** | Vite |
| **Ruteo** | React Router 7 |
| **HTTP** | Axios (con interceptor de refresh de token) |
| **Estilos** | CSS puro (variables por tema, `prefers-color-scheme` light/dark) |
| **Lint** | Oxlint |

## 🚀 Empezando

### Requisitos

- Node.js 20+
- El [backend](../restaurant-corella) corriendo (por defecto en `http://localhost:8000`)

### Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:8000/api` |

### Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo con HMR |
| `npm run build` | Type-check (`tsc -b`) + build de producción |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | Corre Oxlint sobre todo el proyecto |

## 🗺️ Rutas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Pública | Inicio: hero, banners, "por qué elegirnos", historia, contacto |
| `/menu` | Pública | Menú completo con categorías y buscador |
| `/admin` | Rol **admin** | Catálogo, Banners, Inventario, Mesas y zonas, Reservas, Pedidos, Pagos y facturas, Personal y clientes |
| `/empleado` | Rol **empleado** | Pedidos, Mesas, Reservas |
| `/cliente` | Rol **cliente** | Menú, Mis reservas, Mis pedidos |

El rol se resuelve automáticamente al iniciar sesión (`ProtectedRoute` redirige al panel que corresponde). Usuarios de prueba disponibles vía el `seed_data.py` del backend: `admin` / `dinosaurio12`, `mesero1` / `Mesero123!`, `cliente1` / `Cliente123!`.

## 📁 Estructura del proyecto

```
src/
├── api/           # Cliente Axios + un "resource factory" de CRUD por endpoint
├── components/    # Componentes compartidos (Logo, Icon, SiteHeader/Footer,
│                  # ResourceCrud, LoginModal, DashboardLayout, PedidosBoard)
├── context/       # AuthContext (sesión, login/registro/logout)
├── pages/
│   ├── admin/     # Paneles del rol admin
│   ├── empleado/  # Paneles del rol empleado
│   └── cliente/   # Paneles del rol cliente
├── router/        # ProtectedRoute + resolución de ruta por rol
├── styles/        # Estilos compartidos de modales
└── utils/         # Helpers (ej. resolver imagen: archivo subido o link)
```

### El componente clave: `ResourceCrud`

Todo el panel de administración se arma sobre un único componente CRUD genérico y reutilizable: le pasas las columnas, los campos del formulario y el endpoint, y obtienes listado en tarjetas, alta, edición e imagen (subida o por link) sin repetir código por cada recurso.

## 🔗 Backend

Este frontend necesita la [API de Django](../restaurant-corella) corriendo para funcionar. Ver ese repo para instrucciones de instalación, modelos y endpoints.
