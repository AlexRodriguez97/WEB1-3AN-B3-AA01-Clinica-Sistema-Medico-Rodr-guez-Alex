import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Cita, Paciente } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class TratamientoService {
  private readonly soapUrl = 'http://localhost:5087/ClinicaService.svc';

  constructor(private http: HttpClient) {}

  /**
   * Ejecuta una petición SOAP 1.1 con sobre XML y cabecera SOAPAction
   */
  private callSoap(soapAction: string, bodyXml: string): Observable<Document> {
    const envelope = `<?xml version="1.0" encoding="utf-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:trat="http://schemas.datacontract.org/2004/07/Tratamiento.Models">
  <soapenv:Header/>
  <soapenv:Body>
    ${bodyXml}
  </soapenv:Body>
</soapenv:Envelope>`;

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': `http://tempuri.org/IClinicaService/${soapAction}`
    });

    return this.http.post(this.soapUrl, envelope, {
      headers,
      responseType: 'text'
    }).pipe(
      map(xmlStr => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlStr, 'text/xml');
        
        // Verificar si SOAP devolvió un Fault
        const faultNode = doc.querySelector('Fault') || doc.getElementsByTagNameNS('*', 'Fault')[0];
        if (faultNode) {
          const faultString = faultNode.querySelector('faultstring')?.textContent || 'Error interno del servicio SOAP';
          throw new Error(faultString);
        }
        return doc;
      }),
      catchError(err => {
        console.error(`Error en llamada SOAP ${soapAction}:`, err);
        return throwError(() => err);
      })
    );
  }

  // --- Operaciones de Citas ---

  obtenerCitas(): Observable<Cita[]> {
    return this.callSoap('ObtenerCitas', '<tem:ObtenerCitas/>').pipe(
      map(doc => this.parseCitas(doc))
    );
  }

  obtenerCita(id: number): Observable<Cita> {
    return this.callSoap('ObtenerCita', `<tem:ObtenerCita><tem:id>${id}</tem:id></tem:ObtenerCita>`).pipe(
      map(doc => {
        const node = doc.querySelector('ObtenerCitaResult') || doc.getElementsByTagNameNS('*', 'ObtenerCitaResult')[0];
        return node ? this.xmlToCita(node) : ({} as Cita);
      })
    );
  }

  obtenerCitasPorTratamiento(tratamiento: string): Observable<Cita[]> {
    return this.callSoap('ObtenerCitaPorTratamiento', `<tem:ObtenerCitaPorTratamiento><tem:tratamiento>${this.escapeXml(tratamiento)}</tem:tratamiento></tem:ObtenerCitaPorTratamiento>`).pipe(
      map(doc => this.parseCitas(doc))
    );
  }

  obtenerCitaPorCedula(cedula: string): Observable<Cita[]> {
    return this.callSoap('ObtenerCitaPorCedula', `<tem:ObtenerCitaPorCedula><tem:cedula>${this.escapeXml(cedula)}</tem:cedula></tem:ObtenerCitaPorCedula>`).pipe(
      map(doc => this.parseCitas(doc))
    );
  }

  agregarCita(cita: Cita): Observable<any> {
    const horaSoap = this.toSoapDuration(cita.hora);
    const fechaSoap = cita.fecha ? (cita.fecha.includes('T') ? cita.fecha.split('T')[0] + 'T00:00:00' : cita.fecha + 'T00:00:00') : '2026-09-10T00:00:00';
    const idMed = cita.idMedico && Number(cita.idMedico) > 0 ? Number(cita.idMedico) : null;
    const medXml = idMed !== null 
      ? `<trat:IdMedico>${idMed}</trat:IdMedico>` 
      : '<trat:IdMedico xmlns:i="http://www.w3.org/2001/XMLSchema-instance" i:nil="true"/>';

    // Orden alfabético estricto para DataContractSerializer
    const xml = `<tem:AgregarCita>
      <tem:cita>
        <trat:DescTratamiento>${this.escapeXml(cita.descTratamiento || '')}</trat:DescTratamiento>
        <trat:Estado>${cita.estado ?? 1}</trat:Estado>
        <trat:Fecha>${fechaSoap}</trat:Fecha>
        <trat:Hora>${horaSoap}</trat:Hora>
        <trat:IdCita>0</trat:IdCita>
        ${medXml}
        <trat:IdPaciente>${Number(cita.idPaciente)}</trat:IdPaciente>
        <trat:Motivo>${this.escapeXml(cita.motivo || '')}</trat:Motivo>
      </tem:cita>
    </tem:AgregarCita>`;

    return this.callSoap('AgregarCita', xml).pipe(
      map(doc => {
        const resNode = doc.querySelector('AgregarCitaResult') || doc.getElementsByTagNameNS('*', 'AgregarCitaResult')[0];
        const res = resNode?.textContent?.trim();
        if (res !== 'true') {
          throw new Error('El servicio SOAP no pudo agregar la cita. Verifique que el paciente exista en ClinicaDB.');
        }
        return { success: true, mensaje: 'Cita creada exitosamente' };
      })
    );
  }

  actualizarCita(cita: Cita): Observable<any> {
    const horaSoap = this.toSoapDuration(cita.hora);
    const fechaSoap = cita.fecha ? (cita.fecha.includes('T') ? cita.fecha.split('T')[0] + 'T00:00:00' : cita.fecha + 'T00:00:00') : '2026-09-10T00:00:00';
    const idMed = cita.idMedico && Number(cita.idMedico) > 0 ? Number(cita.idMedico) : null;
    const medXml = idMed !== null 
      ? `<trat:IdMedico>${idMed}</trat:IdMedico>` 
      : '<trat:IdMedico xmlns:i="http://www.w3.org/2001/XMLSchema-instance" i:nil="true"/>';

    // Orden alfabético estricto para DataContractSerializer
    const xml = `<tem:ActualizarCita>
      <tem:cita>
        <trat:DescTratamiento>${this.escapeXml(cita.descTratamiento || '')}</trat:DescTratamiento>
        <trat:Estado>${cita.estado ?? 1}</trat:Estado>
        <trat:Fecha>${fechaSoap}</trat:Fecha>
        <trat:Hora>${horaSoap}</trat:Hora>
        <trat:IdCita>${Number(cita.idCita)}</trat:IdCita>
        ${medXml}
        <trat:IdPaciente>${Number(cita.idPaciente)}</trat:IdPaciente>
        <trat:Motivo>${this.escapeXml(cita.motivo || '')}</trat:Motivo>
      </tem:cita>
    </tem:ActualizarCita>`;

    return this.callSoap('ActualizarCita', xml).pipe(
      map(doc => {
        const resNode = doc.querySelector('ActualizarCitaResult') || doc.getElementsByTagNameNS('*', 'ActualizarCitaResult')[0];
        const res = resNode?.textContent?.trim();
        if (res !== 'true') {
          throw new Error('El servicio SOAP no pudo actualizar la cita.');
        }
        return { success: true, mensaje: 'Cita actualizada correctamente' };
      })
    );
  }

  eliminarCita(id: number): Observable<any> {
    return this.callSoap('EliminarCita', `<tem:EliminarCita><tem:id>${id}</tem:id></tem:EliminarCita>`).pipe(
      map(doc => {
        const resNode = doc.querySelector('EliminarCitaResult') || doc.getElementsByTagNameNS('*', 'EliminarCitaResult')[0];
        const res = resNode?.textContent?.trim();
        if (res !== 'true') {
          throw new Error('El servicio SOAP no pudo eliminar la cita.');
        }
        return { success: true, mensaje: 'Cita eliminada correctamente' };
      })
    );
  }

  // --- Operaciones de Pacientes ---

  obtenerPacientes(): Observable<Paciente[]> {
    return this.callSoap('ObtenerPacientes', '<tem:ObtenerPacientes/>').pipe(
      map(doc => this.parsePacientes(doc))
    );
  }

  obtenerPacienteConCitas(cedula: string): Observable<Paciente> {
    return this.callSoap('ObtenerPacienteConCitas', `<tem:ObtenerPacienteConCitas><tem:cedula>${this.escapeXml(cedula)}</tem:cedula></tem:ObtenerPacienteConCitas>`).pipe(
      map(doc => {
        const node = doc.querySelector('ObtenerPacienteConCitasResult') || doc.getElementsByTagNameNS('*', 'ObtenerPacienteConCitasResult')[0];
        return node ? this.xmlToPaciente(node) : ({} as Paciente);
      })
    );
  }

  // --- Parseo y Conversión XML ---

  private parseCitas(doc: Document): Cita[] {
    const nodes = doc.getElementsByTagNameNS('*', 'Cita');
    const citas: Cita[] = [];
    for (let i = 0; i < nodes.length; i++) {
      citas.push(this.xmlToCita(nodes[i]));
    }
    return citas;
  }

  private parsePacientes(doc: Document): Paciente[] {
    const nodes = doc.getElementsByTagNameNS('*', 'Paciente');
    const pacientes: Paciente[] = [];
    for (let i = 0; i < nodes.length; i++) {
      pacientes.push(this.xmlToPaciente(nodes[i]));
    }
    return pacientes;
  }

  private getVal(el: Element, tagName: string): string {
    const found = el.getElementsByTagName(tagName)[0] ||
                  el.getElementsByTagNameNS('*', tagName)[0];
    return found?.textContent?.trim() || '';
  }

  private xmlToCita(el: Element): Cita {
    const idMedStr = this.getVal(el, 'IdMedico');
    return {
      idCita: Number(this.getVal(el, 'IdCita')) || 0,
      fecha: this.getVal(el, 'Fecha'),
      hora: this.toTimeString(this.getVal(el, 'Hora')),
      motivo: this.getVal(el, 'Motivo'),
      descTratamiento: this.getVal(el, 'DescTratamiento'),
      estado: Number(this.getVal(el, 'Estado')) || 1,
      idPaciente: Number(this.getVal(el, 'IdPaciente')) || 0,
      idMedico: idMedStr && idMedStr !== '0' ? Number(idMedStr) : undefined
    };
  }

  private xmlToPaciente(el: Element): Paciente {
    const paciente: Paciente = {
      idPaciente: Number(this.getVal(el, 'IdPaciente')) || 0,
      cedula: this.getVal(el, 'Cedula'),
      nombre: this.getVal(el, 'Nombre'),
      apellido: this.getVal(el, 'Apellido'),
      telefono: this.getVal(el, 'Telefono'),
      estado: Number(this.getVal(el, 'Estado')) || 1,
      citas: []
    };

    const citaNodes = el.getElementsByTagNameNS('*', 'Cita');
    for (let i = 0; i < citaNodes.length; i++) {
      paciente.citas?.push(this.xmlToCita(citaNodes[i]));
    }

    return paciente;
  }

  // --- Funciones de utilidad ---

  /**
   * Convierte formatos como 'PT10H30M', 'PT11H', '10:30:00' a '10:30' (formato para <input type="time">)
   */
  public toTimeString(val: string): string {
    if (!val) return '10:00';
    if (val.startsWith('PT')) {
      const hMatch = val.match(/(\d+)H/);
      const mMatch = val.match(/(\d+)M/);
      const h = hMatch ? hMatch[1].padStart(2, '0') : '00';
      const m = mMatch ? mMatch[1].padStart(2, '0') : '00';
      return `${h}:${m}`;
    }
    const parts = val.split(':');
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    }
    return val;
  }

  /**
   * Convierte '10:30', '10:30:00' a formato TimeSpan SOAP 'PT10H30M'
   */
  public toSoapDuration(val: string): string {
    if (!val) return 'PT10H00M';
    if (val.startsWith('PT')) return val;
    const clean = val.replace(/[^0-9:]/g, '');
    const parts = clean.split(':');
    const h = parts[0] ? parseInt(parts[0], 10) : 10;
    const m = parts[1] ? parseInt(parts[1], 10) : 0;
    return `PT${h}H${m > 0 ? m + 'M' : '00M'}`;
  }

  private escapeXml(unsafe: string): string {
    return (unsafe || '').replace(/[<>&'"]/g, c => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }
}
