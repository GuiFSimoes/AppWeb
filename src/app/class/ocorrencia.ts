import { Mensagem } from './mensagem';
import { FotoOcorrencia } from './foto-ocorrencia';

export class Ocorrencia {

    public protocolo: string = '';
    public autor: string = '';
    public autor_email: string = '';
    public tipo_descricao: string = '';
    public assunto_descricao: string = '';
    public assunto_logo: string = '';
    public secretaria_sigla: string = '';
    public status: string = 'aberto';
    public bairro: string = '';
    public endereco_completo: string = '';
    public endereco_latitude: number = 0;
    public endereco_longitude: number = 0;
    public data_abertura: string = '';
    public data_analise: string = '';
    public data_fechamento: string = '';
    public data_previsao: string = '';
    public avaliacao: number = 0;
    public publico: boolean = true;

    public mensagens: Array<Mensagem> = new Array<Mensagem>();
    public fotos: Array<FotoOcorrencia> = new Array<FotoOcorrencia>();


    constructor(public data?: any) {
        if (typeof data !== 'undefined') {
            this.protocolo = data.protocolo || '';
            this.autor = data.autor || '';
            this.autor_email = data.autor_email || '';
            this.tipo_descricao = data.tipo_descricao || '';
            this.assunto_descricao = data.assunto_descricao || '';
            this.assunto_logo = data.assunto_logo || '';
            this.secretaria_sigla = data.secretaria_sigla || '';
            this.status = data.status || '';
            this.bairro = data.bairro || '';
            this.endereco_completo = data.endereco_completo || '';
            this.endereco_latitude = data.endereco_latitude || 0;
            this.endereco_longitude = data.endereco_longitude || 0;
            this.data_abertura = data.data_abertura || '';
            this.data_analise = data.data_analise || '';
            this.data_fechamento = data.data_fechamento || '';
            this.data_previsao = data.data_previsao || '';
            this.avaliacao = data.avaliacao || 0;
            this.publico = data.publico === 'true' || true;

            if (typeof data.fotos !== 'undefined') {
                for (let key in data.fotos) {
                    if (data.fotos.hasOwnProperty(key)) {
                        // console.log('Chave foto: ' + key);
                        this.fotos.push(new FotoOcorrencia(data.fotos[key]));
                    }
                }
            }
            if (typeof data.mensagens !== 'undefined') {
                data.mensagens.forEach(element => {
                    // let msg = new Mensagem(element);
                    this.mensagens.push(new Mensagem(element));
                });
            }
        }
    }

    public setMensagens = (data: any): void => {
        for (let key in data) {
            this.mensagens.push(new Mensagem({ autor: data[key].autor, mensagem: data[key].mensagem, data: data[key].data, autor_prefeitura: data[key].autor_prefeitura }));
        }
    }

    public setFotos = (data: any): void => {
        for (let key in data) {
            this.fotos.push(new FotoOcorrencia({ fotoURL: data[key].fotoURL, fotoPATH: data[key].fotoPATH }));
        }
    }

}