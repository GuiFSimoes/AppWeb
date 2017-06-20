export class AssuntoOcorrencia {

    // id => contructor
    public descricao: string = '';
    public logo: string = '';
    public secretaria: string = '';
    public tipo: string = '';
    public inativo: boolean = false;

    constructor(public id: string = '', private data?: any) {
        if (typeof data !== 'undefined') {
            this.descricao = data.descricao || '';
            this.logo = data.logo || '';
            this.secretaria = data.secretaria || '';
            this.tipo = data.tipo || '';
        }
    }
}
