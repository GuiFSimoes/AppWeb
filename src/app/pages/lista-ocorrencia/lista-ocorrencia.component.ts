import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-lista-ocorrencia',
    templateUrl: './lista-ocorrencia.component.html',
    styleUrls: ['./lista-ocorrencia.component.css']
})
export class ListaOcorrenciaComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
        this.voltar();
    }

    voltar() {
        this.router.navigate(['']);
    }

}
