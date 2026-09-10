import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClimaService } from '../services/clima.service';
import { ClimaResponse, Recomendacion } from '../models/clima.model';

@Component({
  selector: 'app-clima',
  imports: [CommonModule],
  templateUrl: './clima.html',
  styleUrl: './clima.css'
})
export class ClimaComponent implements OnInit {
  clima = signal<ClimaResponse | null>(null);
  recomendaciones = signal<Recomendacion[]>([]);
  cargando = signal(true);
  error = signal('');
  ultimaActualizacion = signal('');

  constructor(private climaService: ClimaService) {}

  ngOnInit(): void {
    this.cargarClima();
  }

  cargarClima(): void {
    this.cargando.set(true);
    this.error.set('');

    this.climaService.obtenerClima().subscribe({
      next: (data) => {
        this.clima.set(data);
        this.recomendaciones.set(this.climaService.generarRecomendaciones(data));
        const now = new Date();
        this.ultimaActualizacion.set(
          now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        );
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo obtener información del clima. Verifique su conexión a internet.');
        this.cargando.set(false);
      }
    });
  }

  getWeatherIcon(code: number, isDay: number): string {
    return this.climaService.getWeatherIcon(code, isDay);
  }

  getWeatherDescription(code: number): string {
    return this.climaService.getWeatherDescription(code);
  }

  getUvClass(uvIndex: number): string {
    if (uvIndex >= 8) return 'uv-extreme';
    if (uvIndex >= 6) return 'uv-very-high';
    if (uvIndex >= 3) return 'uv-moderate';
    return 'uv-low';
  }

  getUvLabel(uvIndex: number): string {
    if (uvIndex >= 8) return 'Extremo';
    if (uvIndex >= 6) return 'Muy Alto';
    if (uvIndex >= 3) return 'Moderado';
    return 'Bajo';
  }

  getDailyTemp(index: number, type: 'max' | 'min'): number {
    const daily = this.clima()?.daily;
    if (!daily) return 0;
    return type === 'max' ? daily.temperature_2m_max[index] : daily.temperature_2m_min[index];
  }

  getDayLabel(index: number): string {
    const labels = ['Hoy', 'Mañana', 'Pasado'];
    return labels[index] ?? '';
  }

  getPrecipitacion(index: number): number {
    return this.clima()?.daily?.precipitation_sum[index] ?? 0;
  }
}
