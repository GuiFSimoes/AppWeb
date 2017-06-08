import { Component, OnInit } from '@angular/core';
import { MdToolbarModule, MdMenuModule, MdButtonModule } from '@angular/material';

import { Usuario } from '../../class/usuario';

@Component({
    selector: 'app-cabecalho',
    templateUrl: './cabecalho.component.html',
    styleUrls: ['./cabecalho.component.css']
})
export class CabecalhoComponent implements OnInit {

    public usuarioLocado = false;
    public usuario: Usuario = new Usuario();

    constructor() { }

    ngOnInit() {
    }

    logar() {
        this.usuario.nome = 'Teste Login';
        this.usuarioLocado = true;
    }

    logado(): boolean {
        return this.usuarioLocado;
    }

    // abre o perfil do usuário
    perfil() {

    }

    logout() {
        this.usuarioLocado = false;
    }

}
