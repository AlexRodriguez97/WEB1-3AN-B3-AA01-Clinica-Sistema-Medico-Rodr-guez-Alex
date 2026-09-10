import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TratamientoService } from '../services/tratamiento.service';
import { MedicoService } from '../services/medico.service';
import { Cita, Paciente } from '../models/paciente.model';
import { Medico } from '../models/medico.model';

@Component({
  selector: 'app-citas',
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class CitasComponent implements OnInit {
  citas = signal<Cita[]>([]);
  pacientes = signal<Paciente[]>([]);
  medicos = signal<Medico[]>([]);
  citasFiltradas = signal<Cita[]>([]);
  cargando = signal(true);
  error = signal('');
  mensaje = signal('');
  busqueda = '';

  // Modal de formulario
  mostrarModal = signal(false);
  editando = signal(false);
  guardando = signal(false);

  // Datos del formulario
  citaForm: Cita = this.nuevaCita();

  constructor(
    private tratamientoService: TratamientoService,
    private medicoService: MedicoService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  // Crear objeto cita vacío
  nuevaCita(): Cita {
    return {
      idCita: 0,
      fecha: '',
      hora: '',
      motivo: '',
      descTratamiento: '',
      estado: 1,
      idPaciente: 0,
      idMedico: 0
    };
  }

  // Cargar citas, pacientes y médicos
  cargarDatos(): void {
    this.cargando.set(true);
    this.error.set('');

    this.tratamientoService.obtenerCitas().subscribe({
      next: (citas) => {
        this.citas.set(citas);
        this.citasFiltradas.set(citas);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las citas. Verifique que TratamientoSOAP esté ejecutándose en localhost:5087');
        this.cargando.set(false);
      }
    });

    this.tratamientoService.obtenerPacientes().subscribe({
      next: (pacientes) => this.pacientes.set(pacientes),
      error: () => {}
    });

    this.medicoService.obtenerMedicos().subscribe({
      next: (medicos) => this.medicos.set(medicos),
      error: () => {}
    });
  }

  // Buscar citas
  buscar(): void {
    const term = this.busqueda.toLowerCase().trim();
    if (!term) {
      this.citasFiltradas.set(this.citas());
      return;
    }
    this.citasFiltradas.set(
      this.citas().filter(c =>
        c.motivo?.toLowerCase().includes(term) ||
        c.descTratamiento?.toLowerCase().includes(term) ||
        this.getNombrePaciente(c.idPaciente).toLowerCase().includes(term) ||
        this.getNombreMedico(c.idMedico).toLowerCase().includes(term)
      )
    );
  }

  // Abrir modal para crear nueva cita
  abrirCrear(): void {
    this.citaForm = this.nuevaCita();
    this.editando.set(false);
    this.mostrarModal.set(true);
  }

  // Abrir modal para editar cita existente
  abrirEditar(cita: Cita): void {
    this.citaForm = {
      idCita: cita.idCita,
      fecha: this.formatFechaInput(cita.fecha),
      hora: this.formatHoraInput(cita.hora),
      motivo: cita.motivo,
      descTratamiento: cita.descTratamiento,
      estado: cita.estado,
      idPaciente: cita.idPaciente,
      idMedico: cita.idMedico ?? 0
    };
    this.editando.set(true);
    this.mostrarModal.set(true);
  }

  // Cerrar modal
  cerrarModal(): void {
    this.mostrarModal.set(false);
  }

  // Guardar cita (crear o actualizar)
  guardarCita(): void {
    // Validaciones básicas
    if (!this.citaForm.idPaciente || this.citaForm.idPaciente === 0) {
      this.mensaje.set('Seleccione un paciente');
      return;
    }
    if (!this.citaForm.fecha) {
      this.mensaje.set('Ingrese la fecha de la cita');
      return;
    }
    if (!this.citaForm.hora) {
      this.mensaje.set('Ingrese la hora de la cita');
      return;
    }
    if (!this.citaForm.motivo) {
      this.mensaje.set('Ingrese el motivo de la cita');
      return;
    }

    this.guardando.set(true);
    this.mensaje.set('');

    // Preparar datos para enviar
    const citaEnviar: any = {
      idCita: this.citaForm.idCita,
      fecha: this.citaForm.fecha,
      hora: this.citaForm.hora + ':00',
      motivo: this.citaForm.motivo,
      descTratamiento: this.citaForm.descTratamiento,
      estado: this.citaForm.estado,
      idPaciente: Number(this.citaForm.idPaciente),
      idMedico: this.citaForm.idMedico ? Number(this.citaForm.idMedico) : null
    };

    if (this.editando()) {
      // Actualizar cita existente
      this.tratamientoService.actualizarCita(citaEnviar).subscribe({
        next: () => {
          this.mensaje.set('Cita actualizada correctamente');
          this.guardando.set(false);
          this.cerrarModal();
          this.cargarDatos();
        },
        error: () => {
          this.mensaje.set('Error al actualizar la cita');
          this.guardando.set(false);
        }
      });
    } else {
      // Crear nueva cita
      this.tratamientoService.agregarCita(citaEnviar).subscribe({
        next: () => {
          this.mensaje.set('Cita creada exitosamente');
          this.guardando.set(false);
          this.cerrarModal();
          this.cargarDatos();
        },
        error: () => {
          this.mensaje.set('Error al crear la cita');
          this.guardando.set(false);
        }
      });
    }
  }

  // Eliminar cita
  eliminarCita(cita: Cita): void {
    if (!confirm(`¿Está seguro de eliminar la cita #${cita.idCita}?`)) {
      return;
    }

    this.tratamientoService.eliminarCita(cita.idCita).subscribe({
      next: () => {
        this.mensaje.set('Cita eliminada correctamente');
        this.cargarDatos();
      },
      error: () => {
        this.mensaje.set('Error al eliminar la cita');
      }
    });
  }

  // Obtener nombre del paciente por ID
  getNombrePaciente(idPaciente: number): string {
    const p = this.pacientes().find(p => p.idPaciente === idPaciente);
    return p ? `${p.nombre} ${p.apellido}` : `Paciente #${idPaciente}`;
  }

  // Obtener nombre del médico por ID
  getNombreMedico(idMedico?: number | null): string {
    if (!idMedico) return 'Sin asignar';
    const m = this.medicos().find(m => m.idMedico === idMedico);
    return m ? `Dr. ${m.nombre} ${m.apellido}` : `Médico #${idMedico}`;
  }

  // Badges de estado
  getEstadoBadge(estado: number): string {
    switch(estado) {
      case 1: return 'badge-active';
      case 0: return 'badge-inactive';
      default: return 'badge-pending';
    }
  }

  getEstadoLabel(estado: number): string {
    switch(estado) {
      case 1: return 'Activa';
      case 0: return 'Inactiva';
      default: return 'Pendiente';
    }
  }

  // Formatear fecha para mostrar
  formatFecha(fecha: string): string {
    if (!fecha) return '--';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  // Formatear hora para mostrar
  formatHora(hora: string): string {
    if (!hora) return '--';
    return hora.substring(0, 5);
  }

  // Formatear fecha para input type="date"
  formatFechaInput(fecha: string): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toISOString().split('T')[0];
  }

  // Formatear hora para input type="time"
  formatHoraInput(hora: string): string {
    if (!hora) return '';
    return hora.substring(0, 5);
  }
}
