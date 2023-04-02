import { Component, OnInit  } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { IonModal } from '@ionic/angular';


@Component({
  selector: 'app-modal-enterprise',
  templateUrl: './modal-enterprise.page.html',
  styleUrls: ['./modal-enterprise.page.scss'],
})
export class ModalEnterprisePage implements OnInit {
  modal: IonModal;
  myData: any;

  constructor(private navParams: NavParams) { 
    this.myData = this.navParams.get('data');
  }

  ngOnInit() {
    console.log("DADOS DO MODAL",this.myData);
  }


  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(null, 'confirm');
  }
}
