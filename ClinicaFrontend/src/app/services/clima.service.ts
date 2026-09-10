import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ClimaResponse, Recomendacion } from '../models/clima.model';

@Injectable({
  providedIn: 'root'
})
export class ClimaService {
  // Open-Meteo: gratuita, sin API key, geolocalización Quito, Ecuador
  private readonly apiUrl = 'https://api.open-meteo.com/v1/forecast';
  private readonly lat = -0.2299; // Quito Ecuador
  private readonly lon = -78.5249;

  constructor(private http: HttpClient) {}

  obtenerClima(): Observable<ClimaResponse> {
    const params = new HttpParams()
      .set('latitude', this.lat)
      .set('longitude', this.lon)
      .set('current', 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,cloud_cover,is_day,uv_index')
      .set('daily', 'uv_index_max,precipitation_sum,temperature_2m_max,temperature_2m_min')
      .set('timezone', 'America/Guayaquil')
      .set('forecast_days', '3');

    return this.http.get<ClimaResponse>(this.apiUrl, { params });
  }

  generarRecomendaciones(clima: ClimaResponse): Recomendacion[] {
    const recomendaciones: Recomendacion[] = [];
    const current = clima.current;

    // Temperatura baja → Ropa abrigada
    if (current.temperature_2m < 14) {
      recomendaciones.push({
        icono: 'ac_unit',
        titulo: 'Temperatura baja',
        descripcion: `Hace ${current.temperature_2m}°C. Se recomienda salir bien abrigado con ropa de abrigo y bufanda.`,
        tipo: 'warning'
      });
    } else if (current.temperature_2m >= 25) {
      recomendaciones.push({
        icono: 'wb_sunny',
        titulo: 'Temperatura elevada',
        descripcion: `Temperatura de ${current.temperature_2m}°C. Manténgase hidratado y evite exposición prolongada al sol.`,
        tipo: 'warning'
      });
    } else {
      recomendaciones.push({
        icono: 'thermostat',
        titulo: 'Temperatura agradable',
        descripcion: `Temperatura de ${current.temperature_2m}°C. Condiciones climáticas favorables para salir.`,
        tipo: 'success'
      });
    }

    // Radiación UV
    const uvIndex = current.uv_index ?? 0;
    if (uvIndex >= 8) {
      recomendaciones.push({
        icono: 'flare',
        titulo: 'Radiación UV extrema',
        descripcion: `Índice UV: ${uvIndex}. Evite salir entre 10:00 y 16:00. Use protector solar SPF50+, lentes y sombrero.`,
        tipo: 'danger'
      });
    } else if (uvIndex >= 5) {
      recomendaciones.push({
        icono: 'wb_sunny',
        titulo: 'Radiación UV alta',
        descripcion: `Índice UV: ${uvIndex}. Use protector solar SPF30+, lentes de sol y ropa de manga larga.`,
        tipo: 'warning'
      });
    } else if (uvIndex > 0) {
      recomendaciones.push({
        icono: 'light_mode',
        titulo: 'Radiación UV moderada',
        descripcion: `Índice UV: ${uvIndex}. Se recomienda protector solar básico si va a estar al aire libre.`,
        tipo: 'info'
      });
    }

    // Lluvia / Precipitación
    if (current.precipitation > 0) {
      recomendaciones.push({
        icono: 'umbrella',
        titulo: 'Lluvia detectada',
        descripcion: `Hay ${current.precipitation}mm de precipitación. Lleve paraguas o impermeable al salir.`,
        tipo: 'warning'
      });
    }

    // Viento fuerte
    if (current.wind_speed_10m > 30) {
      recomendaciones.push({
        icono: 'air',
        titulo: 'Viento fuerte',
        descripcion: `Viento a ${current.wind_speed_10m} km/h. Tenga precaución en exteriores y asegure objetos sueltos.`,
        tipo: 'danger'
      });
    } else if (current.wind_speed_10m > 15) {
      recomendaciones.push({
        icono: 'air',
        titulo: 'Viento moderado',
        descripcion: `Viento a ${current.wind_speed_10m} km/h. Evite actividades al aire libre prolongadas.`,
        tipo: 'info'
      });
    }

    // Humedad alta
    if (current.relative_humidity_2m > 80) {
      recomendaciones.push({
        icono: 'water_drop',
        titulo: 'Humedad alta',
        descripcion: `Humedad del ${current.relative_humidity_2m}%. Puede afectar a pacientes con enfermedades respiratorias.`,
        tipo: 'warning'
      });
    }

    // Recomendación general salud
    recomendaciones.push({
      icono: 'local_hospital',
      titulo: 'Cuide su salud',
      descripcion: 'Recuerde tomar sus medicamentos a tiempo, mantenerse hidratado y acudir a sus citas médicas programadas.',
      tipo: 'info'
    });

    return recomendaciones;
  }

  getWeatherIcon(code: number, isDay: number): string {
    if (code === 0) return isDay ? 'wb_sunny' : 'nights_stay';
    if (code <= 2) return 'partly_cloudy_day';
    if (code === 3) return 'cloud';
    if (code <= 49) return 'foggy';
    if (code <= 59) return 'grain';
    if (code <= 69) return 'water_drop';
    if (code <= 79) return 'ac_unit';
    if (code <= 84) return 'umbrella';
    if (code <= 99) return 'thunderstorm';
    return 'wb_cloudy';
  }

  getWeatherDescription(code: number): string {
    const descriptions: { [key: number]: string } = {
      0: 'Cielo despejado', 1: 'Principalmente despejado', 2: 'Parcialmente nublado',
      3: 'Nublado', 45: 'Niebla', 48: 'Niebla con escarcha', 51: 'Llovizna leve',
      53: 'Llovizna moderada', 55: 'Llovizna densa', 61: 'Lluvia leve',
      63: 'Lluvia moderada', 65: 'Lluvia intensa', 71: 'Nevada leve',
      73: 'Nevada moderada', 75: 'Nevada intensa', 80: 'Chubascos leves',
      81: 'Chubascos moderados', 82: 'Chubascos violentos', 95: 'Tormenta eléctrica',
      99: 'Tormenta con granizo'
    };
    return descriptions[code] ?? 'Condición climática variada';
  }
}
