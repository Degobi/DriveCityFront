import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../app/services/api.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  file: File | null = null;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {

  }

  onFileSelected(event: any): void {
    this.file = event.target.files[0];
  }

  goToBack() : void {
    this.router.navigate(['/home']);
  }

  editProfile() {
    console.log('aqui')
  }

  onSubmit(): void {
    if (!this.file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.file);

    this.apiService.saveImage(formData).subscribe(
      () => alert('Upload successful'),
      error => console.error(error)
    );
  }

}