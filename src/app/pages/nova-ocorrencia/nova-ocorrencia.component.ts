import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MdTab, MdTabChangeEvent, MdTabGroup, MdSelect, MdInputContainer } from '@angular/material';
import { AgmCoreModule } from '@agm/core';

import { PrefeituraDALService } from '../../dal/prefeitura.dal';
import { OcorrenciasDALService } from '../../dal/ocorrencia.dal';

import { AutenticacaoService } from '../../service/autenticacao.service';
import { Usuario } from '../../class/usuario';
import { Prefeitura } from '../../class/prefeitura';
/*import { AssuntoOcorrencia } from '../../class/assunto-ocorrencia';
import { TipoOcorrencia } from '../../class/tipo-ocorrencia';*/
import { FotoOcorrencia } from '../../class/foto-ocorrencia';
import { Mensagem } from '../../class/mensagem';

declare var google;

@Component({
    selector: 'app-nova-ocorrencia',
    templateUrl: './nova-ocorrencia.component.html',
    styleUrls: ['./nova-ocorrencia.component.css'],
    providers: [
        PrefeituraDALService,
        OcorrenciasDALService,
    ]
})
export class NovaOcorrenciaComponent implements OnInit {

    usuario: Usuario;
    prefeitura: Prefeitura;

    // TODO: pegar uma coordenada padrão para o caso de não conseguir pegar uma coordenada do browser
    local = {
        zoom: 15,
        latitude: -20,
        longitude: -40,
        enderecoCompleto: '',
        bairro: '',
        cidade: '',
        estado: ''
    }
    dados: any = {
        assunto_descricao: '',
        assunto_logo: '',
        autor: '',
        autor_email: '',
        avaliacao: 0,
        bairro: '',
        data_abertura: '',
        data_analise: '',
        data_fechamento: '',
        endereco_completo: '',
        endereco_latitude: 0,
        endereco_longitude: 0,
        protocolo: '',
        publico: true,
        secretaria_sigla: '',
        status: 'aberto',
        tipo_descricao: '',
    }
    cidadeSelecionada = '';
    fotos: Array<FotoOcorrencia>;
    mensagens: Array<Mensagem>;
    ocorrenciaSalva = false;

    assunto: string;
    tipo: string;
    detalhes: string;

    tituloFinalizar = '';
    mensagemFinalizar = '';

    // DEBUG
    teste: any = '';

    @ViewChild('tabOcorrencia') tabOcorrencia: MdTabGroup;
    @ViewChild('tipo') selectTipo: MdSelect;

    mensagemPrefeituraSemContrato = 'ATENÇÃO: Essa prefeitura não possui contrato com o Click Cidadão. Portando, a ocorrência será criada em modo de demonstração.'

    constructor(private authService: AutenticacaoService,
        private prefService: PrefeituraDALService,
        private ocorrenciaService: OcorrenciasDALService,
        private router: Router) {
        this.usuario = authService.usuario();
    }

    ngOnInit() {
        // verifica se existe um usuário logado
        // console.log('Verificando login...', this.authService.logado());
        if (!this.authService.logado() || this.usuario == null) {
            // console.log('Retornando!');
            this.voltar();
            return;
        }
        this.iniciaOcorrencia();

    }

    public iniciaOcorrencia() {
        let hoje = new Date(Date.now());
        let ano = hoje.getFullYear().toString();
        let mes = ("0" + (hoje.getMonth() + 1).toString()).slice(-2);
        let dia = ("0" + hoje.getUTCDate()).slice(-2);
        let hora = ("0" + hoje.getHours()).slice(-2);
        let minutos = ("0" + hoje.getMinutes()).slice(-2);
        let segundos = ("0" + hoje.getSeconds()).slice(-2);
        let numeroRandomico = ("000" + (Math.floor(Math.random() * 999) + 1)).slice(-3);
        let protocolo = `-${ano}${mes}${dia}-${hora}${minutos}${segundos}-${numeroRandomico}`;

        this.dados.autor = this.usuario.nome;
        this.dados.autor_email = this.usuario.email;
        this.dados.data_abertura = hoje.toLocaleDateString('pt-BR') + ' ' + hoje.toLocaleTimeString('pt-BR');
        this.dados.protocolo = protocolo;

        this.tipo = 'xxx';
        this.dados.tipo_descricao = '';
        this.assunto = '';
        this.dados.assunto_descricao = '';
        this.dados.assunto_logo = '';
        this.dados.secretaria_sigla = '';
        this.detalhes = '';

        this.cidadeSelecionada = '';

        this.fotos = new Array<FotoOcorrencia>();
        this.mensagens = new Array<Mensagem>();

        if (window.navigator && window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(
                position => {
                    // this.geolocationPosition = position,
                    console.log(position);
                    this.local.latitude = position.coords.latitude;
                    this.local.longitude = position.coords.longitude;

                    this.getEnderecoPorCoordenadas(this.local.latitude, this.local.longitude)
                        .then(_endereco => {
                            // console.log('sucesso...');
                            this.preencheDadosEndereco(_endereco);
                        }).catch(_err => {
                            // console.log('falha...');
                            // TODO: acertar erro e pegar endereço correto!!!
                            this.local.enderecoCompleto = 'Não retornado pelo Google: ' + _err;
                            this.local.bairro = '';
                            this.local.cidade = '';
                            this.local.estado = '';
                        });
                },
                error => {
                    switch (error.code) {
                        case 1:
                            console.log('Permissão negada para pegar localização da máquina!');
                            break;
                        case 2:
                            console.log('Posição não disponivel!');
                            break;
                        case 3:
                            console.log('Timeout');
                            break;
                    }
                }
            );
        };
    }

