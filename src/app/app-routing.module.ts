import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ListaOcorrenciaComponent } from './pages/lista-ocorrencia/lista-ocorrencia.component';
import { NovaOcorrenciaComponent } from './pages/nova-ocorrencia/nova-ocorrencia.component';

import { ErrorPageComponent } from './_shared/error-page.component';
import { FormatStringPipe } from './_shared/pipes/filtro-string.format.pipe';

const novaOcorrenciaModule = 'app/pages/nova-ocorrencia/nova-ocorrencia.module#NovaOcorrenciaModule';
const listaOcorrenciaModule = 'app/pages/lista-ocorrencia/lista-ocorrencia.module#ListaOcorrenciaModule';


const rotasApp: Routes = [
    { path: 'novaOcorrencia', component: NovaOcorrenciaComponent /*canActivate: [], loadChildren: novaOcorrenciaModule*/ },
    { path: 'listaOcorrencia', component: ListaOcorrenciaComponent/*canActivate: [], loadChildren: listaOcorrenciaModule*/ },
    { path: 'perfil', component: PerfilComponent }, // página de login
    { path: 'login', component: LoginComponent }, // página de login
    { path: '', component: LoginComponent }, // página de login
    { path: '**', component: ErrorPageComponent }  // pagina de erro padrão!
];

@NgModule({
    imports: [RouterModule.forRoot(rotasApp)],
    exports: [RouterModule],
    providers: [
        FormatStringPipe,
    ]
})
export class AppRoutingModule { }
export const routedComponents = [AppComponent];
