# 🏥 TratamientoSOAP – Servicio Web SOAP para Pacientes y Citas

## Descripción

**TratamientoSOAP** es un servicio web SOAP construido con **ASP.NET Core + CoreWCF** que expone operaciones para la gestión de **Pacientes** y **Citas Médicas** en la base de datos `ClinicaDB`.

Toda la lógica de negocio y métodos de servicio están implementados en la capa de **`Services/`** (`IClinicaService.cs` y `ClinicaService.cs`), cumpliendo con los estándares de arquitectura de servicios web SOAP (WCF).

Este proyecto forma parte del sistema **ClinicaSalud** para la materia **Programación Web I – Tercero A Nocturno**.

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| ASP.NET Core | .NET 10 | Framework web host |
| CoreWCF (BasicHttpBinding) | 1.9.1 | Servicio SOAP (WCF) |
| Entity Framework Core | 10.x | ORM / acceso a datos |
| SQL Server | 2019+ | Base de datos relacional |

---

## Arquitectura

```
TratamientoSOAP/
├── POSTMAN/
│   └── TratamientoSOAP_Collection.json → Colección Postman (peticiones SOAP XML)
├── SQL/
│   └── Script_ClinicaDB_SOAP.sql       → Script de base de datos
├── Tratamiento/                        → Proyecto CoreWCF (.NET 10)
│   ├── Services/
│   │   ├── IClinicaService.cs          → Contrato de servicio SOAP ([ServiceContract])
│   │   └── ClinicaService.cs           → Lógica e implementación del servicio SOAP
│   ├── Models/
│   │   ├── Paciente.cs                 → Modelo entidad Paciente
│   │   └── Cita.cs                     → Modelo entidad Cita
│   ├── Data/
│   │   └── ClinicaDBContext.cs         → Contexto Entity Framework (PacienteDBContext)
│   ├── Properties/
│   │   └── launchSettings.json         → Configuración de ejecución
│   ├── Program.cs                      → Configuración del servidor y endpoint CoreWCF
│   ├── Tratamiento.csproj              → Archivo de proyecto .NET
│   └── appsettings.json                → Cadena de conexión SQL Server
├── .gitignore                          → Exclusiones de Git
├── README.md                           → Documentación del proyecto
└── Tratamiento.slnx                    → Archivo de solución Visual Studio
```

---

## Endpoint SOAP

| Recurso | URL | Protocolo |
|---|---|---|
| **Servicio SOAP** | `http://localhost:5087/ClinicaService.svc` | SOAP 1.1 (`BasicHttpBinding`) |
| **Definición WSDL** | `http://localhost:5087/ClinicaService.svc?wsdl` | XML / WSDL |

---

## Operaciones SOAP (WCF)

Todas las operaciones se invocan enviando una petición HTTP `POST` a `http://localhost:5087/ClinicaService.svc` con `Content-Type: text/xml; charset=utf-8` y la cabecera `SOAPAction` correspondiente:

| Operación | SOAPAction | Descripción |
|---|---|---|
| `ObtenerPacientes` | `http://tempuri.org/IClinicaService/ObtenerPacientes` | Lista todos los pacientes |
| `ObtenerCitas` | `http://tempuri.org/IClinicaService/ObtenerCitas` | Lista todas las citas médicas |
| `ObtenerCita` | `http://tempuri.org/IClinicaService/ObtenerCita` | Obtiene una cita por su ID |
| `AgregarCita` | `http://tempuri.org/IClinicaService/AgregarCita` | Registra una nueva cita médica |
| `ActualizarCita` | `http://tempuri.org/IClinicaService/ActualizarCita` | Actualiza los datos de una cita |
| `EliminarCita` | `http://tempuri.org/IClinicaService/EliminarCita` | Elimina una cita por ID |
| `ObtenerCitaPorTratamiento` | `http://tempuri.org/IClinicaService/ObtenerCitaPorTratamiento` | Filtra citas por descripción de tratamiento |
| `ObtenerCitaPorCedula` | `http://tempuri.org/IClinicaService/ObtenerCitaPorCedula` | Citas de un paciente por su cédula |
| `ObtenerPacienteConCitas` | `http://tempuri.org/IClinicaService/ObtenerPacienteConCitas` | Obtiene el paciente con sus citas asociadas |

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

## Configuración y Ejecución

### 1. Cadena de conexión (`appsettings.json`)

```json
{
  "ConnectionStrings": {
    "ClinicaConnection": "Data Source=ALEX_R;Initial Catalog=ClinicaDB;Integrated Security=True;Encrypt=False"
  }
}
```

### 2. Ejecutar el proyecto

```bash
cd TratamientoSOAP/Tratamiento
dotnet run
# O desde la raíz: dotnet run --project TratamientoSOAP/Tratamiento/Tratamiento.csproj
```

El servidor se iniciará en `http://localhost:5087`.

---

## Pruebas con Postman

1. Abra Postman e importe el archivo `POSTMAN/TratamientoSOAP_Collection.json`.
2. Ejecute cualquier petición (todas configuradas con sobre XML SOAP 1.1 y cabeceras correctas).

---

## Autor

**Alex Rodriguez** – Programación Web I – Tercero A Nocturno
