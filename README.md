# 🏥 Clínica - Servicio Web SOAP

Proyecto desarrollado para la asignatura de **Programación Web I**. Se implementa un servicio web **SOAP** para la gestión de pacientes y citas médicas utilizando **.NET 10**, **CoreWCF**, **Entity Framework Core** y **SQL Server**.

El servicio permite realizar operaciones **CRUD** (Consulta, Registro, Actualización y Eliminación) sobre citas médicas, así como consultas avanzadas de pacientes y citas.

---

## 📋 Tecnologías Utilizadas

| Tecnología | Versión |
|---|---|
| .NET | 10.0 |
| CoreWCF (SOAP) | 1.9.1 |
| Entity Framework Core | 10.0.11 |
| SQL Server | Express / Developer |
| Postman | Para pruebas del servicio |

---

## 📁 Estructura del Proyecto

```
Tratamiento/
├── POSTMAN/
│   └── Clinica_cita.postman_collection.json   # Colección de Postman con todos los métodos
├── SQL/
│   └── ClientesSOPANDB.sql                    # Script para crear la base de datos
├── Tratamiento/
│   ├── Data/
│   │   └── ClinicaDBContext.cs                 # Contexto de base de datos (EF Core)
│   ├── Models/
│   │   ├── Paciente.cs                         # Modelo de Paciente
│   │   └── Cita.cs                             # Modelo de Cita
│   ├── Services/
│   │   ├── IClinicaService.cs                  # Contrato del servicio SOAP (interfaz)
│   │   └── ClinicaService.cs                   # Implementación del servicio SOAP
│   ├── Properties/
│   ├── Program.cs                              # Configuración y arranque de la aplicación
│   ├── appsettings.json                        # Cadena de conexión a la base de datos
│   └── Tratamiento.csproj                      # Archivo de proyecto .NET
├── Tratamiento.slnx                            # Archivo de solución
└── README.md                                   # Este archivo
```

---

## ⚙️ Requisitos Previos

