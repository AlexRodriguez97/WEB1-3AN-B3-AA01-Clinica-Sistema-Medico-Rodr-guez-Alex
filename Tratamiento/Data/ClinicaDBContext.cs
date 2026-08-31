using Microsoft.EntityFrameworkCore;
using Tratamiento.Models;

namespace ClinicaDBContext.Data
{
    public class PacienteDBContext : DbContext
    {
        public PacienteDBContext(DbContextOptions<PacienteDBContext> options)
            : base(options)
        {
        }

        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<Cita> Citas { get; set; }
    }

}
