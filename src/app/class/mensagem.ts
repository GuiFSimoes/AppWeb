export class Mensagem {

    public autor: string = '';
    public mensagem: string = '';
    public data: string = '';
    public autor_prefeitura: boolean = false;
    public fotoURI: string = '';

    constructor(public dt?: any) {
        if (typeof dt !== 'undefined') {
            this.autor = dt.autor || '';
            this.mensagem = dt.mensagem || '';
            this.data = dt.data || '';
            this.autor_prefeitura = dt.autor_prefeitura || false;
            this.fotoURI = dt.fotoURI || '';
        }
    }
}