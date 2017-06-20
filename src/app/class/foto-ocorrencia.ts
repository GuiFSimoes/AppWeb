export class FotoOcorrencia {

    public source: string = '';
    public fotoURL: string = '';
    public fotoPATH: string = '';
    public fotoURI: any;
    public latitude: number = 0;
    public longitude: number = 0;
    public endereco: string = '';
    public date: string = '';

    constructor(public data?: any) {
        if (typeof data !== 'undefined') {
            this.fotoURL = data.fotoURL;
            this.fotoPATH = data.fotoPATH;
            this.latitude = data.latitude;
            this.longitude = data.longitude;
            this.source = data.source;
            this.date = data.date;
        }
    }
}