    public voltar() {
        this.router.navigate(['']);
    }

    public alterarTab(tab: MdTabChangeEvent) {
        // console.log(tab);
        /*if (tab.tab.textLabel === 'local') {

        } else */
        if (tab.tab.textLabel === 'detalhes') {
            // verifica mudança de cidade!
            // console.log('Cidade: ', this.cidadeSelecionada, ' local: ', this.local.cidade);
            if (this.cidadeSelecionada !== this.local.cidade) {
                // carrega os dados da prefeitura da cidade selecionada!
                this.getPrefeituraDados(this.local.cidade, this.local.estado);
                this.cidadeSelecionada = this.local.cidade;
                this.dados.endereco_completo = this.local.enderecoCompleto;
                this.dados.endereco_latitude = this.local.latitude;
                this.dados.endereco_longitude = this.local.longitude;
                this.dados.bairro = this.local.bairro;
            } else {
                // atualiza os dados de endereço sem alteração de cidade!!!
                this.dados.endereco_completo = this.local.enderecoCompleto;
                this.dados.endereco_latitude = this.local.latitude;
                this.dados.endereco_longitude = this.local.longitude;
                this.dados.bairro = this.local.bairro;
            }


        } else if (tab.tab.textLabel === 'finalizar') {
            // valida os dados para finalizar!
            if (this.ocorrenciaSalva) {
                this.tituloFinalizar = `Parabéns`;
                this.mensagemFinalizar = `Sua ocorrência foi salva na ${this.prefeitura.dados.nome} com sucesso! Protocolo criado ${this.dados.protocolo}`;
            } else {
                this.tituloFinalizar = '';
                this.mensagemFinalizar = 'Opa, parece que você ainda não finalizou sua ocorrencia. Por favor, retorne à aba de detalhamento e conclua sua ocorrência!';
            }
        }

    }

    public getPrefeituraDados(cidade: string, estado: string) {
        this.prefService.getPrefeituraByCidade(cidade, estado)
            .then((_pref: Prefeitura) => {
                console.log('Dados recuperados da prefeitura de ', _pref.dados.nome);
                this.prefeitura = _pref;
                this.dados.protocolo = this.prefeitura.dados.sigla + this.dados.protocolo.substring(this.dados.protocolo.indexOf('-'));
            });
    }

    public alterarTipo() {
        let tipoSelecionado = this.prefeitura.tipos.filter(x => x.descricao === this.tipo).shift();
        this.dados.tipo_descricao = tipoSelecionado.descricao;
    }

    public alterarAssunto() {
        let assuntoSelecionado = this.prefeitura.assuntos.filter(x => x.descricao === this.assunto).shift();
        this.dados.assunto_descricao = assuntoSelecionado.descricao;
        this.dados.assunto_logo = assuntoSelecionado.logo;
        this.dados.secretaria_sigla = assuntoSelecionado.secretaria;
    }

    public markerDragEnd(m: any, $event: MouseEvent) {
        let pos = JSON.parse(JSON.stringify($event));
        console.log('Fim do araste do marcador', $event);

        this.local.latitude = pos.coords.lat;
        this.local.longitude = pos.coords.lng;

        this.getEnderecoPorCoordenadas(pos.coords.lat, pos.coords.lng)
            .then(_endereco => {
                this.preencheDadosEndereco(_endereco);
            }).catch(_err => {
                this.local.enderecoCompleto = 'Não retornado pelo Google: ' + _err;
                this.local.bairro = '';
                this.local.cidade = '';
                this.local.estado = '';
            });

    }

