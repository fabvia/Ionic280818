import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers';
import { LoginServiceProvider } from '../../providers/login-service/login-service';
import { Usuario } from '../../shared/user';
import { WelcomePage } from '../welcome/welcome';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account : Usuario = {
    username: '',
    password: '',
    correo: '',
    nombre:'',
    apellido:'',
    facebookId:'',
    admin:false
  }; 

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public loginServiceProvider: LoginServiceProvider) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {
    this.loginServiceProvider.register(this.account).subscribe(
      (usuario) => {
        let datoUsuario={
          username:this.account.username,
          password:this.account.password,
          correo:this.account.correo
        }

        this.loginServiceProvider.login(datoUsuario);
        this.navCtrl.push(WelcomePage);
      },
      (error) => {
        console.log(error);  
      }
    );
  }
}
