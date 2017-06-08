import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'format'
})

export class FormatStringPipe implements PipeTransform {
    transform(value: string, args: any[]): string {
        return value.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    }
}
