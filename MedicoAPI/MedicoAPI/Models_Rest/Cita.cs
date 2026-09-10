using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MedicoAPI.Models_Rest
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

        [Column("cit_IdMedico")]
        public int? IdMedico { get; set; }

        [ForeignKey("IdMedico")]
        [JsonIgnore]
        public Medico? Medico { get; set; }
    }
}
