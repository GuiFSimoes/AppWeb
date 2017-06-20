import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, NgModel } from '@angular/forms';
import { MdGridListModule, MdInputModule, MdCheckboxModule, MdButtonModule, MdIconModule, MdSnackBarModule, MdSnackBar } from '@angular/material';

import { AutenticacaoService } from '../../service/autenticacao.service';
import { CadastroService } from '../../service/cadastro.service';
import { UsuarioDALService } from '../../dal/usuario.dal';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [
        UsuarioDALService,
        CadastroService,
    ]
})
export class LoginComponent implements OnInit {

    EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    emailFormControl = new FormControl('', [Validators.required, Validators.pattern(this.EMAIL_REGEX)]);

    NOME_REGEX = /^\s*[A-ZÁÉÍÓÚÂÊÔ]{1}[a-zçáéíóúâêôãõ']+((\s[A-ZÁÉÍÓÚÂÊÔa-zçáéíóúâêôãõ']{1}[a-zçáéíóúâêôãõ']{1,3})*(\s[A-ZÁÉÍÓÚÂÊÔ]{1}[a-zçáéíóúâêôãõ']+)+)+\s*$/;
    nomeFormControl = new FormControl('', [Validators.required, Validators.pattern(this.NOME_REGEX)]);

    registro: boolean;
    dados = {
        nome: '',
        email: '',
        senha: '',
        senha_novamente: '',
        manterLogado: false
    }

    constructor(private authService: AutenticacaoService,
        private snackBar: MdSnackBar,
        private cadastroService: CadastroService,
        private router: Router) {
        this.registro = false;
    }

    ngOnInit() {
        if (this.authService.logado()) {
            // usuario logado, direcionar para lista de ocorrencias!
            this.snackBar.open(`Olá ${this.authService.usuario().nome}! Bem vindo ao ClickCidadão.`, 'OK', { duration: 4000 });
            this.router.navigate(['/listaOcorrencia']);
        }
        if (this.authService.getManterLogado()) {
            this.dados.manterLogado = true;
        }
    }

    /**
     * registrar novo usuário com e-mail e senha
     */
    public registrar() {
        // valida as entradas!
        console.log('registrar usuário...');
        if (this.dados.nome === '') {
            document.getElementsByName('nome')[0].focus();
            this.snackBar.open(`Favor entrar com seu nome e sobrenome`, 'OK', { duration: 2000 });
            return;
        }
        if (this.dados.email === '') {
            document.getElementsByName('email')[0].focus();
            this.snackBar.open(`Favor entrar com um e-mail válido`, 'OK', { duration: 2000 });
            return;
        }
        if (this.dados.senha === '' || this.dados.senha_novamente === '') {
            this.snackBar.open(`Favor entrar com a senha de acesso`, 'OK', { duration: 2000 });
            return;
        }
        if (this.dados.senha !== this.dados.senha_novamente) {
            this.snackBar.open(`As senhas devem ser iguais`, 'OK', { duration: 2000 });
            return;
        }

        // registro!!!
        this.authService.criaUsuarioEmail(this.dados.email, this.dados.senha)
            .then(_result => {
                console.log('Usuario criado: ' + JSON.stringify(_result));
                // a sigla da prefeitura do usuário será guardada no campo 'photoURL' em auth firebase
                let dadosUser = {
                    displayName: this.dados.nome,
                    photoURL: ''
                };
                _result.auth.updateProfile(dadosUser).then(_ => console.log('Profile do usuário atualizado!'));
                // guarda as demais informações do usuário no banco!
                let obj = {
                    nome: this.dados.nome,
                    email: this.dados.email,
                    foto: '',
                    cidade: '',
                    estado: '',
                    firebaseID: _result.uid
                };
                this.cadastroService.criarUsuario(obj);
            })
            .catch(_error => {
                console.log('Erro: ' + JSON.stringify(_error));
                this.snackBar.open(`Opa, não pudemos criar login de usuário - ${_error}`, 'OK', { duration: 6000 });
            });

    }

    public loginEmail() {

        // valida as entradas!
        if (this.dados.email === '') {
            document.getElementsByName('email')[0].focus();
            this.snackBar.open(`Favor entrar com um e-mail válido`, 'OK', { duration: 2000 });
            return;
        }
        if (this.dados.senha === '') {
            document.getElementsByName('senha')[0].focus();
            this.snackBar.open(`Favor entrar com a de login`, 'OK', { duration: 2000 });
            return;
        }

        this.authService.setManterLogado(this.dados.manterLogado);

        this.authService.loginEmail(this.dados.email, this.dados.senha)
            .then(_loginResultado => {
                // login com sucesso!
                if (_loginResultado.sucesso) {
                    // redireciona para lista!
                    this.snackBar.open(`Olá ${_loginResultado.usuario.nome}! Bem vindo ao ClickCidadão.`, 'OK', { duration: 4000 });
                    this.router.navigate(['/listaOcorrencia']);
                }
                // falha no login
                else {
                    this.snackBar.open(`${_loginResultado.error}`, 'OK', { duration: 6000 });
                }
            });

    }

    public loginFacebook() {

    }

    public loginGoogle() {

    }

    public esqueciSenha() {
        if (this.dados.email === '') {
            document.getElementsByName('email')[0].focus();
            this.snackBar.open(`Favor entrar com um e-mail válido, para resetar sua senha`, 'OK', { duration: 2000 });
            return;
        }
        this.authService.passwordReset(this.dados.email)
            .then(_ => {
                this.snackBar.open(`Email de reset de senha enviado! Favor verificar sua conta e-mail e seguir as instruções contidas no e-mail.`, 'OK', { duration: 6000 });
            })
            .catch(_err => {
                this.snackBar.open(`Falha no envio do email de reset de senha: ${_err}`, 'OK', { duration: 6000 });
            });
    }
}
