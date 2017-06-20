export class Localizacao {

    public pais: string = '';
    public estado: string = '';
    public uf: string = '';
    public cidade: string = '';
    public bairro: string = '';
    public numero: string = '';
    public rua: string = '';
    public cep: string = '';
    public latitude: number = 0;
    public longitude: number = 0;
    public enderecoCompleto: string = '';

    constructor(private data?: any) {
        if (typeof data !== 'undefined') {
            this.pais = data.coutry || '';
            this.estado = data.adminArea || '';
            // this.uf = data.uf || '';
            this.cidade = data.locality || '';
            this.bairro = data.subLocality || '';
            this.numero = data.subThoroughfare || '';
            this.rua = data.thoroughfare || '';
            this.cep = data.postalCode || '';
            this.latitude = data.position.lat;
            this.longitude = data.position.lng;
            this.enderecoCompleto = data.extra.lines.join(' - ');
        }
    }

}
