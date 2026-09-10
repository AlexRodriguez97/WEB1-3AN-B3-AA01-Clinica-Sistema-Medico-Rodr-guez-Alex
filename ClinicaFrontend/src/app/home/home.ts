import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MedicoService } from '../services/medico.service';
import { TratamientoService } from '../services/tratamiento.service';
import { ClimaService } from '../services/clima.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  totalMedicos = signal(0);
  totalCitas = signal(0);
  totalPacientes = signal(0);
  citasActivas = signal(0);
  climaTemp = signal<number | null>(null);
  climaDescripcion = signal('Cargando...');
  climaIcono = signal('cloud');
  fechaActual = signal('');

  constructor(
    private medicoService: MedicoService,
    private tratamientoService: TratamientoService,
    private climaService: ClimaService
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.fechaActual.set(now.toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }));

    this.medicoService.obtenerMedicos().subscribe({
      next: (medicos) => {
        this.totalMedicos.set(medicos.length);
      },
      error: () => this.totalMedicos.set(0)
    });

    this.tratamientoService.obtenerCitas().subscribe({
      next: (citas) => {
        this.totalCitas.set(citas.length);
        this.citasActivas.set(citas.filter(c => c.estado === 1).length);
      },
      error: () => this.totalCitas.set(0)
    });

    this.tratamientoService.obtenerPacientes().subscribe({
      next: (pacientes) => this.totalPacientes.set(pacientes.length),
      error: () => this.totalPacientes.set(0)
    });

    this.climaService.obtenerClima().subscribe({
      next: (clima) => {
        this.climaTemp.set(Math.round(clima.current.temperature_2m));
        this.climaDescripcion.set(this.climaService.getWeatherDescription(clima.current.weather_code));
        this.climaIcono.set(this.climaService.getWeatherIcon(clima.current.weather_code, clima.current.is_day));
      },
      error: () => {
        this.climaDescripcion.set('No disponible');
        this.climaIcono.set('cloud_off');
      }
    });
  }
}
