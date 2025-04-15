import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent {
  employees: any[] = [];

  constructor(private authService: AuthService, private toast:ToastrService, private http: HttpClient) {}

  ngOnInit(): void {
    this.authService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (err) => {
        console.error("Failed to fetch employees", err);
      }
    });
  }

  deleteEmployee(id: number) {
      const url = `https://localhost:5001/api/auth/delete/${id}`;
  
      const token = this.authService.getToken(); // use service to get token
      if (!token) {
        console.error('No token found! User might not be logged in.');
        this.toast.error('User not authenticated!', 'Error');
        return;
      }
  
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      this.http.delete(url, { headers, responseType: 'text' }).subscribe({
        next: (response) => {
          this.toast.success('Employee deleted successfully!', 'Success');
          this.employees = this.employees.filter(emp => emp.id !== id);
        },
        error: (error) => {
          console.error('Error deleting the employee', error);
          this.toast.error('Failed to delete the employee!', 'Error');
        }
      });
  }
}
