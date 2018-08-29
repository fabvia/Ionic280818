import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, Nav } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
import { Usuario } from '../../shared/user';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { Validators } from '@angular/forms';
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account:{username:string, password:string} ={
    username: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public loginServiceProvider:LoginServiceProvider,
    public events: Events) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    this.loginServiceProvider.login(this.account);
    if(this.loginServiceProvider.IsAuthenticated())
    {
      this.events.publish('usuario:logeado', this.account.username, Date.now());
      this.navCtrl.push(MainPage);
    }
  }
}
