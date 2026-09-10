export interface Medico {
  idMedico: number;
  cedula: string;
  nombre: string;
  apellido: string;
  cargo: string;
  especialidad: string;
  estado: number;
}

export interface CitaMedico {
  idCita: number;
  fecha: string;
  hora: string;
  motivo: string;
  descTratamiento: string;
  estado: number;
  idPaciente: number;
}

export interface MedicoConCitas extends Medico {
  citas: CitaMedico[];
}
