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

  public register: FormGroup;

  constructor(
    private platform: Platform,
    private router: Router,
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private apiService: ApiService,
    private loginPage: LoginPage) { 

      this.register = this.formBuilder.group({
        Nome: new FormControl('', Validators.minLength(1)),
        Email: new FormControl('', Validators.required),
        Senha: new FormControl('', Validators.required)
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

    if (this.register.status == 'INVALID') {
      await loading.dismiss();
      await this.apiService.exibirToast('Preencha todos os campos!', 'warning');
      return;
    }

    if (!this.register.value.Nome.trim().length) {
      await loading.dismiss();
      await this.apiService.exibirToast('Informe o Nome', 'warning');
      return;
    }
    
    if (!this.register.value.Email.trim().length) {
      await loading.dismiss();
      await this.apiService.exibirToast('Informe o Email', 'warning');

      return;
    }

    if (!this.register.value.Senha.trim().length) {
      await loading.dismiss();
      await this.apiService.exibirToast('Informe a Senha', 'warning');

      return;
    }

    this.apiService.signUp(this.register.value).subscribe(
      async _ => {
        await loading.dismiss();
        this.apiService.login(this.register.value).subscribe(
          async _ => {
            await loading.dismiss();
            await this.apiService.exibirToast('Login efetuado', 'success');

            this.router.navigateByUrl('/home', { replaceUrl: true })
          },
          async (res) => {
            await loading.dismiss();
            await this.apiService.exibirToast('Erro ao efetuar login', 'warning');

          }
        );
      },
      async (res) => {
        await loading.dismiss();
        await this.apiService.exibirToast('Falaha ao criar conta!', 'warning');

      }
    );
  }

}
