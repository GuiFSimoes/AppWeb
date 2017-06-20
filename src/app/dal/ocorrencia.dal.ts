import { Injectable } from '@angular/core';
import { FirebaseListObservable, FirebaseObjectObservable, AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

import { Ocorrencia } from '../class/ocorrencia';
import { Mensagem } from '../class/mensagem';
import { FotoOcorrencia } from '../class/foto-ocorrencia';
import { ItemListaOcorrencia } from '../class/item-lista-ocorrencia';

@Injectable()
export class OcorrenciasDALService {

    public prefeituraKey: string;
    public ocorRef: firebase.database.Reference;
    constructor(private af: AngularFireDatabase) { }

    public getAll = (): FirebaseListObservable<Array<any>> => {
        return this.af.list(`/prefeituras/${this.prefeituraKey}/ocorrencias`);
    }

    public getById = (id: string): FirebaseObjectObservable<any> => {
        return this.af.object(`/prefeituras/${this.prefeituraKey}/ocorrencias/${id}`, { preserveSnapshot: true });
    }

    /**
         * Retorna a lista das ocorrencias de um usuário (e-mail) dentro da cidade selecionada (prefeituraKey)
         * @param email E-mail do usuário para carregar as ocorrências
         * @param keyPrefeitura Chave da prefeitura para pegar as ocorrências
         */
    public getOcorrenciasUsuarioPorChavePrefeitura(email: string, keyPrefeitura: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let refOcorrencias = firebase.database().ref(`/prefeituras/${keyPrefeitura}/ocorrencias`);
            refOcorrencias.orderByChild('autor_email').equalTo(email).once('value')
                .then(_snapshot => {
                    if (_snapshot.exists()) {
                        let lstItemRetorno: ItemListaOcorrencia[] = new Array<ItemListaOcorrencia>();
                        // let lstOcorr: Array<Ocorrencia> = new Array<Ocorrencia>();
                        for (let key in _snapshot.val()) {
                            let dataOcor = {
                                autor: _snapshot.val()[key].autor,
                                autor_email: email,
                                data_abertura: _snapshot.val()[key].data_abertura
                            }
                            let ocorr = new Ocorrencia(dataOcor);
                            ocorr.protocolo = _snapshot.val()[key].protocolo;
                            ocorr.assunto_descricao = _snapshot.val()[key].assunto_descricao;
                            ocorr.tipo_descricao = _snapshot.val()[key].tipo_descricao;
                            ocorr.status = _snapshot.val()[key].status;
                            ocorr.endereco_completo = _snapshot.val()[key].endereco_completo;
                            ocorr.endereco_latitude = _snapshot.val()[key].endereco_latitude;
                            ocorr.endereco_longitude = _snapshot.val()[key].endereco_longitude;
                            ocorr.data_previsao = _snapshot.val()[key].data_previsao;
                            // carrega as mensagens
                            firebase.database().ref(`/prefeituras/${keyPrefeitura}/ocorrencias/${key}/mensagens`).once('value')
                                // refOcorrencias.child('/mensagens').once('value')
                                .then(_mensagens => {
                                    if (_mensagens.exists()) {
                                        ocorr.setMensagens(_mensagens.val());
                                    }
                                });
                            // fotos
                            firebase.database().ref(`/prefeituras/${keyPrefeitura}/ocorrencias/${key}/fotos`).once('value')
                                // refOcorrencias.child('/fotos').once('value')
                                .then(_fotos => {
                                    if (_fotos.exists()) {
                                        ocorr.setFotos(_fotos.val());
                                    }
                                });
                            let itemRetorno: ItemListaOcorrencia = new ItemListaOcorrencia();
                            itemRetorno.key = key;
                            itemRetorno.siglaPrefeitura = keyPrefeitura;
                            itemRetorno.ocorrencia = ocorr;
                            lstItemRetorno.push(itemRetorno);
                        }
                        if (lstItemRetorno.length > 0) {
                            resolve(lstItemRetorno);
                        } else {
                            reject(null);
                        }

                    } else {
                        reject(null); // sem prefeituras cadastradas ainda! -> atenção: esse caso não está tratado!
                    }
                })
                .catch(_err => {
                    reject(null);
                });
        });

    }

    public criaOcorrencia(ocorrencia: any) {
        // cria a referência
        this.ocorRef = firebase.database().ref(`/prefeituras/${this.prefeituraKey}/ocorrencias`);
        // grava a ocorrnecia com o protocolo gerado!
        this.ocorRef.child(ocorrencia.protocolo).set(ocorrencia);
        this.ocorRef = this.ocorRef.child(`/${ocorrencia.protocolo}`);
    }

    public gravaFotos(protocolo: string, fotos: FotoOcorrencia[]) {

        let fotosDatabaseRef = this.ocorRef.child(`/fotos`);
        fotos.forEach(foto => {
            let nomeArquivo = foto.fotoURI.name;
            let caminhoArquivo = `/${this.prefeituraKey}/ocorrencias/${protocolo}/${nomeArquivo}`;

            // cria uma referencia para upload do arquivo!
            let storageRef = firebase.storage().ref(caminhoArquivo);
            let uploadTask = storageRef.put(foto.fotoURI);  // envia o arquivo!!!

            // fica escutando o evento de upload do arquivo!!!
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                _snapshot => { /*console.log('snapshot: ' + _snapshot);*/ },
                _err => {
                    /*console.log('retorno com erro!');*/
                    console.log(_err);
                },
                () => {
                    // upload completo!
                    console.log('foto enviada!!!');
                    foto.data = null;
                    foto.fotoURI = null;
                    foto.fotoPATH = caminhoArquivo;
                    foto.fotoURL = uploadTask.snapshot.downloadURL;
                    fotosDatabaseRef.push(foto);
                });
        });
    }
}
