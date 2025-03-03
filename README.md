# 🌍 Mapa Interactivo de Eventos en Ecuador  

Este proyecto es una aplicación web diseñada inicialmente para visualizar y analizar datos sobre aluviones en Ecuador desde 2010 hasta 2023. Sin embargo, su arquitectura y diseño flexible permiten extender el alcance a otros tipos de eventos, como terremotos, inundaciones, deslizamientos de tierra, entre otros.  

Incluye filtros dinámicos y un mapa interactivo para explorar datos como la ubicación, tipo de evento, número de fallecidos, descripciones y más, ofreciendo una herramienta versátil para la gestión y visualización de información geoespacial.  

---

🗺️ **Mapa interactivo** con filtros avanzados para visualizar eventos según su ubicación, severidad y tipo.  

🔍 **Filtros dinámicos** para explorar datos históricos con diferentes criterios.  

📊 **Gráficos interactivos** utilizando **Chart.js** para visualizar datos de manera efectiva.  

🗺️ **Mapas interactivos** utilizando **Leaflet** para mostrar la ubicación de los eventos.  

🚀 **Frontend y Backend en SvelteKit**, conectado a **Supabase (PostgreSQL)**.  

📡 **Desplegado en Vercel**.  

---

## 🛠️ Arquitectura General  

![Diagrama de Arquitectura](https://raw.githubusercontent.com/Snayderstone/UYANA/localmain/Arquitectura.jpeg)

1️⃣ **Base de Datos (Supabase - PostgreSQL):**  
   - Supabase actúa como un backend-as-a-service con autenticación, almacenamiento y APIs generadas automáticamente.
   - Almacena todos los eventos con soporte para datos geoespaciales.  
   - Estructura adaptable para incluir nuevos tipos de eventos.  

2️⃣ **Frontend y Backend (SvelteKit):**  
   - **Interfaz de usuario interactiva y moderna:** Utiliza SvelteKit para crear una experiencia de usuario dinámica y reactiva.
   - **Lógica de negocio:** Maneja la lógica de negocio directamente en SvelteKit, sin necesidad de un backend separado.
   - **Endpoints server-side:** SvelteKit maneja endpoints server-side cuando es necesario.
   - **Comunicación con la base de datos:** Interactúa con Supabase (PostgreSQL) directamente desde SvelteKit para realizar operaciones CRUD.

3️⃣ **Despliegue:**  
   - **Plataforma:** Vercel para el despliegue continuo y la entrega del frontend y backend.
   - **Configuraciones específicas:** Si se manejan configuraciones específicas en `vercel.json`, menciónalas aquí.

---

## 📂 Estructura del Proyecto  

```plaintext
mapa-interactivo-de-eventos-en-ecuador/
├── .env                 # Variables de entorno
├── .eslintignore        # Configuración de ESLint
├── .eslintrc.cjs        # Configuración de ESLint
├── .gitignore           # Archivos ignorados por Git
├── .npmrc               # Configuración de npm
├── .prettierignore      # Configuración de Prettier
├── .prettierrc          # Configuración de Prettier
├── .svelte-kit/         # Archivos generados por SvelteKit
├── .vscode/             # Configuración de Visual Studio Code
├── frontmatter.json     # Configuración de frontmatter
├── histoire.config.js   # Configuración de Histoire
├── jsconfig.json        # Configuración de JavaScript
├── LICENSE              # Licencia del proyecto
├── package.json         # Dependencias del proyecto
├── README.md            # Documentación del repositorio
├── src/                 # Código fuente del proyecto
│   ├── app.d.ts
│   ├── app.html
│   ├── lib/             # Componentes, servicios, stores, estilos
│   │   ├── components/  # Componentes reutilizables
│   │   │   ├── atoms/   # Componentes básicos
│   │   │   │   ├── Button.svelte
│   │   │   │   ├── Card.svelte
│   │   │   │   └── ...
│   │   │   ├── molecules/ # Componentes más complejos
│   │   │   │   ├── FeatureCard.svelte
│   │   │   │   ├── EventTooltip.svelte
│   │   │   │   └── ...
│   │   │   ├── organisms/ # Componentes completos de secciones
│   │   │   │   ├── Header.svelte
│   │   │   │   ├── AluvionesDashboard.svelte
│   │   │   │   └── ...
│   │   ├── config/      # Configuraciones
│   │   │   └── supabase.config.ts
│   │   ├── data/        # Datos estáticos
│   │   ├── icons/       # Iconos
│   │   ├── scss/        # Estilos globales
│   │   ├── services/    # Servicios y lógica de negocio
│   │   ├── stores/      # Stores de Svelte
│   │   ├── types/       # Tipos de TypeScript
│   │   └── utils/       # Funciones auxiliares
│   ├── routes/          # Páginas principales
├── static/              # Archivos estáticos
│   ├── favicons/
│   └── images/
├── svelte.config.js     # Configuración de SvelteKit
└── vite.config.js       # Configuración de Vite
```

---

## 🧑‍💻 Instalación Local

### Requisitos Previos
- Tener Node.js (versión 14 o superior) y npm instalados.
- Contar con una base de datos en Supabase.
- Tener Git instalado para clonar el repositorio.

### Pasos para Ejecutar el Proyecto en Desarrollo

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Snayderstone/mapa-interactivo-de-eventos-en-ecuador.git
   cd mapa-interactivo-de-eventos-en-ecuador
   ```

2. Configura las variables de entorno:
   Copia el archivo `.env.example` a [`.env`](.env) y completa las variables necesarias:
   ```properties
   VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Ejecuta el proyecto en modo desarrollo:
   ```bash
   npm run dev
   ```

5. Accede a la aplicación:
   - Abre tu navegador y visita [http://localhost:5173](http://localhost:5173).

---

## 📊 Librerías Utilizadas

### Chart.js
- **Descripción:** Utilizado para crear gráficos interactivos y visualizaciones de datos.
- **Ubicación:** Los gráficos se configuran y utilizan en componentes como [`AluvionesDashboard.svelte`](src/lib/components/organisms/AluvionesDashboard.svelte).

### Leaflet
- **Descripción:** Utilizado para crear mapas interactivos y mostrar la ubicación de los eventos.
- **Ubicación:** Los mapas se configuran y utilizan en componentes como [`AluvionesMap.svelte`](src/lib/components/organisms/AluvionesMap.svelte).

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar el proyecto, agregar nuevas funcionalidades o corregir algún error, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama para tu mejora:
   ```bash
   git checkout -b feature-nueva-funcionalidad
   ```
3. Realiza tus cambios y commitea:
   ```bash
   git commit -m "Añadida nueva funcionalidad X"
   ```
4. Envía tus cambios a tu fork:
   ```bash
   git push origin feature-nueva-funcionalidad
   ```
5. Abre un Pull Request en GitHub.

También puedes abrir issues o discutir nuevas ideas en GitHub.

---

## 📝 Licencia

Este proyecto está bajo la licencia MIT.
```
