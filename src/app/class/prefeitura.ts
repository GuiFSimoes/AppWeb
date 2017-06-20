import { DadosPrefeitura } from './dados-prefeitura';
import { TipoOcorrencia } from './tipo-ocorrencia';
import { AssuntoOcorrencia } from './assunto-ocorrencia';

export class Prefeitura {

    public dados: DadosPrefeitura;
    public assuntos: Array<AssuntoOcorrencia> = new Array<AssuntoOcorrencia>();
    public tipos: Array<TipoOcorrencia> = new Array<TipoOcorrencia>();
    // public bairros: Array<any>;

    constructor(private data?: any) {
        // Dados da prefeitura
        if (typeof data !== 'undefined') {
            // dados básicos da prefeitura
            this.dados = new DadosPrefeitura(data);
        }
    }

    public setListaTipo = (data: any): void => {
        for (let key in data) {
            if (data[key].inativo !== true) {
                this.tipos.push(new TipoOcorrencia(key, data[key]));
            }
        }
    }

    public setListaAssunto = (data: any): void => {
        for (let key in data) {
            if (data[key].inativo !== true) {
                this.assuntos.push(new AssuntoOcorrencia(key, data[key]));
            }
        }
    }

}
