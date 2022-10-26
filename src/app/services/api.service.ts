import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';


const ACCESS_TOKEN_KEY = 'my-access-token';
const REFRESH_TOKEN_KEY = 'my-refresh-token';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  currentAccessToken = null;
  url = environment.api;

  constructor(private http: HttpClient, private router: Router, private storage: Storage) {
    this.loadToken();
  }

  async loadToken() {
    const token = await this.storage.get(ACCESS_TOKEN_KEY);
    if (token && token.value) {
      this.currentAccessToken = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  getSecretData() {
    return this.http.get(`${this.url}/users/secret`);
  }

  signUp(credentials: {username: any, password: any}): Observable<any> {
    return this.http.post(`${this.url}/users`, credentials);
  }

  login(credentials: {username: any, password: any}): Observable<any> {
    return this.http.post(`${this.url}/login`, credentials).pipe(
      switchMap((tokens: {accessToken, refreshToken }) => {
        this.currentAccessToken = tokens.accessToken;
        const storeAccess = this.storage.set(ACCESS_TOKEN_KEY, tokens.accessToken);
        const storeRefresh = this.storage.set( REFRESH_TOKEN_KEY, tokens.refreshToken);
        return from(Promise.all([storeAccess, storeRefresh]));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }

  logout() {
    return this.http.post(`${this.url}/auth/logout`, {}).pipe(
      switchMap(_ => {
        this.currentAccessToken = null;
        const deleteAccess = this.storage.remove(ACCESS_TOKEN_KEY );
        const deleteRefresh = this.storage.remove(REFRESH_TOKEN_KEY);
        return from(Promise.all([deleteAccess, deleteRefresh]));
      }),
      tap(_ => {
        this.isAuthenticated.next(false);
        this.router.navigateByUrl('/', { replaceUrl: true });
      })
    ).subscribe();
  }
}
