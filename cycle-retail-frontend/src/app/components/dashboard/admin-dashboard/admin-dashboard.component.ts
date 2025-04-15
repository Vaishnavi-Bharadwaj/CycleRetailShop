import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  constructor(private router: Router, private authService: AuthService) {}

  navigateTo(route: string) {
    this.router.navigate([`/admin/${route}`]);
  }

  orders() {
    this.router.navigate(['/orders'])
  }

  cycles() {
    this.router.navigate(['/cycle-list'])
  }

  registerUser() {
    this.router.navigate(['/register']); 
  }

  employees() {
    this.router.navigate(['/employees']);
  }

  customers() {
    this.router.navigate(['/customers'])
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
}
