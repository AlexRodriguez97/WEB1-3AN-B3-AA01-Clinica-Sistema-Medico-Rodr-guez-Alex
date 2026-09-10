# 👨‍⚕️ MedicoAPI – API REST para Gestión de Médicos

## Descripción

**MedicoAPI** es una API REST construida con **ASP.NET Core** que permite gestionar el personal médico (CRUD completo) en la base de datos `ClinicaDB`. Incluye endpoints para crear, leer, actualizar y eliminar médicos, así como consultar las citas asignadas a cada médico.

Este proyecto forma parte del sistema **ClinicaSalud** para la materia **Programación Web I – Tercero A Nocturno**.

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| ASP.NET Core | .NET 8 | Framework web |
| Entity Framework Core | 8.x | ORM / acceso a datos |
| SQL Server | 2019+ | Base de datos |
| Swagger / OpenAPI | - | Documentación API |

---

## Arquitectura

```
MedicoAPI/
├── POSTMAN/
│   └── MedicoAPI_REST_Collection.json → Colección Postman
├── SQL/
│   └── Script_ClinicaDB_Medico.sql    → Script de base de datos
├── MedicoAPI/                         → Proyecto ASP.NET Core Web API
│   ├── Controllers_Rest/
│   │   └── MedicoController.cs        → Endpoints REST (CRUD)
│   ├── Models_Rest/
│   │   ├── Medico.cs                  → Modelo de Médico
│   │   └── Cita.cs                    → Modelo de Cita (relación)
│   ├── Data_Rest/
│   │   └── MedicoDBContext.cs         → Contexto Entity Framework
│   ├── Properties/
│   │   └── launchSettings.json        → Configuración de ejecución
│   ├── Program.cs                     → Configuración del servidor
│   ├── MedicoAPI.csproj               → Archivo de proyecto .NET
│   └── appsettings.json               → Cadena de conexión
├── .gitignore                         → Exclusiones de Git
├── README.md                          → Documentación del proyecto
└── MedicoAPI.slnx                     → Archivo de solución Visual Studio
```

---

## Endpoints REST

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/medico` | Obtener todos los médicos |
| `GET` | `/api/medico/{id}` | Obtener médico por ID |
| `GET` | `/api/medico/cedula/{cedula}` | Obtener médico por cédula |
| `GET` | `/api/medico/{id}/citas` | Obtener médico con sus citas |
| `POST` | `/api/medico` | Crear nuevo médico |
| `PUT` | `/api/medico/{id}` | Actualizar médico existente |
| `DELETE` | `/api/medico/{id}` | Eliminar médico |

---

## Ejemplos de Peticiones

### Crear médico (POST)
```json
POST /api/medico
Content-Type: application/json

{
  "cedula": "1712340006",
  "nombre": "Laura",
  "apellido": "Martínez",
  "cargo": "Médico Especialista",
  "especialidad": "Dermatología",
  "estado": 1
}
```

### Actualizar médico (PUT)
```json
PUT /api/medico/1
Content-Type: application/json

{
  "idMedico": 1,
  "cedula": "1712340001",
  "nombre": "Roberto",
  "apellido": "Salazar",
  "cargo": "Médico Titular Senior",
  "especialidad": "Medicina General",
  "estado": 1
}
```

---

## Base de Datos

**Nombre:** `ClinicaDB` (SQL Server)

### Tabla: Medico
| Columna | Tipo | Descripción |
|---|---|---|
| `med_IdMedico` | int (PK, Identity) | ID del médico |
| `med_Cedula` | varchar(10) | Cédula de identidad |
| `med_Nombre` | varchar(50) | Nombre |
| `med_Apellido` | varchar(50) | Apellido |
| `med_Cargo` | varchar(50) | Cargo en la clínica |
| `med_Especialidad` | varchar(50) | Especialidad médica |
| `med_Estado` | int | Estado (1=Activo, 0=Inactivo) |

### Relación con Cita
La tabla `Cita` tiene una columna `cit_IdMedico` (FK) que referencia a `Medico.med_IdMedico`, permitiendo asignar un médico a cada cita.

> El script SQL se encuentra en: `SQL/Script_ClinicaDB_Medico.sql`  
> **Nota:** Ejecutar DESPUÉS del script de TratamientoSOAP.

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

Abra SQL Server Management Studio y ejecute el archivo `SQL/Script_ClinicaDB_Medico.sql`.

### 3. Ejecutar el proyecto

```bash
cd MedicoAPI
dotnet run
# O desde la raíz: dotnet run --project MedicoAPI/MedicoAPI.csproj
```

El servidor se iniciará en `http://localhost:5204`.

### 4. Documentación Swagger

Acceda a la documentación interactiva en: `http://localhost:5204/swagger`

---

## Pruebas con Postman

Importe la colección `Postman/MedicoAPI_REST_Collection.json` en Postman para probar todos los endpoints.

---

## CORS

La API tiene configurado CORS para permitir peticiones desde el frontend Angular en `http://localhost:4200`.

---

## Autor

**Alex Rodriguez** – Programación Web I – Tercero A Nocturno
