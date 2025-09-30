# DevsLlcAngularProject

Una aplicación web de gestión de productos desarrollada con Angular 20. Permite a los usuarios listar, crear, editar y eliminar productos de manera eficiente, utilizando una interfaz moderna y responsiva.

## Descripción de la Aplicación

Esta aplicación es un sistema de gestión de productos que incluye las siguientes funcionalidades principales:

- **Lista de Productos**: Visualización paginada de productos con búsqueda y filtrado.
- **Registro de Productos**: Formulario para crear nuevos productos con validación de ID único.
- **Edición de Productos**: Modificación de productos existentes.
- **Eliminación de Productos**: Confirmación de eliminación con modal.
- **Interfaz de Usuario**: Componentes reutilizables y diseño responsivo.

## Prerrequisitos

### Dependencias Externas
Esta aplicación requiere un **backend/API REST** ejecutándose para funcionar completamente:

- **API URL**: `http://localhost:3002/bp`
- **Estado**: La aplicación se ejecutará sin la API, pero las funcionalidades de datos estarán limitadas
- **Funcionalidades que requieren API**:
  - Visualización de lista de productos
  - Creación de nuevos productos
  - Edición de productos existentes
  - Eliminación de productos
  - Validación de ID único de productos

### Configuración de la API
La URL de la API se configura en los archivos de entorno:
- Desarrollo: `src/environments/environment.development.ts`
- Producción: `src/environments/environment.ts`

## Tecnologías y Dependencias

### Tecnologías Principales
- **Angular 20**: Framework principal para el desarrollo de la aplicación.
- **TypeScript**: Lenguaje de programación tipado.
- **SCSS**: Preprocesador CSS para estilos.
- **RxJS**: Programación reactiva para manejo de flujos de datos.
- **TanStack Query**: Gestión de estado y cache para operaciones CRUD.

### Dependencias Clave
- `@angular/common`, `@angular/core`, etc.: Núcleo de Angular.
- `@tanstack/angular-query-experimental`: Para manejo de estado y queries.
- `date-fns`: Utilidades para manejo de fechas.
- `rxjs`: Programación reactiva.

### Herramientas de Desarrollo
- **Jest**: Framework de testing con configuración personalizada.
- **Angular CLI**: Herramientas de scaffolding y build.
- **Prettier**: Formateo de código.
- **ESLint**: Linting (a través de Angular CLI).

### Dependencias de Testing
- **Jest**: Framework de testing principal con configuración personalizada para Angular.
- **@angular-builders/jest**: Builder personalizado para integrar Jest con Angular CLI.
- **jest-preset-angular**: Configuración predefinida de Jest optimizada para proyectos Angular.
- **@ngneat/spectator**: Librería de utilidades para testing de componentes Angular con API simplificada.
- **jest-fetch-mock**: Utilidad para mockear peticiones fetch en tests.
- **jsdom**: Simulador de DOM para ejecutar tests en entorno Node.js.
- **@faker-js/faker**: Generador de datos falsos para crear mocks y fixtures en tests.
- **@types/jest**: Definiciones de tipos TypeScript para Jest.

## Estructura del Proyecto

El proyecto sigue una arquitectura modular organizada por características y responsabilidades:

```
src/
├── app/
│   ├── core/                    # Módulos centrales de la aplicación
│   │   └── layout/
│   │       └── header/          # Componente de encabezado
│   ├── features/                # Módulos por funcionalidad
│   │   ├── product-list/        # Lista de productos
│   │   ├── product-form/        # Formulario de registro
│   │   └── product-edit-form/   # Formulario de edición
│   ├── shared/                  # Código compartido
│   │   ├── data/                # Servicios de datos (API)
│   │   ├── models/              # Interfaces y tipos
│   │   └── ui/                  # Componentes de UI reutilizables
│   ├── utils/                   # Utilidades y helpers
│   │   ├── forms/               # Validadores personalizados
│   │   └── utils.ts             # Funciones auxiliares
│   ├── app.config.ts            # Configuración de la aplicación
│   ├── app.routes.ts            # Definición de rutas
│   ├── app.ts                   # Componente raíz
│   └── app.html                 # Template raíz
├── environments/                # Configuraciones por entorno
├── mocks/                       # Datos mock para testing
└── styles.scss                  # Estilos globales
```

### Organización por Capas
- **Core**: Componentes transversales como layout.
- **Features**: Funcionalidades específicas organizadas por dominio.
- **Shared**: Código reutilizable (UI, modelos, servicios).
- **Utils**: Utilidades y validadores personalizados.

## Patrones de Diseño Utilizados

### Arquitectura General
- **Arquitectura Basada en Características (Feature-Driven)**: Organización del código por funcionalidades de negocio.
- **Componentes Reutilizables**: Biblioteca de UI components en `shared/ui`.
- **Separación de Responsabilidades**: Capas claras para data, UI y lógica de negocio.

