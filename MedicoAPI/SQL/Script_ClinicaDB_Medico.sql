-- ============================================================
-- Script: ClinicaDB - Tabla Medico + FK en Cita
-- Proyecto: MedicoAPI (API REST)
-- Base de Datos: ClinicaDB (SQL Server)
-- Autor: Alex Rodriguez
-- Descripción: Agrega la tabla Medico a la base de datos
--              ClinicaDB, crea la FK entre Cita y Medico,
--              e inserta datos de ejemplo.
-- NOTA: Ejecutar DESPUÉS del script de TratamientoSOAP.
-- ============================================================

USE [ClinicaDB]
GO

-- =====================
-- Tabla: Medico
-- =====================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Medico')
BEGIN
    CREATE TABLE [dbo].[Medico](
        [med_IdMedico] [int] IDENTITY(1,1) NOT NULL,
        [med_Cedula] [varchar](10) NOT NULL,
        [med_Nombre] [varchar](50) NOT NULL,
        [med_Apellido] [varchar](50) NOT NULL,
        [med_Cargo] [varchar](50) NOT NULL,
        [med_Especialidad] [varchar](50) NOT NULL,
        [med_Estado] [int] NOT NULL,
        PRIMARY KEY CLUSTERED ([med_IdMedico] ASC)
    )
END
GO

-- =====================
-- Agregar columna FK cit_IdMedico a Cita (si no existe)
-- =====================
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Cita') AND name = 'cit_IdMedico')
BEGIN
    ALTER TABLE [dbo].[Cita]
    ADD [cit_IdMedico] [int] NULL
END
GO

-- =====================
-- FK: Cita -> Medico
-- =====================
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Cita_Medico')
BEGIN
    ALTER TABLE [dbo].[Cita] WITH CHECK
    ADD CONSTRAINT [FK_Cita_Medico] FOREIGN KEY([cit_IdMedico])
    REFERENCES [dbo].[Medico] ([med_IdMedico])
END
GO

-- =====================
-- Datos de ejemplo: Médicos
-- =====================
SET IDENTITY_INSERT [dbo].[Medico] ON

IF NOT EXISTS (SELECT 1 FROM [dbo].[Medico] WHERE med_IdMedico = 1)
    INSERT [dbo].[Medico] ([med_IdMedico], [med_Cedula], [med_Nombre], [med_Apellido], [med_Cargo], [med_Especialidad], [med_Estado])
    VALUES (1, N'1712340001', N'Roberto', N'Salazar', N'Médico Titular', N'Medicina General', 1)

IF NOT EXISTS (SELECT 1 FROM [dbo].[Medico] WHERE med_IdMedico = 2)
    INSERT [dbo].[Medico] ([med_IdMedico], [med_Cedula], [med_Nombre], [med_Apellido], [med_Cargo], [med_Especialidad], [med_Estado])
    VALUES (2, N'1712340002', N'Patricia', N'Mendoza', N'Médico Especialista', N'Odontología', 1)

IF NOT EXISTS (SELECT 1 FROM [dbo].[Medico] WHERE med_IdMedico = 3)
    INSERT [dbo].[Medico] ([med_IdMedico], [med_Cedula], [med_Nombre], [med_Apellido], [med_Cargo], [med_Especialidad], [med_Estado])
    VALUES (3, N'1712340003', N'Fernando', N'Castillo', N'Médico Especialista', N'Cardiología', 1)

IF NOT EXISTS (SELECT 1 FROM [dbo].[Medico] WHERE med_IdMedico = 4)
    INSERT [dbo].[Medico] ([med_IdMedico], [med_Cedula], [med_Nombre], [med_Apellido], [med_Cargo], [med_Especialidad], [med_Estado])
    VALUES (4, N'1712340004', N'Lucía', N'Herrera', N'Médico Especialista', N'Oftalmología', 1)

IF NOT EXISTS (SELECT 1 FROM [dbo].[Medico] WHERE med_IdMedico = 5)
    INSERT [dbo].[Medico] ([med_IdMedico], [med_Cedula], [med_Nombre], [med_Apellido], [med_Cargo], [med_Especialidad], [med_Estado])
    VALUES (5, N'1712340005', N'Andrés', N'Vargas', N'Fisioterapeuta', N'Fisioterapia', 1)

SET IDENTITY_INSERT [dbo].[Medico] OFF
GO

-- =====================
-- Asignar médicos a citas existentes
-- =====================
UPDATE [dbo].[Cita] SET [cit_IdMedico] = 1 WHERE [cit_IdCita] = 1 AND [cit_IdMedico] IS NULL
UPDATE [dbo].[Cita] SET [cit_IdMedico] = 2 WHERE [cit_IdCita] = 2 AND [cit_IdMedico] IS NULL
UPDATE [dbo].[Cita] SET [cit_IdMedico] = 3 WHERE [cit_IdCita] = 3 AND [cit_IdMedico] IS NULL
UPDATE [dbo].[Cita] SET [cit_IdMedico] = 4 WHERE [cit_IdCita] = 4 AND [cit_IdMedico] IS NULL
UPDATE [dbo].[Cita] SET [cit_IdMedico] = 5 WHERE [cit_IdCita] = 5 AND [cit_IdMedico] IS NULL
GO

PRINT '>>> Script MedicoAPI ejecutado correctamente.'
PRINT '>>> Tabla creada: Medico'
PRINT '>>> FK agregada: Cita -> Medico'
PRINT '>>> Datos de ejemplo insertados.'
GO
