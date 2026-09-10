using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;


namespace Tratamiento.Models
{
    [Table("Cita")]
    public class Cita
    {
        [Key]
        [Column("cit_IdCita")]
        public int IdCita { get; set; }

        [Column("cit_Fecha")]
        public DateTime Fecha { get; set; }

        [Column("cit_Hora")]
        public TimeSpan Hora { get; set; } 

        [Column("cit_Motivo")]
        public string Motivo { get; set; } = string.Empty;

        [Column("cit_Tratamiento")]
        public string DescTratamiento { get; set; } = string.Empty; 

        [Column("cit_Estado")]
        public int Estado { get; set; }

        [Column("cit_IdPaciente")]
        public int IdPaciente { get; set; }

        [ForeignKey("IdPaciente")]
        [IgnoreDataMember]
        public Paciente? Paciente { get; set; }

        [Column("cit_IdMedico")]
        public int? IdMedico { get; set; }
        
    }
}