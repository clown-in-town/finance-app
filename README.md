# Finance App 💰

Una aplicación moderna para la gestión de finanzas personales, construida con React Native y Expo. Esta aplicación está diseñada como un prototipo frontend completamente funcional que permite registrar gastos, ingresos, gestionar categorías personalizadas y visualizar un resumen analítico con gráficas dinámicas.

---

## 🏛️ Arquitectura del Proyecto

La aplicación sigue una arquitectura modular enfocada en el frontend, utilizando las mejores prácticas de React Native:

### 1. Enrutamiento (Navegación)
Utilizamos **Expo Router** para el enrutamiento basado en archivos (File-based routing). 
* Todo el esquema de navegación por pestañas inferiores (Bottom Tabs) se define en `src/app/_layout.tsx`.
* Cada archivo dentro de `src/app/` (ej. `index.tsx`, `gastos.tsx`) representa una pantalla independiente en la aplicación.

### 2. Gestión de Estado Global
En lugar de depender de librerías externas complejas como Redux, el estado de la aplicación se gestiona de forma nativa utilizando la **React Context API**.
* **Archivo Central:** `src/context/FinanceContext.tsx` actúa como el "cerebro" de la aplicación.
* Contiene toda la lógica de negocio (CRUD) para manejar transacciones (ingresos/gastos) y categorías.
* El estado reside en memoria de forma local (Ideal para la fase de prototipo actual).

### 3. Sistema de Componentes (UI)
La interfaz de usuario está construida mediante componentes reutilizables alojados en `src/components/`. 
* Diseñados con una estética moderna usando la API estándar `StyleSheet`.
* Destacan componentes como `CustomDatePicker` (un calendario modal hecho a medida) y `TransactionCard`.
* Toda la iconografía es proveída por la librería `lucide-react-native`.

### 4. Gráficas y Visualización de Datos
El módulo de resumen analítico (`src/app/resumen.tsx`) utiliza la librería `react-native-gifted-charts` para procesar y renderizar datos en tiempo real (Gráfica de líneas, pastel y barras) en función de los filtros de fecha.

---

## 📂 Estructura de Carpetas

```text
finance-app/
├── src/
│   ├── app/                # Rutas y Pantallas (Expo Router)
│   │   ├── _layout.tsx     # Configuración del Tab Navigator
│   │   ├── index.tsx       # Pantalla de Inicio (Dashboard)
│   │   ├── gastos.tsx      # Pantalla de Registro de Gastos
│   │   ├── ingresos.tsx    # Pantalla de Registro de Ingresos
│   │   ├── categorias.tsx  # Pantalla de Gestión de Categorías
│   │   └── resumen.tsx     # Pantalla de Gráficas y Analíticas
│   ├── components/         # Componentes UI reutilizables
│   │   ├── CustomButton.tsx
│   │   ├── CustomDatePicker.tsx
│   │   └── TransactionCard.tsx
│   ├── context/            # Lógica de estado global
│   │   └── FinanceContext.tsx
│   └── constants/          # Variables globales (Colores, Temas)
│       └── Colors.ts
├── package.json            # Dependencias del proyecto
└── README.md
```

---

## 🚀 Pasos para Ejecutar el Proyecto

Sigue estos pasos para correr la aplicación en tu entorno local.

### 1. Requisitos Previos
Asegúrate de tener instalados en tu computadora:
- **Node.js** (versión LTS recomendada)
- **Git**
- La aplicación móvil **Expo Go** instalada en tu dispositivo físico (iOS o Android), o bien, tener configurado un emulador (Android Studio o Xcode Simulator).

### 2. Instalación de Dependencias
Abre una terminal en el directorio raíz del proyecto y ejecuta:

```bash
npm install
```

### 3. Iniciar el Servidor de Desarrollo
Una vez instaladas las dependencias, inicia Expo ejecutando:

```bash
npm start
```
*(También puedes usar `npx expo start`)*

### 4. Abrir la Aplicación
Al ejecutar el comando anterior, se mostrará un código QR en tu terminal (y se abrirá una ventana en tu navegador web).

* **En tu celular físico:** Abre la app **Expo Go** y escanea el código QR que aparece en la terminal.
* **En emulador Android:** Presiona la tecla `a` en la terminal.
* **En simulador iOS:** Presiona la tecla `i` en la terminal.
* **En navegador web:** Presiona la tecla `w` en la terminal. *(Nota: La interfaz está optimizada para móvil, aunque es compatible con la web).*

---

## ✨ Características Principales

* **Registro con Fecha Precisa:** Almacenamiento de transacciones con marca de tiempo exacta (ISO).
* **Calendario Personalizado:** Interfaz modal fluida para selección de fechas retrospectivas.
* **Categorías Dinámicas:** Creación, edición y eliminación de categorías (con protección a eliminación en cascada hacia la categoría "General").
* **Analítica en Tiempo Real:** Las gráficas reaccionan de manera instantánea a cualquier nuevo registro.
