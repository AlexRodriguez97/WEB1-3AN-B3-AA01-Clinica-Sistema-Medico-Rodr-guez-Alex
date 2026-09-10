export interface ClimaResponse {
  current: CurrentWeather;
  current_units: CurrentUnits;
  hourly?: HourlyWeather;
  daily?: DailyWeather;
}

export interface CurrentWeather {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  precipitation: number;
  weather_code: number;
  uv_index?: number;
  cloud_cover: number;
  is_day: number;
}

export interface CurrentUnits {
  temperature_2m: string;
  wind_speed_10m: string;
  precipitation: string;
}

export interface HourlyWeather {
  time: string[];
  uv_index: number[];
}

export interface DailyWeather {
  time: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export interface Recomendacion {
  icono: string;
  titulo: string;
  descripcion: string;
  tipo: 'info' | 'warning' | 'danger' | 'success';
}
