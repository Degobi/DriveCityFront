import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../../app/services/api.service';
import { Router } from '@angular/router';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  private register: FormGroup;

  constructor(
    private platform: Platform,
    private router: Router,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private apiService: ApiService,
    private loginPage: LoginPage) { 

      this.register = this.formBuilder.group({
        name: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      })
    }

  ngOnInit() {
  }

  goToBack() : void {
    this.router.navigate(['/login']);
  }

  async RegisterAccount() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.apiService.signUp(this.register.value).subscribe(
      async _ => {
        await loading.dismiss();
        this.loginPage.SendLogin();
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Falha ao criar conta!',
          message: res.error.msg,
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }

}
