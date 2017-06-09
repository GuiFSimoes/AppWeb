import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-nova-ocorrencia',
    templateUrl: './nova-ocorrencia.component.html',
    styleUrls: ['./nova-ocorrencia.component.css']
})
export class NovaOcorrenciaComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
        this.voltar();
    }

    voltar() {
        this.router.navigate(['']);
    }

}
