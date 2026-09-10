using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace MedicoAPI.Models_Rest
{
    [Table("Medico")]
    public class Medico
    {
        [Key]
        [Column("med_IdMedico")]
        public int IdMedico { get; set; }

        [Column("med_Cedula")]
        public string Cedula { get; set; } = string.Empty;

        [Column("med_Nombre")]
        public string Nombre { get; set; } = string.Empty;

        [Column("med_Apellido")]
        public string Apellido { get; set; } = string.Empty;

        [Column("med_Cargo")]
        public string Cargo { get; set; } = string.Empty;

        [Column("med_Especialidad")]
        public string Especialidad { get; set; } = string.Empty;

        [Column("med_Estado")]
        public int Estado { get; set; }

        [JsonIgnore]
        public List<Cita> Citas { get; set; } = new List<Cita>();
    }
}
