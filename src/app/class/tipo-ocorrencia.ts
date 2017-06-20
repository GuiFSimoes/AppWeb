export class TipoOcorrencia {

    // id -> definido no constructor
    public descricao: string = '';
    public inativo: boolean = false;

    constructor(public id?: string, data?: any) {
        if (typeof data !== 'undefined') {
            this.descricao = data.descricao || '';
            this.inativo = data.inativo || false;
        }
    }

}
