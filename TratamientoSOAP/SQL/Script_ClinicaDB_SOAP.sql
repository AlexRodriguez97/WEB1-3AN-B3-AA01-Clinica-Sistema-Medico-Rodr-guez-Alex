-- ============================================================
-- Script: ClinicaDB - Tablas Paciente y Cita
-- Proyecto: TratamientoSOAP (Servicio SOAP)
-- Base de Datos: ClinicaDB (SQL Server)
-- Autor: Alex Rodriguez
-- Descripción: Crea la base de datos ClinicaDB con las tablas
--              Paciente y Cita, e inserta datos de ejemplo.
-- ============================================================

USE [master]
GO

-- Crear base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ClinicaDB')
BEGIN
    CREATE DATABASE [ClinicaDB]
END
GO

USE [ClinicaDB]
GO

-- =====================
-- Tabla: Paciente
-- =====================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Paciente')
BEGIN
    CREATE TABLE [dbo].[Paciente](
        [pac_IdPaciente] [int] IDENTITY(1,1) NOT NULL,
        [pac_Cedula] [varchar](10) NOT NULL,
        [pac_Nombre] [varchar](50) NOT NULL,
        [pac_Apellido] [varchar](50) NOT NULL,
        [pac_Telefono] [varchar](15) NOT NULL,
        [pac_Estado] [int] NOT NULL,
        PRIMARY KEY CLUSTERED ([pac_IdPaciente] ASC)
    )
END
GO

-- =====================
-- Tabla: Cita
-- =====================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Cita')
BEGIN
    CREATE TABLE [dbo].[Cita](
        [cit_IdCita] [int] IDENTITY(1,1) NOT NULL,
        [cit_Fecha] [date] NOT NULL,
        [cit_Hora] [time](7) NOT NULL,
        [cit_Motivo] [varchar](100) NOT NULL,
        [cit_Tratamiento] [varchar](100) NOT NULL,
        [cit_Estado] [int] NOT NULL,
        [cit_IdPaciente] [int] NOT NULL,
        [cit_IdMedico] [int] NULL,
        PRIMARY KEY CLUSTERED ([cit_IdCita] ASC)
    )
END
GO

-- FK: Cita -> Paciente
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Cita_Paciente')
BEGIN
    ALTER TABLE [dbo].[Cita] WITH CHECK
    ADD CONSTRAINT [FK_Cita_Paciente] FOREIGN KEY([cit_IdPaciente])
    REFERENCES [dbo].[Paciente] ([pac_IdPaciente])
END
GO

-- =====================
-- Datos de ejemplo: Pacientes
-- =====================
SET IDENTITY_INSERT [dbo].[Paciente] ON

IF NOT EXISTS (SELECT 1 FROM [dbo].[Paciente] WHERE pac_IdPaciente = 1)
    INSERT [dbo].[Paciente] ([pac_IdPaciente], [pac_Cedula], [pac_Nombre], [pac_Apellido], [pac_Telefono], [pac_Estado])
    VALUES (1, N'1712345678', N'Carlos', N'Pérez', N'0991234567', 1)

IF NOT EXISTS (SELECT 1 FROM [dbo].[Paciente] WHERE pac_IdPaciente = 2)
    INSERT [dbo].[Paciente] ([pac_IdPaciente], [pac_Cedula], [pac_Nombre], [pac_Apellido], [pac_Telefono], [pac_Estado])
    VALUES (2, N'1723456789', N'María', N'Gómez', N'0982345678', 1)

IF NOT EXISTS (SELECT 1 FROM [dbo].[Paciente] WHERE pac_IdPaciente = 3)
    INSERT [dbo].[Paciente] ([pac_IdPaciente], [pac_Cedula], [pac_Nombre], [pac_Apellido], [pac_Telefono], [pac_Estado])
    VALUES (3, N'1734567890', N'José', N'Rodríguez', N'0973456789', 1)

IF NOT EXISTS (SELECT 1 FROM [dbo].[Paciente] WHERE pac_IdPaciente = 4)
    INSERT [dbo].[Paciente] ([pac_IdPaciente], [pac_Cedula], [pac_Nombre], [pac_Apellido], [pac_Telefono], [pac_Estado])
    VALUES (4, N'1745678901', N'Ana', N'López', N'0964567890', 1)

IF NOT EXISTS (SELECT 1 FROM [dbo].[Paciente] WHERE pac_IdPaciente = 5)
    INSERT [dbo].[Paciente] ([pac_IdPaciente], [pac_Cedula], [pac_Nombre], [pac_Apellido], [pac_Telefono], [pac_Estado])
    VALUES (5, N'1756789012', N'Luis', N'Torres', N'0955678901', 1)

SET IDENTITY_INSERT [dbo].[Paciente] OFF
GO

-- =====================
-- Datos de ejemplo: Citas
-- =====================
SET IDENTITY_INSERT [dbo].[Cita] ON

IF NOT EXISTS (SELECT 1 FROM [dbo].[Cita] WHERE cit_IdCita = 1)
    INSERT [dbo].[Cita] ([cit_IdCita], [cit_Fecha], [cit_Hora], [cit_Motivo], [cit_Tratamiento], [cit_Estado], [cit_IdPaciente], [cit_IdMedico])
    VALUES (1, '2026-08-25', '09:00:00', N'Chequeo general', N'Medicina general', 1, 1, 1)

IF NOT EXISTS (SELECT 1 FROM [dbo].[Cita] WHERE cit_IdCita = 2)
    INSERT [dbo].[Cita] ([cit_IdCita], [cit_Fecha], [cit_Hora], [cit_Motivo], [cit_Tratamiento], [cit_Estado], [cit_IdPaciente], [cit_IdMedico])
    VALUES (2, '2026-08-25', '10:30:00', N'Dolor muela', N'Odontología', 1, 2, 2)

IF NOT EXISTS (SELECT 1 FROM [dbo].[Cita] WHERE cit_IdCita = 3)
    INSERT [dbo].[Cita] ([cit_IdCita], [cit_Fecha], [cit_Hora], [cit_Motivo], [cit_Tratamiento], [cit_Estado], [cit_IdPaciente], [cit_IdMedico])
    VALUES (3, '2026-08-26', '11:00:00', N'Control presión', N'Cardiología', 1, 3, 3)

IF NOT EXISTS (SELECT 1 FROM [dbo].[Cita] WHERE cit_IdCita = 4)
    INSERT [dbo].[Cita] ([cit_IdCita], [cit_Fecha], [cit_Hora], [cit_Motivo], [cit_Tratamiento], [cit_Estado], [cit_IdPaciente], [cit_IdMedico])
    VALUES (4, '2026-08-26', '14:00:00', N'Revisión vista', N'Oftalmología', 1, 4, 4)

IF NOT EXISTS (SELECT 1 FROM [dbo].[Cita] WHERE cit_IdCita = 5)
    INSERT [dbo].[Cita] ([cit_IdCita], [cit_Fecha], [cit_Hora], [cit_Motivo], [cit_Tratamiento], [cit_Estado], [cit_IdPaciente], [cit_IdMedico])
    VALUES (5, '2026-08-27', '15:30:00', N'Dolor muscular', N'Fisioterapia', 1, 5, 5)

SET IDENTITY_INSERT [dbo].[Cita] OFF
GO

PRINT '>>> Script TratamientoSOAP ejecutado correctamente.'
PRINT '>>> Tablas creadas: Paciente, Cita'
PRINT '>>> Datos de ejemplo insertados.'
GO
