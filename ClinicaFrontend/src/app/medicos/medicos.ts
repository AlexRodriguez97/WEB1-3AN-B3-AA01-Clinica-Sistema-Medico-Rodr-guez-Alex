import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicoService } from '../services/medico.service';
import { Medico, MedicoConCitas } from '../models/medico.model';

@Component({
  selector: 'app-medicos',
  imports: [CommonModule, FormsModule],
  templateUrl: './medicos.html',
  styleUrl: './medicos.css'
})
export class MedicosComponent implements OnInit {
  medicos = signal<Medico[]>([]);
  medicosFiltrados = signal<Medico[]>([]);
  cargando = signal(true);
  error = signal('');
  mensajeExito = signal('');

  // Filtros
  busqueda = '';
  filtroEspecialidad = '';
  especialidades = signal<string[]>([]);

  // Búsqueda directa por cédula (Endpoint: GET api/medico/cedula/{cedula})
  cedulaBusqueda = '';
  buscandoCedula = signal(false);

  // Modal Formulario (Crear / Editar: POST api/medico & PUT api/medico/{id})
  modalFormAbierto = signal(false);
  esModoEdicion = signal(false);
  guardando = signal(false);
  errorModal = signal('');
  medicoForm: Medico = this.nuevoMedicoVacio();

  // Modal Citas del Médico (Endpoint: GET api/medico/{id}/citas)
  modalCitasAbierto = signal(false);
  cargandoCitas = signal(false);
  medicoConCitas = signal<MedicoConCitas | null>(null);

  // Modal Detalle del Médico (Endpoint: GET api/medico/{id})
  modalDetalleAbierto = signal(false);
  cargandoDetalle = signal(false);
  medicoDetalle = signal<Medico | null>(null);

  // Modal Eliminar Médico (Endpoint: DELETE api/medico/{id})
  modalEliminarAbierto = signal(false);
  medicoAEliminar = signal<Medico | null>(null);
  eliminando = signal(false);

  // Especialidades predefinidas comunes
  listaEspecialidades: string[] = [
    'Medicina General',
    'Odontología',
    'Cardiología',
    'Oftalmología',
    'Pediatría',
    'Traumatología',
    'Fisioterapia',
    'Dermatología',
    'Neurología',
    'Ginecología'
  ];

  constructor(private medicoService: MedicoService) {}

  ngOnInit(): void {
    this.cargarMedicos();
  }

  nuevoMedicoVacio(): Medico {
    return {
      idMedico: 0,
      cedula: '',
      nombre: '',
      apellido: '',
      cargo: 'Médico Titular',
      especialidad: 'Medicina General',
      estado: 1
    };
  }

  // 1. GET: api/medico
  cargarMedicos(): void {
    this.cargando.set(true);
    this.error.set('');

    this.medicoService.obtenerMedicos().subscribe({
      next: (medicos) => {
        this.medicos.set(medicos);
        this.medicosFiltrados.set(medicos);
        const esp = [...new Set(medicos.map(m => m.especialidad).filter(Boolean))];
        this.especialidades.set(esp);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los médicos. Verifique que MedicoAPI esté ejecutándose en localhost:5204');
        this.cargando.set(false);
      }
    });
  }

  filtrar(): void {
    let resultado = this.medicos();
    const term = this.busqueda.toLowerCase().trim();

    if (term) {
      resultado = resultado.filter(m =>
        m.nombre?.toLowerCase().includes(term) ||
        m.apellido?.toLowerCase().includes(term) ||
        m.cedula?.includes(term) ||
        m.especialidad?.toLowerCase().includes(term) ||
        m.cargo?.toLowerCase().includes(term)
      );
    }

    if (this.filtroEspecialidad) {
      resultado = resultado.filter(m => m.especialidad === this.filtroEspecialidad);
    }

    this.medicosFiltrados.set(resultado);
  }

  // 2. GET: api/medico/cedula/{cedula}
  buscarPorCedulaDirecta(): void {
    const cedula = this.cedulaBusqueda.trim();
    if (!cedula) return;

    this.buscandoCedula.set(true);
    this.error.set('');
    this.mensajeExito.set('');

    this.medicoService.obtenerMedicoPorCedula(cedula).subscribe({
      next: (medico) => {
        this.buscandoCedula.set(false);
        this.medicoDetalle.set(medico);
        this.modalDetalleAbierto.set(true);
        this.mostrarExito(`Médico encontrado por cédula: Dr. ${medico.nombre} ${medico.apellido}`);
      },
      error: (err) => {
        this.buscandoCedula.set(false);
        const msg = err.error?.mensaje || `No se encontró ningún médico con la cédula "${cedula}"`;
        this.error.set(msg);
      }
    });
  }

  limpiarBusquedaCedula(): void {
    this.cedulaBusqueda = '';
    this.error.set('');
  }

  // 3. GET: api/medico/{id}
  abrirModalDetalle(id: number): void {
    this.cargandoDetalle.set(true);
    this.modalDetalleAbierto.set(true);
    this.medicoDetalle.set(null);

    this.medicoService.obtenerMedico(id).subscribe({
      next: (medico) => {
        this.medicoDetalle.set(medico);
        this.cargandoDetalle.set(false);
      },
      error: (err) => {
        this.cargandoDetalle.set(false);
        this.errorModal.set(err.error?.mensaje || 'Error al obtener detalle del médico');
      }
    });
  }

  cerrarModalDetalle(): void {
    this.modalDetalleAbierto.set(false);
    this.medicoDetalle.set(null);
  }

