# 🖥️ ClinicaFrontend – Frontend Angular del Sistema Médico

## Descripción

**ClinicaFrontend** es la interfaz de usuario del sistema **ClinicaSalud**, construida con **Angular 19**. Permite gestionar **pacientes**, **médicos** y **citas médicas** desde el navegador, consumiendo dos APIs backend y una API externa de clima.

Este proyecto forma parte del sistema **ClinicaSalud** para la materia **Programación Web I – Tercero A Nocturno**.

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 19.x | Framework frontend |
| TypeScript | 5.x | Lenguaje de programación |
| HTML5 / CSS3 | - | Estructura y estilos |
| RxJS | 7.x | Programación reactiva |
| Open-Meteo API | - | API externa de clima |

---

## Arquitectura del Proyecto

```
ClinicaFrontend/src/app/
├── home/                    → Dashboard principal con estadísticas
│   ├── home.ts
│   ├── home.html
│   └── home.css
├── pacientes/               → Consulta de pacientes (SOAP API)
│   ├── pacientes.ts
│   ├── pacientes.html
│   └── pacientes.css
├── medicos/                 → Directorio de médicos (REST API)
│   ├── medicos.ts
│   ├── medicos.html
│   └── medicos.css
├── citas/                   → CRUD de citas médicas (SOAP API)
│   ├── citas.ts
│   ├── citas.html
│   └── citas.css
├── tratamientos/            → Vista de citas con tratamiento
│   ├── tratamientos.ts
│   ├── tratamientos.html
│   └── tratamientos.css
├── clima/                   → Clima y recomendaciones de salud
│   ├── clima.ts
│   ├── clima.html
│   └── clima.css
├── models/                  → Interfaces TypeScript
│   ├── paciente.model.ts    → Paciente y Cita
│   ├── medico.model.ts      → Médico
│   └── clima.model.ts       → Clima y Recomendación
├── services/                → Servicios HTTP
│   ├── tratamiento.service.ts → Consume TratamientoSOAP API
│   ├── medico.service.ts      → Consume MedicoAPI REST
│   └── clima.service.ts       → Consume Open-Meteo API
├── app.ts                   → Componente principal
├── app.html                 → Sidebar y layout
├── app.routes.ts            → Rutas de la aplicación
└── app.config.ts            → Configuración de Angular
```

---

## Módulos / Componentes

### 🏠 Dashboard (Home)
- Muestra estadísticas generales: pacientes, médicos, citas, temperatura
- Acceso rápido a cada sección del sistema
- Información de los APIs conectados

### 👥 Pacientes
- Listado de todos los pacientes registrados
- Búsqueda por nombre, apellido, cédula o teléfono
- Estadísticas de pacientes activos/inactivos
- **Datos desde:** TratamientoSOAP API (`localhost:5087`)

### 👨‍⚕️ Médicos
- Directorio del personal médico
- Filtro por especialidad
- Búsqueda por nombre, cédula o cargo
- **Datos desde:** MedicoAPI REST (`localhost:5204`)

### 📋 Citas (CRUD Completo)
- **Crear** nueva cita con selección de paciente y médico
- **Leer** todas las citas en tabla con búsqueda
- **Editar** cita existente (fecha, hora, motivo, tratamiento, médico)
- **Eliminar** cita con confirmación
- La cita **relaciona** paciente + médico correctamente
- **Datos desde:** TratamientoSOAP API (`localhost:5087`)

### 💊 Tratamientos
- Vista de solo lectura de citas con tratamiento asignado
- Muestra paciente, médico, fecha, hora, motivo y tratamiento
- **Datos desde:** TratamientoSOAP API + MedicoAPI

### 🌤️ Clima y Salud
- Consulta del clima en tiempo real (Quito, Ecuador)
- Recomendaciones de salud según temperatura, UV, lluvia, viento
- Pronóstico de 3 días
- **Datos desde:** Open-Meteo API (API externa pública, sin API key)

---

## APIs Consumidas

| API | Tipo | URL Base | Descripción |
|---|---|---|---|
| TratamientoSOAP | SOAP + REST | `http://localhost:5087` | Pacientes y Citas |
| MedicoAPI | REST | `http://localhost:5204` | Médicos (CRUD) |
| Open-Meteo | REST (Pública) | `https://api.open-meteo.com` | Clima en tiempo real |

---

## Rutas de la Aplicación

| Ruta | Componente | Descripción |
|---|---|---|
| `/home` | HomeComponent | Dashboard principal |
| `/pacientes` | PacientesComponent | Directorio de pacientes |
| `/medicos` | MedicosComponent | Directorio de médicos |
| `/citas` | CitasComponent | CRUD de citas médicas |
| `/tratamientos` | TratamientosComponent | Vista de tratamientos |
| `/clima` | ClimaComponent | Clima y recomendaciones |

---

## Requisitos Previos

1. **Node.js** 18+ y **npm** instalados
2. **Angular CLI** instalado globalmente: `npm install -g @angular/cli`
3. **TratamientoSOAP** ejecutándose en `http://localhost:5087`
4. **MedicoAPI** ejecutándose en `http://localhost:5204`

---

## Cómo Ejecutar

### 1. Instalar dependencias

```bash
cd ClinicaFrontend
npm install
```

### 2. Ejecutar en modo desarrollo

```bash
ng serve
```

La aplicación estará disponible en: `http://localhost:4200`

### 3. Compilar para producción

```bash
ng build
```

Los archivos se generarán en la carpeta `dist/`.

---

## Orden de Ejecución del Sistema Completo

1. **SQL Server** – Ejecutar los scripts SQL (primero SOAP, luego Medico)
2. **TratamientoSOAP** – `dotnet run` (puerto 5087)
3. **MedicoAPI** – `dotnet run` (puerto 5204)
4. **ClinicaFrontend** – `ng serve` (puerto 4200)

---

## Autor

**Alex Rodriguez** – Programación Web I – Tercero A Nocturno
