import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { UsuarioDALService } from '../dal/usuario.dal';
import { Usuario } from '../class/usuario';
import { FormatStringPipe } from '../_shared/pipes/filtro-string.format.pipe';

// Acesso ao banco direto com o firebase
import * as firebase from 'firebase/app';

@Injectable()
export class AutenticacaoService {

    user: Observable<firebase.User>;
    public usuario(): Usuario {
        return this.getUserInfo();
    }
    public setUsuario(user: Usuario): void {
        this.setUserInfo(user);
    }

    public setManterLogado(value: boolean) {
        localStorage.setItem('manterLogado', JSON.stringify(value));
    }
    public getManterLogado(): boolean {
        let m = localStorage.getItem('manterLogado');
        return (m !== undefined) ? JSON.parse(m) : false;
    }

    public logado(): boolean {
        let logado = localStorage.getItem('isLoggedIn') || sessionStorage.getItem('isLoggedIn');
        if (logado !== undefined) {
            return JSON.parse(logado);
        }
        return false;
    }
    private setLogado(isLoggedIn: boolean) {
        if (this.getManterLogado()) {
            localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
            sessionStorage.removeItem('isLoggedIn');
        } else {
            sessionStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
            localStorage.removeItem('isLoggedIn');
        }
    }

    constructor(private afAuth: AngularFireAuth,
        private router: Router,
        private userDALService: UsuarioDALService,
        private format: FormatStringPipe) {
        this.user = afAuth.authState;
    }

    // Login do usuário
    public loginEmail(email: string, password: string): Promise<any> {

        return new Promise((resolve, reject) => {
            this.afAuth.auth.signInWithEmailAndPassword(email, password)
                .then((result) => {
                    // logado!
                    console.log('Sucesso login ' + result.email);
                    let usuario = new Usuario();
                    usuario.email = result.email;
                    // -> as informações de nome de usuário vem da autenticação
                    usuario.nome = result.displayName;

                    this.userDALService.getMobileUser(usuario.email)
                        .then(_usuario => {
                            usuario.logo = _usuario.foto || '';
                            usuario.estado = _usuario.estado || '';
                            usuario.cidade = _usuario.cidade || '';
                            usuario.bairro = _usuario.bairro || '';
                            usuario.perfil = _usuario.perfil || '';

                            // salva o usuário na sessão!
                            this.setUserInfo(usuario);
                            this.setLogado(true);
                            resolve({ sucesso: true, usuario: usuario });
                        })
                        .catch(_ => {
                            // falha recuperar informações de usuário!
                            let msgErro = `Poxa, parece que seu e-mail '${email}' não está cadastrado no ClickCidadão, favor corrigir ou cadastrar!`
                            console.log('Falha login, usuário não localizado na banco!');
                            resolve({ sucesso: false, error: msgErro });
                        });
                })
                .catch((error) => {
                    // falha login!
                    console.log('Falha login: ' + error.message);
                    let dataErr = {
                        code: '', message: ''
                    };
                    let msgErro = '';
                    dataErr = JSON.parse(JSON.stringify(error));
                    if (dataErr.code === 'auth/user-not-found') {
                        console.log('Falha login: ' + error.message);
                        msgErro = `Poxa, parece que seu e-mail '${email}' não está cadastrado no ClickCidadão, favor corrigir ou cadastrar!`
                    } else if (dataErr.code === 'auth/wrong-password') {
                        console.log('Falha login: ' + error.message);
                        msgErro = `Opa, parece que você entrou com a senha incorreta, favor corrigir e tentar novamente!`
                    }
                    this.setLogado(false);
                    this.removeUserInfo();

                    resolve({ sucesso: false, error: msgErro });
                });
        });

    }

    public updateProfile(nome: string, fotoURL: string): firebase.Promise<any> {
        return this.afAuth.auth.currentUser.updateProfile({ displayName: nome, photoURL: fotoURL });
    }

    // Logout da aplicação
    public logout(): void {
        // console.log('Saindo da aplicação!');
        this.afAuth.auth.signOut();
        this.setLogado(false);
        this.removeUserInfo();
        this.router.navigate(['/']);
    }

    public criaUsuarioEmail(email: string, password: string): firebase.Promise<any> {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
        // return this.af.auth.createUser({ email: email, password: password });
    }

    // envia o email de reset de senha!
    public passwordReset(email: string): firebase.Promise<any> {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }

    /*    public reautenticacaoUsuario(senhaAtual: string): firebase.Promise<any> {
            let credenciais = firebase.auth.EmailAuthProvider.credential(this.getUserInfo().email, senhaAtual);
            return firebase.auth().currentUser.reauthenticate(credenciais);
        }
    */
    public atualizaSenhaUsuario(novaSenha: string): firebase.Promise<any> {
        return firebase.auth().currentUser.updatePassword(novaSenha);
    }

    private setUserInfo(user: Usuario) {
        if (this.getManterLogado()) {
            localStorage.setItem('userInfo', JSON.stringify(user));
            sessionStorage.removeItem('userInfo');
        } else {
            sessionStorage.setItem('userInfo', JSON.stringify(user));
            localStorage.removeItem('userInfo');
        }
    }
    private getUserInfo(): Usuario {
        let userInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
        if (userInfo !== undefined) {
            return JSON.parse(userInfo);
        }
        return null;
    }

    private removeUserInfo() {
        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('userInfo');
        localStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('isLoggedIn');
    }

}