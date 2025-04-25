# Similar Products App

Aplicación web para visualizar productos y sus productos similares.

## Tecnologías utilizadas

- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- Vitest (para testing)

## Requisitos previos

- Node.js (v14 o superior)
- npm o yarn

## Instalación

1. Clona este repositorio
2. Instala las dependencias:

```bash
npm install
# o
yarn
```

## Scripts disponibles

### Ejecución en desarrollo

```bash
npm run start
# o
yarn start
```

La aplicación estará disponible en http://localhost:5173

### Construcción para producción

```bash
npm run build
# o
yarn build
```

Los archivos de producción se generarán en la carpeta `dist/`.

### Ejecución de tests

```bash
npm run test
# o
yarn test
```

### Análisis de código (lint)

```bash
npm run lint
# o
yarn lint
```

## Estructura del proyecto

- `src/components/`: Componentes reutilizables
- `src/pages/`: Páginas de la aplicación
- `src/services/`: Servicios para comunicarse con la API
- `src/context/`: Contextos de React para el estado global
  - `CartContext.js`: Definición del contexto del carrito
  - `CartProvider.jsx`: Proveedor con la lógica del carrito
  - `useCart.js`: Hook personalizado para acceder al contexto
- `src/App.jsx`: Componente principal con las rutas
- `src/main.jsx`: Punto de entrada de la aplicación

## API

La aplicación se comunica con una API REST que proporciona:
- Detalles de un producto específico
- Lista de productos similares

## Características

- Visualización de detalles de productos
- Exploración de productos similares
- Gestión de carrito de compras
- Proceso de checkout
- Historial de pedidos
- Interfaz responsive
- Manejo de estados de carga y errores
