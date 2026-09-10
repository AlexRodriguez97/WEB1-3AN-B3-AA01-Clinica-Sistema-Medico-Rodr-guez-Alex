using CoreWCF;
using Tratamiento.Models;

namespace Tratamiento.Services
{
    [ServiceContract] 
    public interface IClinicaService
    {
        [OperationContract]
        List<Paciente> ObtenerPacientes();

        [OperationContract]
        List<Cita> ObtenerCitas();

        [OperationContract]
        Cita? ObtenerCita(int id);

        [OperationContract]
        bool AgregarCita(Cita cita);

        [OperationContract]
        bool ActualizarCita(Cita cita);

        [OperationContract]
        bool EliminarCita(int id);

        [OperationContract]
        List<Cita> ObtenerCitaPorTratamiento(string tratamiento);

        [OperationContract]
        List<Cita> ObtenerCitaPorCedula(string cedula);

        [OperationContract]
        Paciente? ObtenerPacienteConCitas(string cedula);
    }
}