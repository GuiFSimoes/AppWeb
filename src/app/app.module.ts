import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Firebase config
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppSharedModule } from './_shared';
import { ErrorPageComponent } from './_shared/error-page.component';

import { ListaOcorrenciaModule } from './pages/lista-ocorrencia/lista-ocorrencia.module';
import { NovaOcorrenciaModule } from './pages/nova-ocorrencia/nova-ocorrencia.module';

import { LoginComponent } from './pages/login/login.component';
import { ListaOcorrenciaComponent } from './pages/lista-ocorrencia/lista-ocorrencia.component';
import { NovaOcorrenciaComponent } from './pages/nova-ocorrencia/nova-ocorrencia.component';

import { AutenticacaoService } from './service/autenticacao.service';

import { UsuarioDAL } from './dal/usuario.dal';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NovaOcorrenciaComponent,
        ListaOcorrenciaComponent,
        ErrorPageComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        AppSharedModule,
        NovaOcorrenciaModule,
        ListaOcorrenciaModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
    ],
    providers: [
        AutenticacaoService,
        UsuarioDAL,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
