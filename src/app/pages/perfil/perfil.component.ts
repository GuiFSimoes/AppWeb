import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, NgModel } from '@angular/forms';
import { MdGridListModule, MdInputModule, MdCheckboxModule, MdButtonModule, MdIconModule, MdSnackBarModule, MdSnackBar } from '@angular/material';

import { AutenticacaoService } from '../../service/autenticacao.service';
import { UsuarioDALService } from '../../dal/usuario.dal';

@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.css'],
    providers: [
        UsuarioDALService,
    ]
})
export class PerfilComponent implements OnInit {

    dados = {
        email: '',
        senha: '',
        manterLogado: false
    }

    constructor(private authService: AutenticacaoService,
        private snackBar: MdSnackBar,
        private router: Router) {
    }

    ngOnInit() {

    }


}
