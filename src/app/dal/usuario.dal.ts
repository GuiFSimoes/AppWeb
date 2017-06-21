import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

@Injectable()
export class UsuarioDALService {

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
                    console.log('Recuperando info user...')
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
                .catch(_err => {
                    console.log('Fudeu!');
                    reject(_err);
                });
        });
    }

    public criarUsuarioMobile = (usuario: any)/*: Promise<any>*/ => {

        console.log('criando usuário: ', usuario);
        let databaseRef = firebase.database().ref(`/usuarios`);
        databaseRef.child(usuario.firebaseID).set(usuario);

        /*return new Promise((resolve, reject) => {
            let databaseRef = firebase.database().ref(`/usuarios`);
            databaseRef.child(usuario.firebaseID).set(usuario)
                .then(_ => resolve(true))
                .catch(_ => reject(false));

        });*/

    }
    // *************************************************************

}
