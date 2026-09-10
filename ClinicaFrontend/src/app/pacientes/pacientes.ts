import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TratamientoService } from '../services/tratamiento.service';
import { Paciente } from '../models/paciente.model';

@Component({
  selector: 'app-pacientes',
  imports: [CommonModule, FormsModule],
  templateUrl: './pacientes.html',
  styleUrl: './pacientes.css'
})
export class PacientesComponent implements OnInit {
  pacientes = signal<Paciente[]>([]);
  pacientesFiltrados = signal<Paciente[]>([]);
  cargando = signal(true);
  error = signal('');
  busqueda = '';

  constructor(private tratamientoService: TratamientoService) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  // Cargar todos los pacientes desde la API SOAP
  cargarPacientes(): void {
    this.cargando.set(true);
    this.error.set('');

    this.tratamientoService.obtenerPacientes().subscribe({
      next: (pacientes) => {
        this.pacientes.set(pacientes);
        this.pacientesFiltrados.set(pacientes);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los pacientes. Verifique que TratamientoSOAP esté ejecutándose en localhost:5087');
        this.cargando.set(false);
      }
    });
  }

  // Filtrar pacientes por nombre, apellido o cédula
  filtrar(): void {
    const term = this.busqueda.toLowerCase().trim();
    if (!term) {
      this.pacientesFiltrados.set(this.pacientes());
      return;
    }
    this.pacientesFiltrados.set(
      this.pacientes().filter(p =>
        p.nombre?.toLowerCase().includes(term) ||
        p.apellido?.toLowerCase().includes(term) ||
        p.cedula?.includes(term) ||
        p.telefono?.includes(term)
      )
    );
  }

  // Obtener iniciales del paciente para el avatar
  getIniciales(paciente: Paciente): string {
    return `${paciente.nombre?.charAt(0) ?? ''}${paciente.apellido?.charAt(0) ?? ''}`.toUpperCase();
  }

  // Clase CSS según el estado
  getEstadoBadge(estado: number): string {
    return estado === 1 ? 'badge-active' : 'badge-inactive';
  }

  // Texto del estado
  getEstadoLabel(estado: number): string {
    return estado === 1 ? 'Activo' : 'Inactivo';
  }

  // Contar pacientes activos
  totalActivos(): number {
    return this.pacientes().filter(p => p.estado === 1).length;
  }
}
