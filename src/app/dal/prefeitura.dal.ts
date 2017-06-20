import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

// Class
import { Prefeitura } from '../class/prefeitura';
import { Localizacao } from '../class/localizacao';
import { PrefeiturasLista } from '../class/prefeituras-lista';

@Injectable()
export class PrefeituraDALService {

    constructor() { }

    /*
     *  Recupera os dados básicos da prefeitura com a lista de Tipo e Assunto!
     */
    public getPrefeituraByCidade = (cidade: string, estado: string): Promise<any> => {
        return new Promise((resolve, reject) => {
            let refPrefeitura = firebase.database().ref(`/prefeituras/${cidade}-${estado}`);
            refPrefeitura.child('/dados').once('value').then(_snapshot => {
                if (_snapshot.exists()) {
                    // dados básicos da prefeitura
                    let prefRetorno: Prefeitura = new Prefeitura(_snapshot.val());

                    // preenche a lista de Tipo
                    refPrefeitura.child('/tipo_ocorrencia').once('value')
                        .then(_tipos => {
                            if (_tipos.exists()) {
                                prefRetorno.setListaTipo(_tipos.val());
                            }
                        });

                    // preenche a lista de Assunto
                    refPrefeitura.child('/assunto_ocorrencia').once('value')
                        .then(_assuntos => {
                            if (_assuntos.exists()) {
                                prefRetorno.setListaAssunto(_assuntos.val());
                            }
                        });

                    resolve(prefRetorno);
                }
                else {
                    refPrefeitura = firebase.database().ref(`/prefeituras/Demonstração-DM`);

                    refPrefeitura.child('/dados').once('value').then(
                        snapshot => {
                            if (snapshot.exists()) {
                                // dados básicos da prefeitura
                                let prefRetorno: Prefeitura = new Prefeitura(snapshot.val());

                                // preenche a lista de Tipo
                                refPrefeitura.child('/tipo_ocorrencia').once('value')
                                    .then(_tipos => {
                                        if (_tipos.exists()) {
                                            prefRetorno.setListaTipo(_tipos.val());
                                        }
                                    });

                                // preenche a lista de Assunto
                                refPrefeitura.child('/assunto_ocorrencia').once('value')
                                    .then(_assuntos => {
                                        if (_assuntos.exists()) {
                                            prefRetorno.setListaAssunto(_assuntos.val());
                                        }
                                    });

                                resolve(prefRetorno);
                            }
                            else {
                                reject('Essa prefeitura ainda não possui contrato com o Click Cidadão!');
                            }
                        },
                        error => reject(error));
                }
            },
                _error => reject(_error));
        });
    };

    /*
     *   Recupera a lista de prefeituras em '/prefeituras-lista'
     */
    public getListaPrefeituras(): Promise<any> {

        return new Promise((resolve, reject) => {
            let refListaPrefeitura = firebase.database().ref(`/prefeituras-lista`);
            refListaPrefeitura.orderByKey().once('value')
                .then(_snapshot => {
                    if (_snapshot.exists()) {
                        let lstPref: Array<PrefeiturasLista> = new Array<PrefeiturasLista>();
                        for (let key in _snapshot.val()) {
                            lstPref.push(new PrefeiturasLista(key, _snapshot.val()[key].nome, _snapshot.val()[key].sigla))
                        }
                        resolve(lstPref);
                    } else {
                        reject(null); // sem prefeituras cadastradas ainda! -> atenção: esse caso não está tratado!
                    }
                }).catch(_err => {
                    console.log(_err);
                    reject(_err);
                });
        });

    }



}