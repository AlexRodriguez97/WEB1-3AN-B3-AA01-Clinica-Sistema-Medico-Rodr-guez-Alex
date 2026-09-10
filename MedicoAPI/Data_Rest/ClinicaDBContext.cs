using Microsoft.EntityFrameworkCore;
using MedicoAPI.Models_Rest;

namespace MedicoAPI.Data_Rest
{
    public class MedicoDBContext : DbContext
    {
        public MedicoDBContext(DbContextOptions<MedicoDBContext> options)
            : base(options)
        {
        }

        public DbSet<Medico> Medicos { get; set; }
        public DbSet<Cita> Citas { get; set; }
    }
}
