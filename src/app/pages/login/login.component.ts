import { Component, OnInit } from '@angular/core';
// import { DomSanitizer } from '@angular/platform-browser';
import { MdGridListModule, MdInputModule, MdCheckboxModule, MdButtonModule, MdIconModule/*, MdIconRegistry*/ } from '@angular/material';

import { AutenticacaoService } from '../../service/autenticacao.service';
import { UsuarioDAL } from '../../dal/usuario.dal';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [
        UsuarioDAL,
    ]
})
export class LoginComponent implements OnInit {

    registro: boolean;

    constructor(private authService: AutenticacaoService) {
        this.registro = false;
    }

    ngOnInit() {
    }

    /**
     * registrar novo usuário com e-mail e senha
     */
    public registrar() {

    }

    public login(origem: string) {

    }

}
