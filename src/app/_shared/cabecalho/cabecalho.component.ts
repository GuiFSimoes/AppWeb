import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdToolbarModule, MdMenuModule, MdButtonModule } from '@angular/material';

import { Usuario } from '../../class/usuario';
import { AutenticacaoService } from '../../service/autenticacao.service';

@Component({
    selector: 'app-cabecalho',
    templateUrl: './cabecalho.component.html',
    styleUrls: ['./cabecalho.component.css']
})
export class CabecalhoComponent implements OnInit {

    public usuarioLocado = false;
    public usuario: Usuario;

    constructor(private authService: AutenticacaoService,
        private router: Router) {
    }

    ngOnInit() {
        this.usuario = this.authService.usuario();
    }

    logar() {
        this.router.navigate(['']);
    }

    logado(): boolean {
        return this.usuario !== null;
    }

    // abre o perfil do usuário
    perfil() {
        this.router.navigate(['/perfil']);
    }

    logout() {
        this.authService.logout();
    }

}
