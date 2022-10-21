import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  private login: FormGroup;

  constructor(
    private platform: Platform,
    private formBuilder: FormBuilder) {

      this.login = this.formBuilder.group({
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      })
  }

  ngOnInit() {}

  close() : void {
    this.platform.backButton.subscribe( () => {
      navigator['app'].exitApp();
    })
  }

  SendLogin(login: any) {
    console.log({result: login.value, status: login.status});
  }
}
