# 🏥 ClinicaSalud – Sistema Integral de Gestión Médica

Sistema completo de gestión médica compuesto por tres aplicaciones desacopladas: un servicio web **SOAP / REST** para Pacientes y Citas, una **API REST** para Médicos, y una interfaz de usuario en **Angular 19** que integra ambas APIs y un servicio externo de Clima.

Proyecto desarrollado para la materia de **Programación Web I** (Tercero A Nocturno).

---

## 📁 Estructura del Repositorio

El repositorio está organizado en tres proyectos independientes, cada uno con su propio `README.md`, scripts de base de datos (`SQL/`) y colecciones de prueba para Postman (`Postman/`):

```text
Tratamiento/
├── TratamientoSOAP/                 # Servicio SOAP (CoreWCF) y REST (ASP.NET Core)
│   ├── Controllers/                 # Controladores REST para Pacientes y Citas
│   ├── Data/                        # ClinicaDBContext (Entity Framework Core)
│   ├── Models/                      # Modelos de Paciente y Cita
│   ├── Services/                    # Contratos e implementación SOAP (CoreWCF)
│   ├── SQL/                         # Script de base de datos: Script_ClinicaDB_SOAP.sql
│   ├── Postman/                     # Colección Postman: TratamientoSOAP_Collection.json
│   ├── Program.cs                   # Configuración y puertos (http://localhost:5087)
│   ├── appsettings.json             # Cadena de conexión a ClinicaDB
│   └── README.md                    # Documentación específica de TratamientoSOAP
│
├── MedicoAPI/                       # API REST para Gestión de Médicos
│   ├── Controllers_Rest/            # Controlador REST de Médicos (/api/medico)
│   ├── Data_Rest/                   # ClinicaDBContext para MedicoAPI
│   ├── Models_Rest/                 # Modelos de Medico y Cita
│   ├── SQL/                         # Script de base de datos: Script_ClinicaDB_Medico.sql
│   ├── Postman/                     # Colección Postman: MedicoAPI_REST_Collection.json
│   ├── Program.cs                   # Configuración y puertos (http://localhost:5204)
│   ├── appsettings.json             # Cadena de conexión a ClinicaDB
│   └── README.md                    # Documentación específica de MedicoAPI
│
├── ClinicaFrontend/                 # Frontend SPA en Angular 19
│   ├── src/app/
│   │   ├── pacientes/               # Módulo de consulta de pacientes
│   │   ├── medicos/                 # Módulo de gestión y directorio de médicos
│   │   ├── citas/                   # Módulo CRUD de citas médicas con selección de paciente y médico
│   │   ├── clima/                   # Consumo de API externa de clima
│   │   ├── home/                    # Dashboard central con accesos rápidos y métricas
│   │   └── services/                # Servicios HTTP hacia SOAP, REST y Clima
│   ├── package.json                 # Dependencias npm
│   └── README.md                    # Documentación específica de ClinicaFrontend
│
├── Tratamiento.slnx                 # Solución Visual Studio unificada
├── .gitignore                       # Configuración de exclusiones Git (C#, Angular, Node)
└── README.md                        # Documentación general del repositorio
```

---

## 🛠️ Tecnologías y Arquitectura

| Componente | Rol | Tecnologías | URL por Defecto |
|---|---|---|---|
| **TratamientoSOAP** | Backend SOAP / REST | .NET 10, CoreWCF, EF Core, SQL Server | `http://localhost:5087` |
| **MedicoAPI** | Backend REST | ASP.NET Core Web API, EF Core, SQL Server | `http://localhost:5204` |
| **ClinicaFrontend** | Frontend SPA | Angular 19, TypeScript, CSS Vanilla, Material Icons | `http://localhost:4200` |
| **Open-Meteo API** | API Externa | REST / JSON pública (Clima en tiempo real) | `https://api.open-meteo.com` |

---

## 🚀 Guía de Puesta en Marcha (Paso a Paso)

### 1. Requisitos Previos

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js v20+](https://nodejs.org/) y npm
- [Angular CLI v19+](https://angular.dev/) (`npm install -g @angular/cli`)
- [SQL Server](https://www.microsoft.com/sql-server) (Express o Developer)
- [Postman](https://www.postman.com/) (opcional, para pruebas de endpoints)

---

### 2. Base de Datos (SQL Server)

Ejecuta los scripts en el siguiente orden en **SQL Server Management Studio (SSMS)**:

1. `TratamientoSOAP/SQL/Script_ClinicaDB_SOAP.sql`  
   Crea la base de datos `ClinicaDB`, las tablas `Paciente` y `Cita`, e inserta datos iniciales.
2. `MedicoAPI/SQL/Script_ClinicaDB_Medico.sql`  
   Crea la tabla `Medico`, agrega la clave foránea en `Cita` (`cit_IdMedico`) e inserta médicos de ejemplo.

> ⚠️ **Cadena de Conexión:** Revisa el archivo `appsettings.json` en `TratamientoSOAP/` y `MedicoAPI/` para asegurarte de que `Data Source` apunte a tu servidor de SQL Server (por ejemplo: `localhost`, `.\SQLEXPRESS` o el nombre de tu equipo).

---

### 3. Iniciar los Backends

#### Terminal 1 — Iniciar TratamientoSOAP:
```bash
cd TratamientoSOAP
dotnet run
```
*Servicio disponible en `http://localhost:5087` (SOAP WSDL en `http://localhost:5087/ClinicaService.svc`).*

#### Terminal 2 — Iniciar MedicoAPI:
```bash
cd MedicoAPI
dotnet run
```
*API disponible en `http://localhost:5204` (Swagger en `http://localhost:5204/swagger`).*

---

### 4. Iniciar el Frontend (Angular)

#### Terminal 3 — Iniciar ClinicaFrontend:
```bash
cd ClinicaFrontend
npm install
npm start
```
*Aplicación accesible en el navegador en `http://localhost:4200`.*

---

## 🧪 Pruebas con Postman

En las carpetas de cada backend se incluyen colecciones listas para importar:

- `TratamientoSOAP/Postman/TratamientoSOAP_Collection.json` — Endpoints SOAP y REST para Pacientes y Citas.
- `MedicoAPI/Postman/MedicoAPI_REST_Collection.json` — Endpoints REST CRUD para Médicos.

---

## 👥 Autor

- **Alex Rodriguez** – *Programación Web I (Tercero A Nocturno)*
