import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { ApiService } from '../services/api.service';
import {
  catchError,
  finalize,
  switchMap,
  filter,
  take,
} from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  isRefreshingToken = false;

  constructor(private apiService: ApiService, private toastCtrl: ToastController) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.isInBlockedList(request.url)) {
      return next.handle(request);
    } else {
        return next.handle(this.addToken(request)).pipe()
    }
  }

  private isInBlockedList(url: string): Boolean {
    if (url == `${environment.api}/auth` ||
      url == `${environment.api}/auth/logout`) {
      return true;
    } else {
      return false;
    }
  }

  private addToken(req: HttpRequest<any>) {
    if (this.apiService.currentAccessToken) {
      return req.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.apiService.currentAccessToken}`
        })
      });
    } else {
      return req;
    }
  }
}