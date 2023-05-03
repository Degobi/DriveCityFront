import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private apiService: ApiService, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const currentUser = this.apiService.currentUserValue;

    const tokenExpirationDate: Date = currentUser != null ? this.getTokenExpiration(currentUser.token) : new Date(-1);
    console.log(`Token expirará em ${tokenExpirationDate}`)
    
    if (tokenExpirationDate && tokenExpirationDate < new Date()) {
      this.router.navigate(['/login']);
    }
    

    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }
    return next.handle(request);
  }

  getTokenExpiration(token: string): Date {
    const dados: any = jwtDecode(token);
    return new Date(dados.exp * 1000);
  }
}