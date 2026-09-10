# 🏥 TratamientoSOAP – Servicio SOAP para Pacientes y Citas

## Descripción

**TratamientoSOAP** es un servicio web construido con **ASP.NET Core + CoreWCF** que expone operaciones SOAP y endpoints REST para la gestión de **Pacientes** y **Citas Médicas** en la base de datos `ClinicaDB`.

Este proyecto forma parte del sistema **ClinicaSalud** para la materia **Programación Web I – Tercero A Nocturno**.

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| ASP.NET Core | .NET 8 | Framework web |
| CoreWCF | 1.x | Servicio SOAP (WCF) |
| Entity Framework Core | 8.x | ORM / acceso a datos |
| SQL Server | 2019+ | Base de datos |
| Swagger / OpenAPI | - | Documentación REST |

---

## Arquitectura

```
TratamientoSOAP/
├── Controllers/
│   └── ClinicaController.cs     → Endpoints REST (API)
├── Services/
│   ├── IClinicaService.cs       → Contrato SOAP (interfaz)
│   └── ClinicaService.cs        → Implementación del servicio
├── Models/
│   ├── Paciente.cs              → Modelo de Paciente
│   └── Cita.cs                  → Modelo de Cita
├── Data/
│   └── PacienteDBContext.cs     → Contexto Entity Framework
├── SQL/
│   └── Script_ClinicaDB_SOAP.sql → Script de base de datos
├── Postman/
│   └── TratamientoSOAP_Collection.json → Colección Postman
├── Program.cs                   → Configuración del servidor
└── appsettings.json             → Cadena de conexión
```

---

## Endpoints REST

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/clinica/pacientes` | Obtener todos los pacientes |
| `GET` | `/api/clinica/pacientes/{cedula}/citas` | Obtener paciente con sus citas |
| `GET` | `/api/clinica/citas` | Obtener todas las citas |
| `GET` | `/api/clinica/citas/{id}` | Obtener cita por ID |
| `GET` | `/api/clinica/citas/tratamiento/{tratamiento}` | Filtrar citas por tratamiento |
| `POST` | `/api/clinica/citas` | Crear nueva cita |
| `PUT` | `/api/clinica/citas` | Actualizar cita existente |
| `DELETE` | `/api/clinica/citas/{id}` | Eliminar cita |

## Endpoint SOAP

| Ruta | Protocolo |
|---|---|
| `/ClinicaService.svc` | BasicHttpBinding (SOAP) |

---

## Operaciones SOAP (WCF)

- `ObtenerPacientes()` → Lista de pacientes
- `ObtenerCitas()` → Lista de citas
- `ObtenerCita(int id)` → Cita por ID
- `AgregarCita(Cita cita)` → Crear cita
- `ActualizarCita(Cita cita)` → Actualizar cita
- `EliminarCita(int id)` → Eliminar cita
- `ObtenerCitaPorTratamiento(string tratamiento)` → Filtrar por tratamiento
- `ObtenerCitaPorCedula(string cedula)` → Citas por cédula del paciente
- `ObtenerPacienteConCitas(string cedula)` → Paciente con sus citas

---

## Base de Datos

**Nombre:** `ClinicaDB` (SQL Server)

### Tabla: Paciente
| Columna | Tipo | Descripción |
|---|---|---|
| `pac_IdPaciente` | int (PK, Identity) | ID del paciente |
| `pac_Cedula` | varchar(10) | Cédula de identidad |
| `pac_Nombre` | varchar(50) | Nombre |
| `pac_Apellido` | varchar(50) | Apellido |
| `pac_Telefono` | varchar(15) | Teléfono |
| `pac_Estado` | int | Estado (1=Activo, 0=Inactivo) |

### Tabla: Cita
| Columna | Tipo | Descripción |
|---|---|---|
| `cit_IdCita` | int (PK, Identity) | ID de la cita |
| `cit_Fecha` | date | Fecha de la cita |
| `cit_Hora` | time | Hora de la cita |
| `cit_Motivo` | varchar(100) | Motivo de consulta |
| `cit_Tratamiento` | varchar(100) | Tratamiento asignado |
| `cit_Estado` | int | Estado (1=Activa, 0=Inactiva) |
| `cit_IdPaciente` | int (FK) | Referencia a Paciente |
| `cit_IdMedico` | int (FK, nullable) | Referencia a Médico |

> El script SQL se encuentra en: `SQL/Script_ClinicaDB_SOAP.sql`

---

## Configuración

### 1. Cadena de conexión (`appsettings.json`)

```json
{
  "ConnectionStrings": {
    "ClinicaConnection": "Data Source=NOMBRE_SERVIDOR;Initial Catalog=ClinicaDB;Integrated Security=True;Encrypt=False"
  }
}
```

> Cambie `NOMBRE_SERVIDOR` por el nombre de su instancia de SQL Server.

### 2. Ejecutar el script SQL

Abra SQL Server Management Studio y ejecute el archivo `SQL/Script_ClinicaDB_SOAP.sql`.

### 3. Ejecutar el proyecto

```bash
dotnet run
```

El servidor se iniciará en `http://localhost:5087`.

---

## Pruebas con Postman

Importe la colección `Postman/TratamientoSOAP_Collection.json` en Postman para probar todos los endpoints REST.

---

## CORS

El servicio tiene configurado CORS para permitir peticiones desde el frontend Angular en `http://localhost:4200`.

---

## Autor

**Alex Rodriguez** – Programación Web I – Tercero A Nocturno
