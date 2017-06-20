import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MdDialogModule, MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';

import { AutenticacaoService } from '../../service/autenticacao.service';
import { Usuario } from '../../class/usuario';
import { Ocorrencia } from '../../class/ocorrencia';
import { PrefeiturasLista } from '../../class/prefeituras-lista';
import { ItemListaOcorrencia } from '../../class/item-lista-ocorrencia';

import { PrefeituraDALService } from '../../dal/prefeitura.dal';
import { OcorrenciasDALService } from '../../dal/ocorrencia.dal';

import { StausOcorrencia } from '../../../environments/resource';

@Component({
    selector: 'app-lista-ocorrencia',
    templateUrl: './lista-ocorrencia.component.html',
    styleUrls: ['./lista-ocorrencia.component.css'],
    providers: [
        PrefeituraDALService,
        OcorrenciasDALService,
    ]
})
export class ListaOcorrenciaComponent implements OnInit {

    stausOcorrencia = StausOcorrencia;
    usuario: Usuario;

    cidadeSelecionada: string;
    filtro = {
        protocolo: '',
        status: ''
    }

    public listaOcorrencia: Array<ItemListaOcorrencia>;

    // controle de mensagens
    carregandoOcorrencias: boolean;
    semOcorrenciasFiltro: boolean;

    constructor(private authService: AutenticacaoService,
        private prefeituraService: PrefeituraDALService,
        private ocorrenciaService: OcorrenciasDALService,
        private dialog: MdDialog,
        private router: Router) {
        this.usuario = authService.usuario();
    }

    ngOnInit() {
        // verifica se existe um usuário logado
        console.log('Verificando login...', this.authService.logado());
        if (!this.authService.logado() || this.usuario == null) {
            console.log('Retornando!');
            this.voltar();
            return;
        }

        this.carregandoOcorrencias = true;
        this.semOcorrenciasFiltro = false;
        if (this.usuario.cidade !== '') {
            this.cidadeSelecionada = `${this.usuario.cidade}-${this.usuario.estado}`;
        } else {
            this.cidadeSelecionada = 'Selecione...';
        }
        this.carregarListaOcorrencias();
    }

    private voltar() {
        this.router.navigate(['/']);
    }

    public selecionaCidade() {
        let dialogRef = this.dialog.open(CaixaDialogoSelecaoCidade);
        dialogRef.afterClosed().subscribe(result => {
            console.log('Seleção: ' + result);
            if (typeof result !== 'undefined' && result !== '') {
                this.cidadeSelecionada = result;
                this.carregarListaOcorrencias();
            } else {
                this.listaOcorrencia = new Array<ItemListaOcorrencia>();
                this.cidadeSelecionada = 'Selecione...';
                this.carregandoOcorrencias = false;
                this.semOcorrenciasFiltro = true;
            }
        });
    }

    private carregarListaOcorrencias() {
        if (this.cidadeSelecionada === 'Selecione...') {
            this.carregandoOcorrencias = false;
            this.semOcorrenciasFiltro = true;
            return;
        } else {
            this.carregandoOcorrencias = true;
            this.semOcorrenciasFiltro = false;
        }

        this.ocorrenciaService.getOcorrenciasUsuarioPorChavePrefeitura(this.usuario.email, this.cidadeSelecionada)
            .then(_result => {
                // console.log('retornou sucesso');
                this.listaOcorrencia = _result;
                this.carregandoOcorrencias = false;
                this.semOcorrenciasFiltro = false;
            })
            .catch(_err => {
                // sem ocorrencias localizadas...
                this.listaOcorrencia = new Array<ItemListaOcorrencia>();
                this.carregandoOcorrencias = false;
                this.semOcorrenciasFiltro = true;
            });
    }

    public detalhesOcorrencia(ocorrencia: Ocorrencia) {
        // console.log('click em ', ocorrencia.protocolo);

        let config: MdDialogConfig = {
            data: {
                ocorrencia: ocorrencia
            }
        };
        let dialogRef = this.dialog.open(CaixaDialogoDetalhesOcorrencia, config);
    }

}

@Component({
    template: `
        <p>Selecione a cidade desejada para filtrar suas ocorrências</p>
        <p>
        <md-select placeholder="Cidade/Estado" #cidadeSelecionada>
            <md-option *ngFor="let item of listaCidades" [value]="item">
                {{ item }}
            </md-option>
        </md-select>
        </p>
        <p> <button md-button (click)="dialogRef.close(cidadeSelecionada.selected.value)">OK</button> </p>
    `,
    providers: [
        PrefeituraDALService,
    ]
})
export class CaixaDialogoSelecaoCidade {

    listaCidades: string[]; // = new Array<string>();
    cidadesCarregadas = false;

    constructor(private dialogRef: MdDialogRef<CaixaDialogoSelecaoCidade>,
        private prefeituraService: PrefeituraDALService) {
        this.carregaCidadesFiltro();
    }

    private carregaCidadesFiltro() {
        this.prefeituraService.getListaPrefeituras()
            .then((_lstPref: PrefeiturasLista[]) => {
                this.listaCidades = new Array<string>();
                _lstPref.forEach(pref => {
                    this.listaCidades.push(pref.key);
                });
                this.cidadesCarregadas = true;
            });
    }

}

@Component({
    templateUrl: './detalhe-ocorrencia.component.html',
    styleUrls: ['./lista-ocorrencia.component.css'],
})
export class CaixaDialogoDetalhesOcorrencia {

    ocorrencia: Ocorrencia;
    stausOcorrencia = StausOcorrencia;

    constructor(private dialogRef: MdDialogRef<CaixaDialogoDetalhesOcorrencia>,
        @Inject(MD_DIALOG_DATA) public data: any) {
        this.ocorrencia = data.ocorrencia;
    }
}
