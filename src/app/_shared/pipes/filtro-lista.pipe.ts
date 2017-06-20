import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirebaseListObservable } from 'angularfire2/database';

@Pipe({
    name: 'filtroLista',
    pure: false
})
export class FiltroListaPipe implements PipeTransform {
    public transform(value: Array<any>, chave: string, filtroValor?: string): Array<any[]> {

        // valida a entrada!
        if (typeof filtroValor === 'undefined' || filtroValor === '' || filtroValor === 'todos') {
            return value;
        }
        if (typeof value === 'undefined' || value === null || value.length === 0) {
            return value;
        }

        /*console.log('Chave: ' + chave + ' /tipo de entrada: ' + (typeof value));
        console.log('filtroValor: "' + filtroValor + '" /tipo de filtroValor: ' + (typeof filtroValor));
        console.log('Lista: ' + JSON.stringify(value));*/
        // filtra a lista de entrada!
        switch (chave) {
            case 'nome':
                return value.filter(item => {
                    // console.log('item filter ' + JSON.stringify(item) + ' tam: ' + item.length);
                    return (item.nome.toLowerCase().indexOf(filtroValor.toLowerCase()) !== -1);
                });
            case 'ocorrencia.protocolo':
                return value.filter(item => {
                    // console.log('item filter ' + JSON.stringify(item) + ' tam: ' + item.length);
                    return (item.ocorrencia.protocolo.toLowerCase().indexOf(filtroValor.toLowerCase()) !== -1);
                });
            case 'dados.nome':
                return value.filter(item => {
                    // console.log('item filter ' + JSON.stringify(item) + ' tam: ' + item.length);
                    return (item.dados.nome.toLowerCase().indexOf(filtroValor.toLowerCase()) !== -1);
                });
            case 'descricao':
                return value.filter(item => {
                    // console.log('item filter ' + JSON.stringify(item) + ' tam: ' + item.length);
                    return (item.descricao.toLowerCase().indexOf(filtroValor.toLowerCase()) !== -1);
                });
            case 'titulo':
                return value.filter(item => {
                    // console.log('item filter ' + JSON.stringify(item) + ' tam: ' + item.length);
                    return (item.titulo.toLowerCase().indexOf(filtroValor.toLowerCase()) !== -1);
                });
            case 'secretaria':
                return value.filter(item => {
                    // console.log('item filter ' + JSON.stringify(item) + ' tam: ' + item.length);
                    return (item.secretaria.toLowerCase() === filtroValor.toLowerCase());
                });
            case 'perfil':
                return value.filter(item => {
                    // console.log('item filter ' + JSON.stringify(item) + ' tam: ' + item.length);
                    return (item.perfil.toLowerCase() === filtroValor.toLowerCase());
                });
            case 'bairro':
                return value.filter(item => {
                    // console.log('item filter ' + JSON.stringify(item) + ' tam: ' + item.length);
                    if (filtroValor === 'sem_bairros') {
                        return (typeof item.bairro === 'undefined' || item.bairro === '');
                    } else if (typeof item.bairro === 'undefined') {
                        return false;
                    }
                    return (item.bairro.toLowerCase() === filtroValor.toLowerCase());
                });
            case 'tipo_descricao':
                return value.filter(item => {
                    // console.log('item filter ' + JSON.stringify(item) + ' tam: ' + item.length);
                    return (item.tipo_descricao.toLowerCase() === filtroValor.toLowerCase());
                });
            case 'tipo':
                return value.filter(item => {
                    // console.log('item filter ' + JSON.stringify(item) + ' tam: ' + item.length);
                    return (item.tipo.toLowerCase() === filtroValor.toLowerCase());
                });
            case 'assunto_descricao':
                return value.filter(item => {
                    // console.log('item filter ' + JSON.stringify(item) + ' tam: ' + item.length);
                    return (item.assunto_descricao.toLowerCase() === filtroValor.toLowerCase());
                });
            case 'status':
                return value.filter(item => {
                    // console.log('item filter ' + JSON.stringify(item) + ' tam: ' + item.length);
                    return (item.status.toLowerCase() === filtroValor.toLowerCase());
                });
            case 'ocorrencia.status':
                return value.filter(item => {
                    // console.log('item filter ' + JSON.stringify(item) + ' tam: ' + item.length);
                    return (item.ocorrencia.status.toLowerCase() === filtroValor.toLowerCase());
                });
            case 'dados.inativo':
                return value.filter(item => {
                    // console.log('item filter ' + JSON.stringify(item) + ' tam: ' + item.length);
                    return (filtroValor === 'ativos' ? !item.dados.inativo : item.dados.inativo);
                });
            case 'secretaria_descricao':
                return value.filter(item => {
                    // console.log('item filter ' + JSON.stringify(item) + ' tam: ' + item.length);
                    return (item.secretaria_descricao.toLowerCase() === filtroValor.toLowerCase());
                });
            case 'dados.estado':
                return value.filter(item => {
                    // console.log('item filter ' + JSON.stringify(item) + ' tam: ' + item.length);
                    return (item.dados.estado.toLowerCase() === filtroValor.toLowerCase());
                });

            default:
                return value;
        }

    }
}
