import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MdToolbarModule, MdMenuModule, MdButtonModule } from '@angular/material';

import { Usuario } from '../../class/usuario';
import { AutenticacaoService } from '../../service/autenticacao.service';

@Component({
    selector: 'app-cabecalho',
    templateUrl: './cabecalho.component.html',
    styleUrls: ['./cabecalho.component.css']
})
export class CabecalhoComponent implements OnInit, OnChanges {

    public usuarioLocado = false;
    public usuario: Usuario;

    constructor(public authService: AutenticacaoService,
        private router: Router) {
    }

    ngOnInit() {
        this.usuario = this.authService.usuario();
    }

    ngOnChanges(changes: SimpleChanges) {
        //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
        //Add 'implements OnChanges' to the class.
        this.usuario = this.authService.usuario();
    }

    logar() {
        this.router.navigate(['']);
    }

    logado(): boolean {
        return this.authService.logado(); // this.usuario !== null;
    }

    // abre o perfil do usuário
    perfil() {
        this.router.navigate(['/perfil']);
    }

    logout() {
        this.authService.logout();
    }

}
