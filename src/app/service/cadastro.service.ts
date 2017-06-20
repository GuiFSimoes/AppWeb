import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
/*import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';*/

import { Usuario } from '../class/usuario';
/*import { UsuarioDALService } from '../dal/usuario.dal';
import { FormatStringPipe } from '../_shared/pipes/filtro-string.format.pipe';

import { AutenticacaoService } from './autenticacao.service';*/

// Acesso ao banco direto com o firebase
import * as firebase from 'firebase/app';

@Injectable()
export class CadastroService {


    constructor() {
    }

    public criarUsuario(usuario: any) {
        firebase.database().ref('usuarios/' + usuario.firebaseID).update(usuario);
    }


}