import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, NgModel } from '@angular/forms';
import { MdGridListModule, MdInputModule, MdCheckboxModule, MdButtonModule, MdIconModule, MdSnackBarModule, MdSnackBar } from '@angular/material';

import { AutenticacaoService } from '../../service/autenticacao.service';
import { CadastroService } from '../../service/cadastro.service';
import { UsuarioDALService } from '../../dal/usuario.dal';
import { Usuario } from '../../class/usuario';

import * as firebase from 'firebase';

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

    linkAvatarHomem = 'https://firebasestorage.googleapis.com/v0/b/aloprefeito-151117.appspot.com/o/pagina%2Favatar-male.png?alt=media&token=4742fbab-47c1-4907-92c4-902be1e6a0f5'; // 'assets/img/avatar-male.png';
    linkAvatarMulher = 'https://firebasestorage.googleapis.com/v0/b/aloprefeito-151117.appspot.com/o/pagina%2Favatar-female.png?alt=media&token=ab877c3b-e699-4975-a9c2-1b6bb9d996ba'; // 'assets/img/avatar-female.png';

    registro: boolean;
    dados: any = {
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
        this.avatarPadrao();
    }

    /**
     * avatarPadrao
     */
    public avatarPadrao() {
        // aponta a foto do perfil do usuário para a foto padão do avatar!
        if (this.dados.foto === this.linkAvatarHomem) {
            this.dados.foto = this.linkAvatarMulher;
        } else {
            this.dados.foto = this.linkAvatarHomem;
        }
    }

    /**
     * uploadArquivoAvatar
     */
    public uploadArquivoAvatar(event) {
        // evento para pegar a alteração da imagem!
        let arq = event.srcElement.files[0];
        console.log('Arq sel: ', arq);
        if (arq) {
            this.dados.fotoURI = arq;
            let fr = new FileReader();
            fr.onloadend = () => {
                this.dados.foto = fr.result;
            }
            fr.readAsDataURL(arq);
        }
    }

    public fileInputClick() {
        document.getElementById("fileInput").click();
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

                // verifica se o avatar precisa fazer upload!
                if (!(this.dados.foto === this.linkAvatarHomem || this.dados.foto === this.linkAvatarMulher)) {
                    // fazer upload!!!
                    this.uploadImage(this.dados.fotoURI, _result.uid)
                        .then(_urlFoto => {
                            let dadosUser = {
                                displayName: this.dados.nome,
                                photoURL: _urlFoto
                            };
                            let user = firebase.auth().currentUser;
                            user.updateProfile(dadosUser).then(_ => console.log('Profile do usuário atualizado!'));
                            // guarda as demais informações do usuário no banco!
                            let obj = {
                                nome: this.dados.nome,
                                email: this.dados.email,
                                foto: _urlFoto,
                                cidade: '',
                                estado: '',
                                firebaseID: _result.uid
                            };
                            this.cadastroService.criarUsuario(obj);

                            let usuario = new Usuario();
                            usuario.nome = this.dados.nome;
                            usuario.email = this.dados.email;
                            usuario.logo = _urlFoto;
                            this.authService.setUsuario(usuario);
                            this.snackBar.open(`Olá ${usuario.nome}! Bem vindo ao ClickCidadão.`, 'OK', { duration: 4000 });
                            this.router.navigate(['/listaOcorrencia']);
                        })
                        .catch(_err => {
                            console.log('Falha upload: ', _err);
                            this.snackBar.open(`Poxa... Não conseguimos fazer o upload de sua foto! Por favor, tente novamente!.`, 'OK', { duration: 4000 });
                        });

                } else {
                    let dadosUser = {
                        displayName: this.dados.nome,
                        photoURL: this.dados.foto
                    };
                    _result.auth.updateProfile(dadosUser).then(_ => console.log('Profile do usuário atualizado!'));
                    // guarda as demais informações do usuário no banco!
                    let obj = {
                        nome: this.dados.nome,
                        email: this.dados.email,
                        foto: this.dados.foto,
                        cidade: '',
                        estado: '',
                        firebaseID: _result.uid
                    };
                    this.cadastroService.criarUsuario(obj);

                    let usuario = new Usuario();
                    usuario.nome = this.dados.nome;
                    usuario.email = this.dados.email;
                    usuario.logo = this.dados.foto;
                    this.authService.setUsuario(usuario);
                    this.snackBar.open(`Olá ${usuario.nome}! Bem vindo ao ClickCidadão.`, 'OK', { duration: 4000 });
                    this.router.navigate(['/listaOcorrencia']);
                }

            })
            .catch(_error => {
                console.log('Erro: ' + JSON.stringify(_error));
                this.snackBar.open(`Opa, não pudemos criar login de usuário - ${_error}`, 'OK', { duration: 6000 });
            });

    }

    public uploadImage(file, userID: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let nomeArq = file.name; // nome padrão para o logo das prefeituras
            let pathImage = `/usuarios/${userID}/${nomeArq}`;

            // upload do arquivo
            let imageStorageRef = firebase.storage().ref().child(pathImage);
            let uploadTask = imageStorageRef.put(file);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                _snapshot => { /*console.log('snapshot: ' + _snapshot);*/ },
                _err => { /*console.log('retorno com erro!');*/ reject(_err); },
                () => {
                    // upload completo!
                    resolve(uploadTask.snapshot.downloadURL);
                });
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
        this.authService.setManterLogado(true);
        this.authService.LoginFacebook()
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

    public loginGoogle() {
        this.authService.setManterLogado(true);
        this.authService.LoginGoogle()
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