  // 4. GET: api/medico/{id}/citas
  abrirModalCitas(medico: Medico): void {
    this.cargandoCitas.set(true);
    this.modalCitasAbierto.set(true);
    this.medicoConCitas.set(null);

    this.medicoService.obtenerMedicoConCitas(medico.idMedico).subscribe({
      next: (data) => {
        this.medicoConCitas.set(data);
        this.cargandoCitas.set(false);
      },
      error: (err) => {
        this.cargandoCitas.set(false);
        this.mostrarExito('');
        this.error.set(err.error?.mensaje || 'Error al consultar las citas del médico');
      }
    });
  }

  cerrarModalCitas(): void {
    this.modalCitasAbierto.set(false);
    this.medicoConCitas.set(null);
  }

  // 5. POST: api/medico (Abrir Modal Crear)
  abrirModalCrear(): void {
    this.esModoEdicion.set(false);
    this.medicoForm = this.nuevoMedicoVacio();
    this.errorModal.set('');
    this.modalFormAbierto.set(true);
  }

  // 6. PUT: api/medico/{id} (Abrir Modal Editar)
  abrirModalEditar(medico: Medico): void {
    this.esModoEdicion.set(true);
    this.errorModal.set('');
    // Cargar los datos más actualizados desde el backend mediante GET api/medico/{id}
    this.medicoService.obtenerMedico(medico.idMedico).subscribe({
      next: (m) => {
        this.medicoForm = { ...m };
        this.modalFormAbierto.set(true);
      },
      error: () => {
        this.medicoForm = { ...medico };
        this.modalFormAbierto.set(true);
      }
    });
  }

  cerrarModalForm(): void {
    this.modalFormAbierto.set(false);
    this.errorModal.set('');
  }

  // Guardar (Crear o Actualizar)
  guardarMedico(): void {
    if (!this.medicoForm.cedula.trim() || !this.medicoForm.nombre.trim() || !this.medicoForm.apellido.trim()) {
      this.errorModal.set('Por favor complete la cédula, el nombre y el apellido');
      return;
    }

    this.guardando.set(true);
    this.errorModal.set('');

    if (this.esModoEdicion()) {
      // PUT: api/medico/{id}
      this.medicoService.actualizarMedico(this.medicoForm.idMedico, this.medicoForm).subscribe({
        next: () => {
          this.guardando.set(false);
          this.cerrarModalForm();
          this.mostrarExito(`Médico Dr. ${this.medicoForm.nombre} ${this.medicoForm.apellido} actualizado correctamente`);
          this.cargarMedicos();
        },
        error: (err) => {
          this.guardando.set(false);
          this.errorModal.set(err.error?.error || err.error?.mensaje || 'Error al actualizar médico');
        }
      });
    } else {
      // POST: api/medico
      this.medicoService.crearMedico(this.medicoForm).subscribe({
        next: (creado) => {
          this.guardando.set(false);
          this.cerrarModalForm();
          this.mostrarExito(`Médico Dr. ${creado.nombre} ${creado.apellido} creado exitosamente con ID ${creado.idMedico}`);
          this.cargarMedicos();
        },
        error: (err) => {
          this.guardando.set(false);
          this.errorModal.set(err.error?.error || err.error?.mensaje || 'Error al crear médico');
        }
      });
    }
  }

  // 7. DELETE: api/medico/{id}
  abrirModalEliminar(medico: Medico): void {
    this.medicoAEliminar.set(medico);
    this.modalEliminarAbierto.set(true);
  }

  cerrarModalEliminar(): void {
    this.modalEliminarAbierto.set(false);
    this.medicoAEliminar.set(null);
  }

  confirmarEliminar(): void {
    const med = this.medicoAEliminar();
    if (!med) return;

    this.eliminando.set(true);
    this.medicoService.eliminarMedico(med.idMedico).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.cerrarModalEliminar();
        this.mostrarExito(`Médico Dr. ${med.nombre} ${med.apellido} eliminado correctamente`);
        this.cargarMedicos();
      },
      error: (err) => {
        this.eliminando.set(false);
        this.cerrarModalEliminar();
        const msg = err.error?.error || err.error?.mensaje || 'Error al eliminar el médico. Es posible que tenga citas asociadas.';
        this.error.set(msg);
      }
    });
  }

  mostrarExito(msg: string): void {
    this.mensajeExito.set(msg);
    if (msg) {
      setTimeout(() => {
        if (this.mensajeExito() === msg) {
          this.mensajeExito.set('');
        }
      }, 5000);
    }
  }

  // Helpers UI
  getIniciales(medico: Medico): string {
    return `${medico.nombre?.charAt(0) ?? ''}${medico.apellido?.charAt(0) ?? ''}`.toUpperCase();
  }

  getEstadoBadge(estado: number): string {
    return estado === 1 ? 'badge-active' : 'badge-inactive';
  }

  getEstadoLabel(estado: number): string {
    return estado === 1 ? 'Activo' : 'Inactivo';
  }

  totalActivos(): number {
    return this.medicos().filter(m => m.estado === 1).length;
  }

  getEspecialidadColor(especialidad: string): string {
    const colors: {[key: string]: string} = {
      'Cardiología': 'var(--danger)',
      'Pediatría': 'var(--accent2)',
      'Neurología': 'var(--warning)',
      'Dermatología': 'var(--success)',
      'Traumatología': 'var(--accent)',
      'Odontología': 'var(--accent2)',
      'Oftalmología': 'var(--accent)',
      'Fisioterapia': 'var(--success)',
      'Ginecología': 'var(--accent2)'
    };
    return colors[especialidad] ?? 'var(--accent)';
  }
}