    public localizarEndereco(event) {
        this.getCoordenadasPorEndereco(this.local.enderecoCompleto)
            .then(_endereco => {
                // console.log('sucesso...');
                this.preencheDadosEndereco(_endereco);
                this.local.latitude = _endereco.geometry.location.lat();
                this.local.longitude = _endereco.geometry.location.lng();
            }).catch(_err => {
                // console.log('falha...');
                this.local.enderecoCompleto = 'Não retornado pelo Google: ' + _err;
                this.local.bairro = '';
                this.local.cidade = '';
                this.local.estado = '';
            });
    }

    public getEnderecoPorCoordenadas(lat: number, lng: number): Promise<any> {
        return new Promise((resolve, reject) => {
            let geocoder = new google.maps.Geocoder();
            let coords = {
                'location': {
                    'lat': lat,
                    'lng': lng
                }
            };
            geocoder.geocode(coords, (result, status) => {
                // console.log(result[0]);
                // console.log('endereço localizado: ' + local.enderecoCompleto);
                if (status === 'OK') {
                    this.teste = result[0].geometry.location;
                    resolve(result[0]);
                } else {
                    reject(status);
                }
            });
        });
    }

    public getCoordenadasPorEndereco(enderecoCompleto: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let geocoder = new google.maps.Geocoder();
            let address = {
                'address': enderecoCompleto
            };
            geocoder.geocode(address, (result, status) => {
                // console.log(result[0]);
                // console.log('endereço localizado: ' + local.enderecoCompleto);
                if (status === 'OK') {
                    this.teste = result[0].geometry.location;
                    resolve(result[0]);
                } else {
                    reject(status);
                }
            });
        });
    }

    public preencheDadosEndereco(enderecoGeocode: any) {
        /* Geocode: resultado da localização no google
                            https://developers.google.com/maps/documentation/javascript/geocoding?hl=pt-br#GeocodingResults
                        */
        this.local.enderecoCompleto = enderecoGeocode.formatted_address;
        console.log(enderecoGeocode);

        enderecoGeocode.address_components.forEach(item => {

            // Bairro: => sublocality_level_1
            if (item.types.findIndex(x => x === 'sublocality_level_1' || x === 'sublocality') > -1) {
                this.local.bairro = item.long_name;
            }
            // Estado => administrative_area_level_1
            if (item.types.findIndex(x => x === 'administrative_area_level_1') > -1) {
                this.local.estado = item.short_name;
            }
            // Cidade => administrative_area_level_2
            if (item.types.findIndex(x => x === 'administrative_area_level_2') > -1) {
                this.local.cidade = item.long_name;
            }
        });
    }

    public salvar() {
        if (this.validarOcorrencia()) {
            this.ocorrenciaSalva = true;
            this.tabOcorrencia.selectedIndex = 2;
            let tab = this.tabOcorrencia._tabs;
            tab.forEach(item => {
                if (item.textLabel === 'local' || item.textLabel === 'detalhes')
                    item.disabled = true;
            });

            let msg = new Mensagem({
                autor: this.usuario.nome,
                mensagem: this.detalhes,
                autor_prefeitura: false,
                data: this.dados.data_abertura,
                fotoURI: this.usuario.logo
            });
            msg.dt = null;

            this.dados.mensagens = new Array<Mensagem>();
            this.dados.mensagens.push(msg);

            console.log('gravando ocorrencia em ', this.local.cidade + '-' + this.local.estado)
            this.ocorrenciaService.prefeituraKey = this.local.cidade + '-' + this.local.estado;
            this.ocorrenciaService.criaOcorrencia(this.dados);

            if (this.fotos.length > 0) {
                this.ocorrenciaService.gravaFotos(this.dados.protocolo, this.fotos);
            }
        }
    }

    public validarOcorrencia(): boolean {
        if (this.dados.tipo_descricao === '') {
            document.getElementsByName('tipo')[0].focus();
            return false;
        }
        if (this.dados.assunto_descricao === '') {
            document.getElementsByName('assunto')[0].focus();
            return false;
        }
        if (this.detalhes === '') {
            document.getElementsByName('detalhes')[0].focus();
            return false;
        }
        return true;
    }

    public novaOcorrencia() {
        this.ocorrenciaSalva = false;
        this.iniciaOcorrencia();
        this.tabOcorrencia.selectedIndex = 0;

        let tab = this.tabOcorrencia._tabs;
        tab.forEach(item => {
            if (item.textLabel === 'local' || item.textLabel === 'detalhes')
                item.disabled = false;
        });
    }

}
