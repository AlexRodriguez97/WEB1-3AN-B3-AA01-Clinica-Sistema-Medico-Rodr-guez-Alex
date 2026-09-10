import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medico, MedicoConCitas } from '../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private readonly apiUrl = 'http://localhost:5204/api/medico';

  constructor(private http: HttpClient) {}

  // GET: api/medico
  obtenerMedicos(): Observable<Medico[]> {
    return this.http.get<Medico[]>(this.apiUrl);
  }

  // GET: api/medico/{id}
  obtenerMedico(id: number): Observable<Medico> {
    return this.http.get<Medico>(`${this.apiUrl}/${id}`);
  }

  // GET: api/medico/{id}/citas
  obtenerMedicoConCitas(id: number): Observable<MedicoConCitas> {
    return this.http.get<MedicoConCitas>(`${this.apiUrl}/${id}/citas`);
  }

  // GET: api/medico/cedula/{cedula}
  obtenerMedicoPorCedula(cedula: string): Observable<Medico> {
    return this.http.get<Medico>(`${this.apiUrl}/cedula/${encodeURIComponent(cedula)}`);
  }

  // POST: api/medico
  crearMedico(medico: Medico): Observable<Medico> {
    return this.http.post<Medico>(this.apiUrl, medico);
  }

  // PUT: api/medico/{id}
  actualizarMedico(id: number, medico: Medico): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, medico);
  }

  // DELETE: api/medico/{id}
  eliminarMedico(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
