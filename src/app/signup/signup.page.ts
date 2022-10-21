import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  private register: FormGroup;

  constructor(
    private _router: Router,
    private formBuilder: FormBuilder) { 

      this.register = this.formBuilder.group({
        name: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required)
      })
    }

  ngOnInit() {
  }

  goToBack() : void {
    this._router.navigate(['/login']);
  }

  RegisterAccount(data: any) {
    console.log({result: data.value, status: data.status})
  }
}
