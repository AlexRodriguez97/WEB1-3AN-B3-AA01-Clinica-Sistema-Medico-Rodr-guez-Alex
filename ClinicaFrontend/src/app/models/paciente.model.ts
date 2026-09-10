export interface Paciente {
  idPaciente: number;
  cedula: string;
  nombre: string;
  apellido: string;
  telefono: string;
  estado: number;
  citas?: Cita[];
}

export interface Cita {
  idCita: number;
  fecha: string;
  hora: string;
  motivo: string;
  descTratamiento: string;
  estado: number;
  idPaciente: number;
  idMedico?: number;
  paciente?: Paciente;
}
