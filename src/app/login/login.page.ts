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
  public login: FormGroup;
  public lembrarCredenciaisForm: FormGroup;

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

      this.lembrarCredenciaisForm = this.formBuilder.group({
        LembrarCredenciais: new FormControl(true)
      });

      const lembrarEmail = localStorage.getItem('lembrarEmail');
      if (lembrarEmail) {
        this.login.patchValue({ Email: lembrarEmail });
        this.lembrarCredenciaisForm.value.LembrarCredenciais = true;
      } else {
        this.lembrarCredenciaisForm.value.LembrarCredenciais = false; 
      }
  }

  ngOnInit() {}

  close() : void {
    this.platform.backButton.subscribe( () => {
      navigator['app'].exitApp();
    })
  }

  async SendLogin() {
    const lembrarCredenciais = this.lembrarCredenciaisForm.value.LembrarCredenciais; 
    const loading = await this.loadingController.create();
    await loading.present();

    if (!this.login.value.Senha.trim().length) {
      await loading.dismiss();
      await this.apiService.exibirToast('Informe a Senha', 'warning');
      return;
    }

    if (!this.login.value.Email.trim().length) {
      await loading.dismiss();
      await this.apiService.exibirToast('Informe o Email', 'warning');
      return;
    }

    if (lembrarCredenciais) {
      localStorage.setItem('lembrarEmail', this.login.value.Email);
    } else {
      localStorage.removeItem('lembrarEmail');
    }

    this.apiService.login(this.login.value).subscribe(
      async _ => {
        await loading.dismiss();
        await this.apiService.exibirToast('Boas Vindas!', 'success');

        this.router.navigateByUrl('/home', { replaceUrl: true })
      },
      async (res) => {
        await loading.dismiss();
        await this.apiService.exibirToast('Erro ao efetuar login', 'warning');

      }
    )
  }

}
