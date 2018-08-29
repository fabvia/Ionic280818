

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../shared/config';
import { Observable } from 'rxjs/Observable';
import { Usuario } from '../../shared/user';
import { ToastController } from 'ionic-angular';
import { Events } from 'ionic-angular';

interface AuthResponse {
  status: string,
  success: string,
  token: string
};

interface JWTResponse {
  status: string,
  success: string,
  user: any
};

@Injectable()
export class LoginServiceProvider {

  tokenKey: string = 'JWT';
  isAuthenticated: boolean = false;
  username: string;
  authToken: string = undefined;
  constructor(public http: HttpClient, 
    private toastController:ToastController,
    public events: Events) {
    this.loadUserCredentials();
    
    events.subscribe('usuario:logeado', (username, time) => {
      let toast = this.toastController.create({
        message: 'Bienvenido ' + username,
        duration: 4000,
        position: 'top'
      });

      toast.present();
    });
  }

  private loadUserCredentials() {
    let credentials = JSON.parse(localStorage.getItem('TOKEN') || '{}');
  
    if (credentials) {
      if (credentials.token != undefined) {
        this.isAuthenticated = true;
      }
    } else
      console.log('Revisar!! no guarda usuario')
  }
  private storeUserCredentials(credentials) {
    localStorage.setItem('TOKEN', JSON.stringify(credentials));
    this.useCredentials(credentials);
  }
  private useCredentials(credentials) {
    this.isAuthenticated = true;
    this.username = credentials.usuario;
  }
  private destroyUserCredentials() {
    this.username = '';
    this.isAuthenticated = false;
    this.authToken = undefined;
    localStorage.removeItem('TOKEN');
  }
  logout() {

    this.destroyUserCredentials();
  }

  register(userData:Usuario){
    return this.http.post(baseUrl+'usuario/signup',userData);
  }

  login(userData){
    this.http.post<AuthResponse>(baseUrl+'usuario/login',userData).subscribe(
      (usuario) => {        
        let newCredentials={
          username:userData.username,
          token:usuario.token
        }

        this.storeUserCredentials(newCredentials);

        return true;
      },
      (error) => {        
        let toast = this.toastController.create({
          message: 'Error al logear el usuario',
          duration: 3000,
          position: 'top'
        }); 
        toast.present();
        return false;
      }
    );
  }

  IsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  //aun no se guarda el username.
  getUsername() {
    return this.username;
  };

  logOutFunction() {
    this.destroyUserCredentials();
  };
}