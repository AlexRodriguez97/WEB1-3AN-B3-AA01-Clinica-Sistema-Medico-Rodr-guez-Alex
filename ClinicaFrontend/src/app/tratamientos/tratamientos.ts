import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TratamientoService } from '../services/tratamiento.service';
import { MedicoService } from '../services/medico.service';
import { Cita, Paciente } from '../models/paciente.model';
import { Medico } from '../models/medico.model';

@Component({
  selector: 'app-tratamientos',
  imports: [CommonModule, FormsModule],
  templateUrl: './tratamientos.html',
  styleUrl: './tratamientos.css'
})
export class TratamientosComponent implements OnInit {
  citas = signal<Cita[]>([]);
  pacientes = signal<Paciente[]>([]);
  medicos = signal<Medico[]>([]);
  citasFiltradas = signal<Cita[]>([]);
  cargando = signal(true);
  error = signal('');
  busqueda = '';

  constructor(
    private tratamientoService: TratamientoService,
    private medicoService: MedicoService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);
    this.error.set('');

    // Cargar citas
    this.tratamientoService.obtenerCitas().subscribe({
      next: (citas) => {
        this.citas.set(citas);
        this.citasFiltradas.set(citas);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('No se pudieron cargar las citas. Verifique que el servidor de Tratamiento esté ejecutándose en localhost:5087');
        this.cargando.set(false);
      }
    });

    // Cargar pacientes para mostrar nombres
    this.tratamientoService.obtenerPacientes().subscribe({
      next: (pacientes) => this.pacientes.set(pacientes),
      error: () => {}
    });

    // Cargar médicos
    this.medicoService.obtenerMedicos().subscribe({
      next: (medicos) => this.medicos.set(medicos),
      error: () => {}
    });
  }

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
        c.idCita?.toString().includes(term)
      )
    );
  }

  getNombrePaciente(idPaciente: number): string {
    const p = this.pacientes().find(p => p.idPaciente === idPaciente);
    return p ? `${p.nombre} ${p.apellido}` : `Paciente #${idPaciente}`;
  }

  getNombreMedico(idMedico?: number | null): string {
    if (!idMedico) return 'Sin asignar';
    const m = this.medicos().find(m => m.idMedico === idMedico);
    return m ? `Dr. ${m.nombre} ${m.apellido}` : `Médico #${idMedico}`;
  }

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

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  formatHora(hora: string): string {
    if (!hora) return '--';
    return hora.substring(0, 5);
  }
}
