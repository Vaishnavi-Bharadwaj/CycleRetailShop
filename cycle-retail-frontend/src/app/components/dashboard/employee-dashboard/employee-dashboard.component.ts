import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent {
  constructor(private router: Router, private authService: AuthService) {}

  navigateTo(route: string) {
    this.router.navigate([`/employee/${route}`]);
  }

  orders() {
    this.router.navigate(['/orders'])
  }

  cycles() {
    this.router.navigate(['/cycle-list'])
  }

  customers() {
    this.router.navigate(['/customers'])
  }
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
