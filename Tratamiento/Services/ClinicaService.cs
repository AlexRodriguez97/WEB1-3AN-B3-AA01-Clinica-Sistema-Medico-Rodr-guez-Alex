using ClinicaDBContext.Data;
using Microsoft.EntityFrameworkCore;
using Tratamiento.Models;


namespace Tratamiento.Services
{
    
    public class ClinicaService : IClinicaService
    {
        private readonly PacienteDBContext _context;

        public ClinicaService(PacienteDBContext context)
        {
            _context = context;
        }

        public List<Paciente> ObtenerPacientes()
        {
            return _context.Pacientes.ToList(); 
        }

        public List<Cita> ObtenerCitas()
        {
            return _context.Citas.ToList(); 
        }

        public Cita? ObtenerCita(int id)
        {
            
            return _context.Citas.FirstOrDefault(c => c.IdCita == id);
        }

        public bool AgregarCita(Cita cita)
        {
            try
            {
                _context.Citas.Add(cita); 
                _context.SaveChanges();   
                return true;
            }
            catch (Exception ex)
            {
                
                var errorReal = ex.InnerException?.Message ?? ex.Message;
                return false;
            }
        }

        public bool ActualizarCita(Cita cita)
        {
            try
            {
                _context.Citas.Update(cita); 
                _context.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool EliminarCita(int id)
        {
            try
            {
                var cita = _context.Citas.FirstOrDefault(c => c.IdCita == id);
                if (cita != null)
                {
                    _context.Citas.Remove(cita); 
                    _context.SaveChanges();
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public List<Cita> ObtenerCitaPorTratamiento(string tratamiento)
        {
            
            return _context.Citas
                .Where(c => c.DescTratamiento.Contains(tratamiento))
                .ToList();
        }

        public List<Cita> ObtenerCitaPorCedula(string cedula)
        {
            
            var paciente = _context.Pacientes.FirstOrDefault(p => p.Cedula == cedula);

            if (paciente == null) return new List<Cita>(); 

        
            return _context.Citas
                .Where(c => c.IdPaciente == paciente.IdPaciente)
                .ToList();
        }
        public Paciente ObtenerPacienteConCitas(string cedula)
        {            
            return _context.Pacientes
                .Include(p => p.Citas)
                .FirstOrDefault(p => p.Cedula == cedula);
        }
    }
}