import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

@Injectable()
export class UsuarioDAL {

    constructor() { }

    // *************************************************************
    // Métodos para o controller de Usuários mobile
    // *************************************************************
    public getMobileUser = (eMail: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            firebase.database().ref(`/usuarios`)
                .orderByChild('email')
                .equalTo(eMail)
                .once('value')
                .then(_snapshot => {
                    if (_snapshot.exists()) {
                        let usuarioRetorno: any;
                        // existindo o usuário, pegar seus dados na lista!
                        _snapshot.forEach(element => {
                            usuarioRetorno = element.val();
                        });
                        resolve(usuarioRetorno);
                    } else {
                        reject(null);
                    }
                })
                .catch(_err => reject(null));
        });
    }
    // *************************************************************

}