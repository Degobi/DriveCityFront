import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private apiService: ApiService, private router: Router) { }

  canLoad(): Observable<boolean> {
    return this.apiService.isAuthenticated.pipe(
      filter(val => val !== null), 
      map(isAuthenticated => {

        if (isAuthenticated) {
          return true;
        }

        this.router.navigateByUrl('/')
        return false;
        
      })
    );
  }
}