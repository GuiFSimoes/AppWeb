
export class Usuario {

    // id -> no constructor
    public nome = '';
    public email = '';
    public estado = '';
    public cidade = '';
    public prefeituraKey = '';
    public logo = '';
    public bairro = '';
    public cidadesFavoritas: string[] = new Array;

    constructor(public id?: string, public data?: any) {
        if (typeof data !== 'undefined') {
            this.nome = data.nome || '';
            this.cidade = data.cidade || '';
            this.estado = data.estado || '';
            this.bairro = data.bairro || '';
            this.email = data.email || '';
        }
    }

}