### Patrones Específicos
- **Dependency Injection**: Inyección de dependencias de Angular para servicios.
- **Repository Pattern**: Servicio `ProductApiService` como capa de abstracción para operaciones de datos.
- **CQRS (Command Query Responsibility Segregation)**: Separación entre queries (lectura) y mutations (escritura) usando TanStack Query.
- **Observer Pattern**: Uso de RxJS y signals para reactividad.
- **Lazy Loading**: Carga diferida de componentes para optimización de rendimiento.
- **Custom Validators**: Validadores asíncronos para validación de negocio (ej. ID único).
- **State Management**: TanStack Query para cache y sincronización de estado.

### Principios SOLID
- **Single Responsibility**: Cada componente/servicio tiene una responsabilidad única.
- **Open/Closed**: Componentes extensibles sin modificar código existente.
- **Liskov Substitution**: Interfaces consistentes.
- **Interface Segregation**: Interfaces específicas por funcionalidad.
- **Dependency Inversion**: Dependencias inyectadas, no hardcodeadas.

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Instalación
1. Clona el repositorio:
   ```bash
   git clone git@github.com:jhonnycgarcia/angular-devs-llc.git
   cd devs-llc-angular-project
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno (si es necesario):
   - Edita `src/environments/environment.ts` y `environment.development.ts` según tu configuración.

### Configuración de Desarrollo
- API URL: Configurada en `environment.development.ts`
- Puerto de desarrollo: 4200 (por defecto)

## Uso y Desarrollo

### Ejecutar en Modo Desarrollo
```bash
npm start
# o
ng serve
```
Accede a `http://localhost:4200` en tu navegador.

### Build de Producción
```bash
npm run build
```
Los archivos compilados se generan en `dist/`.

### Ejecutar Tests
```bash
npm test
# o para modo watch
npm run test:watch
```

### Ejecutar Tests con Cobertura
```bash
npm run test:coverage
```

## Guías de Desarrollo

### Estructura de Componentes
Cada componente sigue el patrón de Angular standalone:
- Archivo `.ts`: Lógica del componente
- Archivo `.html`: Template
- Archivo `.scss`: Estilos específicos
- Archivo `.spec.ts`: Tests unitarios

### Convenciones de Nomenclatura
- Componentes: PascalCase (ej. `ProductListComponent`)
- Servicios: PascalCase con sufijo `Service` (ej. `ProductApiService`)
- Interfaces: PascalCase (ej. `Product`)
- Archivos: kebab-case (ej. `product-list.component.ts`)

### Testing
- Tests unitarios con Jest y Spectator
- Mocks disponibles en `src/mocks/`
- Cobertura de código: **70%** (líneas, funciones, ramas y statements)
- Comando para ejecutar tests con cobertura: `npm run test:coverage`

### Estilos
- SCSS con arquitectura de componentes
- Variables globales en `src/styles.scss`
- Componentes UI con estilos encapsulados

## API y Endpoints

La aplicación consume una API REST con los siguientes endpoints:

- `GET /products`: Obtener lista de productos
- `POST /products`: Crear producto
- `PUT /products/:id`: Actualizar producto
- `DELETE /products/:id`: Eliminar producto
- `GET /products/verification/:id`: Verificar si ID está disponible

## Optimización del Bundle

### Tamaño Actual del Build
- **Bundle inicial**: 511.53 kB (141.53 kB comprimido)
- **Polyfills**: 34.59 kB
- **Estilos**: 2.06 kB
- **Lazy chunks**: 94.64 kB

### Estrategias de Optimización Implementadas
1. **Lazy Loading**: Componentes cargados bajo demanda
2. **Tree Shaking**: Imports específicos para eliminar código no utilizado
3. **Presupuesto de Build**: Ajustado a 600kB para bundle inicial
4. **Compresión**: Archivos servidos con gzip/brotli en producción

### Recomendaciones para Mantenimiento
- **Monitoreo de Tamaño**: Ejecutar `npm run build` regularmente y revisar el output
- **Imports Eficientes**: Usar imports específicos en lugar de barrel imports
- **Lazy Loading**: Considerar dividir componentes grandes en chunks más pequeños
- **Dependencias**: Evaluar alternativas más ligeras para librerías pesadas
- **Code Splitting**: Usar `loadChildren` para rutas anidadas si crece la aplicación

### Comandos Útiles
```bash
# Build con análisis de bundle
npm run build -- --stats-json

# Build con source maps para debugging
npm run build -- --source-map

# Análisis detallado del bundle (después del build)
npm run analyze
```

## Contribución

1. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios siguiendo las convenciones del proyecto
3. Ejecuta tests: `npm test`
4. Crea un Pull Request con descripción detallada

## Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

---

Desarrollado con ❤️ por [jhonnycgarcia](https://github.com/jhonnycgarcia)
