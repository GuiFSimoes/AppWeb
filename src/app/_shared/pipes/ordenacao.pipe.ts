import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ordenacao',
    pure: false
})
export class OrdenacaoPipe implements PipeTransform {
    transform(value: Array<any>, campo: string, direcao: boolean): Array<any> {

        // valida a entrada!
        if (typeof value === 'undefined' || value === null || value.length === 0) {
            return value;
        }

        switch (campo) {
            case 'ocorrencia.data_abertura':
                value.sort((a: any, b: any) => {
                    let _a = a.ocorrencia.data_abertura.split(' ')[0].split('/'); // data de entrada formato: dd/mm/aaaa
                    let _a_time = a.ocorrencia.data_abertura.split(' ')[1].split(':');
                    let dt_a = new Date(_a[2], _a[1] - 1, _a[0], _a_time[0], _a_time[1], _a_time[2]);
                    let _b = b.ocorrencia.data_abertura.split(' ')[0].split('/');
                    let _b_time = b.ocorrencia.data_abertura.split(' ')[1].split(':');
                    let dt_b = new Date(_b[2], _b[1] - 1, _b[0], _b_time[0], _b_time[1], _b_time[2]);
                    if (typeof dt_a === 'undefined' && typeof dt_b === 'undefined') { return 0; }
                    if (dt_a === undefined && dt_b !== undefined) { return direcao ? 1 : -1; }
                    if (dt_a !== undefined && dt_b === undefined) { return direcao ? -1 : 1; }
                    if (dt_a === dt_b) { return 0; }
                    return direcao ? (dt_a > dt_b ? -1 : 1) : (dt_b > dt_a ? -1 : 1);
                });
                break;

            case 'data_abertura':
                value.sort((a: any, b: any) => {
                    let _a = a.data_abertura.split(' ')[0].split('/'); // data de entrada formato: dd/mm/aaaa
                    let _a_time = a.data_abertura.split(' ')[1].split(':');
                    let dt_a = new Date(_a[2], _a[1] - 1, _a[0], _a_time[0], _a_time[1], _a_time[2]);
                    let _b = b.data_abertura.split(' ')[0].split('/');
                    let _b_time = b.data_abertura.split(' ')[1].split(':');
                    let dt_b = new Date(_b[2], _b[1] - 1, _b[0], _b_time[0], _b_time[1], _b_time[2]);
                    if (typeof dt_a === 'undefined' && typeof dt_b === 'undefined') { return 0; }
                    if (dt_a === undefined && dt_b !== undefined) { return direcao ? 1 : -1; }
                    if (dt_a !== undefined && dt_b === undefined) { return direcao ? -1 : 1; }
                    if (dt_a === dt_b) { return 0; }
                    return direcao ? (dt_a > dt_b ? -1 : 1) : (dt_b > dt_a ? -1 : 1);
                });
                break;

            case 'dataFimContrato':
                value.sort((a: any, b: any) => {
                    let _a = a.fim_contrato.split('/'); // data de entrada formato: dd/mm/aaaa
                    let dt_a = new Date(_a[2], _a[1] - 1, _a[0]);
                    let _b = b.fim_contrato.split('/');
                    let dt_b = new Date(_b[2], _b[1] - 1, _b[0]);
                    if (typeof dt_a === 'undefined' && typeof dt_b === 'undefined') { return 0; }
                    if (dt_a === undefined && dt_b !== undefined) { return direcao ? 1 : -1; }
                    if (dt_a !== undefined && dt_b === undefined) { return direcao ? -1 : 1; }
                    if (dt_a === dt_b) { return 0; }
                    return direcao ? (dt_a > dt_b ? -1 : 1) : (dt_b > dt_a ? -1 : 1);
                });
                break;

            case 'cidadeEstado':
                value.sort((a: any, b: any) => {
                    let _a = a['cidade'] + '/' + a['estado'];
                    let _b = b['cidade'] + '/' + b['estado'];
                    if (typeof _a === 'undefined' && typeof _b === 'undefined') { return 0; }
                    if (_a === undefined && _b !== undefined) { return direcao ? 1 : -1; }
                    if (_a !== undefined && _b === undefined) { return direcao ? -1 : 1; }
                    if (_a === _b) { return 0; }
                    return direcao ? (_a.toString().toLowerCase() > _b.toString().toLowerCase() ? -1 : 1)
                        : (_b.toString().toLowerCase() > _a.toString().toLowerCase() ? -1 : 1);
                });
                break;

            default:
                // console.log(direcao);
                value.sort((a: any, b: any) => {
                    let _a = a[campo];
                    let _b = b[campo];
                    if (typeof _a === 'undefined' && typeof _b === 'undefined') { return 0; }
                    if (_a === undefined && _b !== undefined) { return direcao ? 1 : -1; }
                    if (_a !== undefined && _b === undefined) { return direcao ? -1 : 1; }
                    return direcao ? _a.localeCompare(_b, 'pt-BR') : _b.localeCompare(_a, 'pt-BR');
                });
                break;
        }

        return value;
    }
}