- [.NET 10 SDK](https://dotnet.microsoft.com/download) instalado
- [SQL Server](https://www.microsoft.com/sql-server) (Express o Developer Edition)
- [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/sql/ssms/) o Azure Data Studio
- [Postman](https://www.postman.com/downloads/) para probar los endpoints

---

## 🚀 Instrucciones de Instalación y Uso

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd Tratamiento
```

### 2. Crear la base de datos en SQL Server

1. Abre **SQL Server Management Studio (SSMS)**.
2. Conéctate a tu instancia de SQL Server.
3. Abre el archivo `SQL/ClientesSOPANDB.sql`.
4. Ejecuta el script completo (presiona **F5** o haz clic en **Ejecutar**).

Esto creará:
- La base de datos `ClinicaDB`
- La tabla `Paciente` con 5 registros de ejemplo
- La tabla `Cita` con 10 registros de ejemplo
- La relación (FK) entre `Cita` y `Paciente`

### 3. ⚠️ Configurar la cadena de conexión (MUY IMPORTANTE)

Abre el archivo `Tratamiento/appsettings.json` y **cambia el valor de `Data Source`** por el nombre de **tu instancia de SQL Server**:

```json
{
  "ConnectionStrings": {
    "ClinicaConnection": "Data Source=TU_SERVIDOR;Initial Catalog=ClinicaDB;Integrated Security=True;Encrypt=False"
  }
}
```

**¿Cómo encontrar el nombre de tu servidor?**
- Abre SSMS → el nombre aparece en el campo **"Nombre del servidor"** al conectarte.
- Ejemplos comunes:
  - `localhost` — si es la instancia predeterminada local
  - `.\SQLEXPRESS` — si usas SQL Server Express
  - `MI_PC\SQLEXPRESS` — si necesitas el nombre de la máquina
  - `DESKTOP-XXXXX` — nombre de tu equipo

> **Nota:** El valor original es `ALEX_R`. Debes reemplazarlo por tu propio nombre de servidor.

### 4. Ejecutar el proyecto

```bash
cd Tratamiento
dotnet run
```

El servicio se iniciará en `http://localhost:5087`.

Para verificar que funciona, abre en tu navegador:

```
http://localhost:5087/ClinicaService.svc
```

Deberías ver la página de metadatos del servicio SOAP (WSDL).

---

## 🧪 Probar con Postman

### Importar la colección

1. Abre **Postman**.
2. Haz clic en **Import** (Importar).
3. Selecciona el archivo `POSTMAN/Clinica_cita.postman_collection.json`.
4. Se importará la colección **"Clinica_cita"** con todos los métodos listos para usar.

### Configuración de las peticiones

Todas las peticiones usan:
- **Método:** `POST`
- **URL:** `http://localhost:5087/ClinicaService.svc`
- **Content-Type:** `text/xml; charset=utf-8`
- **Body:** XML con formato SOAP Envelope

---

## 📡 Métodos del Servicio SOAP

### Consultar todos los Pacientes — `ObtenerPacientes`

**SOAPAction:** `http://tempuri.org/IClinicaService/ObtenerPacientes`

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:ObtenerPacientes/>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### Consultar todas las Citas — `ObtenerCitas`

**SOAPAction:** `http://tempuri.org/IClinicaService/ObtenerCitas`

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:ObtenerCitas/>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### Consultar una Cita por ID — `ObtenerCita`

**SOAPAction:** `http://tempuri.org/IClinicaService/ObtenerCita`

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:ObtenerCita>
         <tem:id>1</tem:id>
      </tem:ObtenerCita>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### Agregar una Cita — `AgregarCita`

**SOAPAction:** `http://tempuri.org/IClinicaService/AgregarCita`

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:tem="http://tempuri.org/"
                  xmlns:trat="http://schemas.datacontract.org/2004/07/Tratamiento.Models">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:AgregarCita>
         <tem:cita>
            <trat:IdCita>0</trat:IdCita>
            <trat:Fecha>2026-08-24T00:00:00</trat:Fecha>
            <trat:Hora>PT10H30M</trat:Hora>
            <trat:Motivo>Dolor de muela</trat:Motivo>
            <trat:DescTratamiento>Extracción</trat:DescTratamiento>
            <trat:Estado>1</trat:Estado>
            <trat:IdPaciente>1</trat:IdPaciente>
         </tem:cita>
      </tem:AgregarCita>
   </soapenv:Body>
</soapenv:Envelope>
```

> **Nota:** El campo `IdCita` debe ser `0` para que SQL Server genere el ID automáticamente (IDENTITY).

---

### Actualizar una Cita — `ActualizarCita`

**SOAPAction:** `http://tempuri.org/IClinicaService/ActualizarCita`

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:tem="http://tempuri.org/"
                  xmlns:trat="http://schemas.datacontract.org/2004/07/Tratamiento.Models">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:ActualizarCita>
         <tem:cita>
            <trat:DescTratamiento>Tratamiento de conducto</trat:DescTratamiento>
            <trat:Estado>2</trat:Estado>
            <trat:Fecha>2026-08-30T00:00:00</trat:Fecha>
            <trat:Hora>PT11H00M</trat:Hora>
            <trat:IdCita>12</trat:IdCita>
            <trat:IdPaciente>1</trat:IdPaciente>
            <trat:Motivo>Dolor agudo revisado</trat:Motivo>
         </tem:cita>
      </tem:ActualizarCita>
   </soapenv:Body>
</soapenv:Envelope>
```

> **Nota:** El campo `IdCita` debe contener el ID de la cita existente que deseas actualizar.

---

### Eliminar una Cita — `EliminarCita`

**SOAPAction:** `http://tempuri.org/IClinicaService/EliminarCita`

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:EliminarCita>
         <tem:id>7</tem:id>
      </tem:EliminarCita>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### Buscar Citas por Tratamiento — `ObtenerCitaPorTratamiento`

**SOAPAction:** `http://tempuri.org/IClinicaService/ObtenerCitaPorTratamiento`

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:ObtenerCitaPorTratamiento>
         <tem:tratamiento>Extracción</tem:tratamiento>
      </tem:ObtenerCitaPorTratamiento>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### Buscar Citas por Cédula del Paciente — `ObtenerCitaPorCedula`

**SOAPAction:** `http://tempuri.org/IClinicaService/ObtenerCitaPorCedula`

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:ObtenerCitaPorCedula>
         <tem:cedula>1712345678</tem:cedula>
      </tem:ObtenerCitaPorCedula>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### Obtener Paciente con todas sus Citas — `ObtenerPacienteConCitas`

**SOAPAction:** `http://tempuri.org/IClinicaService/ObtenerPacienteConCitas`

```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:ObtenerPacienteConCitas>
         <tem:cedula>1712345678</tem:cedula>
      </tem:ObtenerPacienteConCitas>
   </soapenv:Body>
</soapenv:Envelope>
```

---

## 🗄️ Modelo de Base de Datos

### Tabla `Paciente`

| Columna | Tipo | Descripción |
|---|---|---|
| `pac_IdPaciente` | `int` (PK, Identity) | ID único del paciente |
| `pac_Cedula` | `varchar(10)` | Cédula de identidad |
| `pac_Nombre` | `varchar(50)` | Nombre del paciente |
| `pac_Apellido` | `varchar(50)` | Apellido del paciente |
| `pac_Telefono` | `varchar(15)` | Teléfono de contacto |
| `pac_Estado` | `int` | Estado del registro (1=Activo) |

### Tabla `Cita`

| Columna | Tipo | Descripción |
|---|---|---|
| `cit_IdCita` | `int` (PK, Identity) | ID único de la cita |
| `cit_Fecha` | `date` | Fecha de la cita |
| `cit_Hora` | `time` | Hora de la cita |
| `cit_Motivo` | `varchar(100)` | Motivo de la consulta |
| `cit_Tratamiento` | `varchar(100)` | Descripción del tratamiento |
| `cit_Estado` | `int` | Estado de la cita (1=Activa, 2=Completada) |
| `cit_IdPaciente` | `int` (FK) | Referencia al paciente |

**Relación:** `Cita.cit_IdPaciente` → `Paciente.pac_IdPaciente` (FK)

---

## 📌 Resumen de Operaciones

| # | Método | Descripción | Parámetros |
|---|---|---|---|
| 1 | `ObtenerPacientes` | Lista todos los pacientes | Ninguno |
| 2 | `ObtenerCitas` | Lista todas las citas | Ninguno |
| 3 | `ObtenerCita` | Obtiene una cita por su ID | `id` (int) |
| 4 | `AgregarCita` | Registra una nueva cita | `cita` (objeto Cita) |
| 5 | `ActualizarCita` | Actualiza una cita existente | `cita` (objeto Cita) |
| 6 | `EliminarCita` | Elimina una cita por su ID | `id` (int) |
| 7 | `ObtenerCitaPorTratamiento` | Busca citas por tipo de tratamiento | `tratamiento` (string) |
| 8 | `ObtenerCitaPorCedula` | Busca citas por cédula del paciente | `cedula` (string) |
| 9 | `ObtenerPacienteConCitas` | Obtiene un paciente con todas sus citas | `cedula` (string) |

---

## 👨‍💻 Asignatura

**Programación Web I**

---

## 👤 Autor

| Campo | Detalle |
|---|---|
| **Nombre** | Alex Rodriguez C. |
| **Institución** | Instituto Tecnológico Superior Cordillera |
| **Curso** | Tercero "A" Nocturno |
| **Asignatura** | Programación Web I |
