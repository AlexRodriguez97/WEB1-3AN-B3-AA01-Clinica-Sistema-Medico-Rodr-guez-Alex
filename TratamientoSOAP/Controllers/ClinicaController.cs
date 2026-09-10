using Microsoft.AspNetCore.Mvc;
using Tratamiento.Models;
using Tratamiento.Services;

namespace Tratamiento.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClinicaController : ControllerBase
    {
        private readonly IClinicaService _service;

        public ClinicaController(IClinicaService service)
        {
            _service = service;
        }

        // GET: api/clinica/citas
        [HttpGet("citas")]
        public ActionResult<List<Cita>> ObtenerCitas()
        {
            try
            {
                var citas = _service.ObtenerCitas();
                return Ok(citas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al obtener citas", error = ex.Message });
            }
        }

        // GET: api/clinica/citas/{id}
        [HttpGet("citas/{id}")]
        public ActionResult<Cita> ObtenerCita(int id)
        {
            try
            {
                var cita = _service.ObtenerCita(id);
                if (cita == null)
                    return NotFound(new { mensaje = "Cita no encontrada" });
                return Ok(cita);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al obtener cita", error = ex.Message });
            }
        }

        // GET: api/clinica/pacientes
        [HttpGet("pacientes")]
        public ActionResult<List<Paciente>> ObtenerPacientes()
        {
            try
            {
                var pacientes = _service.ObtenerPacientes();
                return Ok(pacientes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al obtener pacientes", error = ex.Message });
            }
        }

        // GET: api/clinica/pacientes/{cedula}/citas
        [HttpGet("pacientes/{cedula}/citas")]
        public ActionResult<Paciente> ObtenerPacienteConCitas(string cedula)
        {
            try
            {
                var paciente = _service.ObtenerPacienteConCitas(cedula);
                if (paciente == null)
                    return NotFound(new { mensaje = "Paciente no encontrado" });
                return Ok(paciente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al obtener paciente", error = ex.Message });
            }
        }

        // GET: api/clinica/citas/tratamiento/{tratamiento}
        [HttpGet("citas/tratamiento/{tratamiento}")]
        public ActionResult<List<Cita>> ObtenerCitasPorTratamiento(string tratamiento)
        {
            try
            {
                var citas = _service.ObtenerCitaPorTratamiento(tratamiento);
                return Ok(citas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al filtrar citas", error = ex.Message });
            }
        }

        // POST: api/clinica/citas
        [HttpPost("citas")]
        public ActionResult AgregarCita([FromBody] Cita cita)
        {
            try
            {
                var resultado = _service.AgregarCita(cita);
                if (resultado)
                    return Ok(new { mensaje = "Cita creada exitosamente" });
                return BadRequest(new { mensaje = "No se pudo crear la cita" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al agregar cita", error = ex.Message });
            }
        }

        // PUT: api/clinica/citas
        [HttpPut("citas")]
        public ActionResult ActualizarCita([FromBody] Cita cita)
        {
            try
            {
                var resultado = _service.ActualizarCita(cita);
                if (resultado)
                    return Ok(new { mensaje = "Cita actualizada correctamente" });
                return BadRequest(new { mensaje = "No se pudo actualizar la cita" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al actualizar cita", error = ex.Message });
            }
        }

        // DELETE: api/clinica/citas/{id}
        [HttpDelete("citas/{id}")]
        public ActionResult EliminarCita(int id)
        {
            try
            {
                var resultado = _service.EliminarCita(id);
                if (resultado)
                    return Ok(new { mensaje = "Cita eliminada correctamente" });
                return NotFound(new { mensaje = "Cita no encontrada o no se pudo eliminar" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al eliminar cita", error = ex.Message });
            }
        }
    }
}
