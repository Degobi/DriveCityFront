import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { User } from 'src/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  url = environment.api;

  constructor(private http: HttpClient, private router: Router, private storage: Storage) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  signUp(credentials: { Nome: string, Email: string, Senha: string }): Observable<any> {
    return this.http.post(`${this.url}/usuario`, credentials);
  }

  login(credentials: { Email: string, Senha: string }): Observable<any> {

    return this.http.post(`${this.url}/usuario/token`, credentials)
    .pipe(map((response: { value }) => {

      if (response && response.value.token) {
        const user = {id: response.value.id, token: response.value.token, email: response.value.email, nome: response.value.nome};
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }

      throw new Error('Senha ou Email inválida!');
    }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigateByUrl('/login', { replaceUrl: true })
  }

  saveImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.url}/perfil/imageupload`, formData);
  }

  getEmpresa() {
    return this.http.get(`${this.url}/empresa`)
  }

  getVeiculo() {
    return this.http.get(`${this.url}/veiculo`)
  }

  getUsuarioId(id: number) {
    return this.http.get(`${this.url}/usuario/${id}`)
  }

  postVeiculo(modelo: any): Observable<any> {
    return this.http.post(`${this.url}/veiculo`, modelo);
  }
}
