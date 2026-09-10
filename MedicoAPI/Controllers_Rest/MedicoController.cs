using MedicoAPI.Data_Rest;
using MedicoAPI.Models_Rest;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MedicoAPI.Controllers_Rest
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicoController : ControllerBase
    {
        private readonly MedicoDBContext _context;

        public MedicoController(MedicoDBContext context)
        {
            _context = context;
        }

        // GET: api/medico
        [HttpGet]
        public async Task<ActionResult<List<Medico>>> ObtenerMedicos()
        {
            var medicos = await _context.Medicos.ToListAsync();
            return Ok(medicos);
        }

        // GET: api/medico/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Medico>> ObtenerMedico(int id)
        {
            var medico = await _context.Medicos.FindAsync(id);

            if (medico == null)
                return NotFound(new { mensaje = "Médico no encontrado" });

            return Ok(medico);
        }

        // GET: api/medico/5/citas
        [HttpGet("{id}/citas")]
        public async Task<ActionResult<Medico>> ObtenerMedicoConCitas(int id)
        {
            var medico = await _context.Medicos
                .Include(m => m.Citas)
                .FirstOrDefaultAsync(m => m.IdMedico == id);

            if (medico == null)
                return NotFound(new { mensaje = "Médico no encontrado" });

            
            var resultado = new
            {
                medico.IdMedico,
                medico.Cedula,
                medico.Nombre,
                medico.Apellido,
                medico.Cargo,
                medico.Especialidad,
                medico.Estado,
                Citas = medico.Citas.Select(c => new
                {
                    c.IdCita,
                    c.Fecha,
                    c.Hora,
                    c.Motivo,
                    c.DescTratamiento,
                    c.Estado,
                    c.IdPaciente
                })
            };

            return Ok(resultado);
        }

        // GET: api/medico/cedula/1712340001
        [HttpGet("cedula/{cedula}")]
        public async Task<ActionResult<Medico>> ObtenerMedicoPorCedula(string cedula)
        {
            var medico = await _context.Medicos
                .FirstOrDefaultAsync(m => m.Cedula == cedula);

            if (medico == null)
                return NotFound(new { mensaje = "Médico no encontrado con esa cédula" });

            return Ok(medico);
        }

        // POST: api/medico
        [HttpPost]
        public async Task<ActionResult<Medico>> CrearMedico(Medico medico)
        {
            try
            {
                _context.Medicos.Add(medico);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(ObtenerMedico), new { id = medico.IdMedico }, medico);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al crear médico", error = ex.InnerException?.Message ?? ex.Message });
            }
        }

        // PUT: api/medico/5
        [HttpPut("{id}")]
        public async Task<ActionResult> ActualizarMedico(int id, Medico medico)
        {
            if (id != medico.IdMedico)
                return BadRequest(new { mensaje = "El ID no coincide" });

            var medicoExistente = await _context.Medicos.FindAsync(id);
            if (medicoExistente == null)
                return NotFound(new { mensaje = "Médico no encontrado" });

            medicoExistente.Cedula = medico.Cedula;
            medicoExistente.Nombre = medico.Nombre;
            medicoExistente.Apellido = medico.Apellido;
            medicoExistente.Cargo = medico.Cargo;
            medicoExistente.Especialidad = medico.Especialidad;
            medicoExistente.Estado = medico.Estado;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Médico actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al actualizar", error = ex.InnerException?.Message ?? ex.Message });
            }
        }

        // DELETE: api/medico/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> EliminarMedico(int id)
        {
            var medico = await _context.Medicos.FindAsync(id);
            if (medico == null)
                return NotFound(new { mensaje = "Médico no encontrado" });

            try
            {
                _context.Medicos.Remove(medico);
                await _context.SaveChangesAsync();
                return Ok(new { mensaje = "Médico eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = "Error al eliminar", error = ex.InnerException?.Message ?? ex.Message });
            }
        }
    }
}
