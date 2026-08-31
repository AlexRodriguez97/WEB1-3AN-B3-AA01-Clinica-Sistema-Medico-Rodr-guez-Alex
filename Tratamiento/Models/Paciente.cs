using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Tratamiento.Models 
{
    [Table("Paciente")]
    public class Paciente
    {
        [Key]
        [Column("pac_IdPaciente")]
        public int IdPaciente { get; set; }

        [Column("pac_Cedula")]
        public string Cedula { get; set; } = string.Empty;

        [Column("pac_Nombre")]
        public string Nombre { get; set; } = string.Empty;

        [Column("pac_Apellido")]
        public string Apellido { get; set; } = string.Empty;

        [Column("pac_Telefono")]
        public string Telefono { get; set; } = string.Empty;

        [Column("pac_Estado")]
        public int Estado { get; set; }

        public List<Cita> Citas { get; set; } = new List<Cita>();

        
    }
}