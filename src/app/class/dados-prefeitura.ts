export class DadosPrefeitura {

    public nome: string = '';
    public nome_contato: string = '';
    public e_mail: string = '';
    public estado: string = '';
    public cidade: string = '';
    public telefone: string = '';
    public telefone1: string = '';
    public telefone2: string = '';
    public telefone3: string = '';
    public inicio_contrato: string = '';
    public fim_contrato: string = '';
    public logo: string = '';
    public logoPath: string = '';
    public sigla: string = '';
    public inativo: boolean = false;
    public favorita: boolean = false;

    constructor(private data?: any) {
        // this.firstname = data.firstname || '';
        // console.log('constructor de DadosPrefeitura!');
        if (typeof data !== 'undefined') {
            // console.log('data definida!');
            this.nome = data.nome || '';
            this.nome_contato = data.nome_contato || '';
            this.e_mail = data.e_mail || '';
            this.estado = data.estado || '';
            this.cidade = data.cidade || '';
            let listaTelefone = data.telefone || '' !== '' ? data.telefone.split('|') : new Array();
            this.telefone1 = (listaTelefone.length > 0) ? listaTelefone[0] : '';
            this.telefone2 = (listaTelefone.length > 1) ? listaTelefone[1] : '';
            this.telefone3 = (listaTelefone.length > 2) ? listaTelefone[2] : '';
            this.inicio_contrato = data.inicio_contrato || '';
            this.fim_contrato = data.fim_contrato || '';
            this.logo = data.logo || '';
            this.logoPath = data.logoPath || '';
            this.sigla = data.sigla || '';
            this.inativo = data.inativo || '';
        }
    }

}
