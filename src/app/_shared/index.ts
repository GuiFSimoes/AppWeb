import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// loading spinner
// import { BusyModule } from 'angular2-busy';

import { CabecalhoComponent } from './cabecalho/cabecalho.component';

import { FormatStringPipe } from './pipes/filtro-string.format.pipe';
import { OrdenacaoPipe } from './pipes/ordenacao.pipe';

import { EqualValidatorDirective } from './directive/equal-validator.directive';

@NgModule({
    declarations: [
        FormatStringPipe,
        OrdenacaoPipe,
        CabecalhoComponent,
        EqualValidatorDirective,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule,
    ],
    exports: [
        CabecalhoComponent,
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        JsonpModule,
        FormatStringPipe,
        OrdenacaoPipe,
        MaterialModule,
        BrowserAnimationsModule,
    ],
    providers: []
})
export class AppSharedModule { }
