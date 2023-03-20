import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../../app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  private login: FormGroup;

  constructor(
    private platform: Platform,
    private router: Router,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private apiService: ApiService) {

      this.login = this.formBuilder.group({
        Email: new FormControl('', Validators.required),
        Senha: new FormControl('', Validators.required)
      })
  }

  ngOnInit() {}

  close() : void {
    this.platform.backButton.subscribe( () => {
      navigator['app'].exitApp();
    })
  }

  async SendLogin() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.apiService.login(this.login.value).subscribe(
      async _ => {
        await loading.dismiss();
        this.router.navigateByUrl('/home', { replaceUrl: true })
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Falha ao logar',
          message: res.error.msg,
          buttons: ['OK']
        });

        await alert.present();
      }
    )
  }

}
