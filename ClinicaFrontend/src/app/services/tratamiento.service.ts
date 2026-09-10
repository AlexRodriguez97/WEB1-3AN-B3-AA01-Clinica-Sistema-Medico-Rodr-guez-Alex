import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita, Paciente } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class TratamientoService {
  private readonly apiUrl = 'http://localhost:5087/api/clinica';

  constructor(private http: HttpClient) {}

  obtenerCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/citas`);
  }

  obtenerCita(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/citas/${id}`);
  }

  obtenerPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.apiUrl}/pacientes`);
  }

  obtenerPacienteConCitas(cedula: string): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/pacientes/${cedula}/citas`);
  }

  obtenerCitasPorTratamiento(tratamiento: string): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/citas/tratamiento/${tratamiento}`);
  }

  agregarCita(cita: Cita): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/citas`, cita);
  }

  actualizarCita(cita: Cita): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/citas`, cita);
  }

  eliminarCita(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/citas/${id}`);
  }

  // --- Pacientes CRUD ---
  obtenerPaciente(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.apiUrl}/pacientes/${id}`);
  }

  crearPaciente(paciente: Paciente): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/pacientes`, paciente);
  }

  actualizarPaciente(paciente: Paciente): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/pacientes`, paciente);
  }

  eliminarPaciente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/pacientes/${id}`);
  }
}
