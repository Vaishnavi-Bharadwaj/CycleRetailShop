import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private toast:ToastrService) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    
    if (!token) {
      this.router.navigate(['/login']);
      this.toast.warning('Please login to access the dashboard', 'Warning');
      return false;
    }
  
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const expiry = tokenPayload.exp;
    const now = Math.floor(new Date().getTime() / 1000);
  
    if (expiry < now) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }
  
    return true;
  }
  
}
