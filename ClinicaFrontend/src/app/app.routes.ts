import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { TratamientosComponent } from './tratamientos/tratamientos';
import { MedicosComponent } from './medicos/medicos';
import { PacientesComponent } from './pacientes/pacientes';
import { CitasComponent } from './citas/citas';
import { ClimaComponent } from './clima/clima';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'pacientes', component: PacientesComponent },
  { path: 'citas', component: CitasComponent },
  { path: 'tratamientos', component: TratamientosComponent },
  { path: 'medicos', component: MedicosComponent },
  { path: 'clima', component: ClimaComponent },
  { path: '**', redirectTo: 'home' }
];
