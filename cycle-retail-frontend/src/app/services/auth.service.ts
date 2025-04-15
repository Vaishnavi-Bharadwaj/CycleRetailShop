import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private apiUrl = 'http://localhost:5001/api/auth'; 
  private apiUrl = 'https://localhost:5001/api/charts'; 

  constructor(private http: HttpClient, private toast: ToastrService) {}
  
  register(username: string, password: string, role: string) {
    const token = this.getToken(); 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    const url = `https://localhost:5001/api/auth/register/${encodeURIComponent(username)}/${encodeURIComponent(password)}/${encodeURIComponent(role)}`;
    return this.http.post<{ token: string }>(url, {}, { headers });
  }

  login(username: string, password: string, role: string) {
    return this.http.post<{ token: string }>(
      `https://localhost:5001/api/auth/login/${encodeURIComponent(username)}/${encodeURIComponent(password)}/${encodeURIComponent(role)}`, 
      {}
    );
  }

  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getEmployees(): Observable<any[]> {
    const token = this.getToken();
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    return this.http.get<any[]>('https://localhost:5001/api/auth/employees', { headers });
  }
  
  getCustomers() {
    return this.http.get<any[]>('https://localhost:5001/api/customers');
  }
  
  logout() {
    localStorage.removeItem('authToken');
    this.toast.success('Logged out successfully', 'Success');
  }

  // Get Monthly Sales Data
  getMonthlySales(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin-dashboard/monthly-sales`);
  }

  // Get Orders by Status Data
  getOrdersByStatus(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin-dashboard/orders-by-status`);
  }

  // Get Top Selling Cycles Data
  getTopSellingCycles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin-dashboard/top-selling-cycles`);
  }

  // Get Inventory Summary Data
  getInventorySummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin-dashboard/inventory-summary`);
  }

  // Get Yearly Revenue Data
  getYearlyRevenue(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin-dashboard/yearly-revenue`);
  }
  
}
