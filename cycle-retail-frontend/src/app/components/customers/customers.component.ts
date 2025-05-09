import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Toast, ToastrService } from 'ngx-toastr';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit{
  customers: any[] = [];
  customerId!: number;
  customerName!: string;
  customerEmail!: string;
  customerPhone!: string;
  role: string = '';
  editCustomer: any=null;
  constructor(private http: HttpClient, private authService: AuthService, private toast: ToastrService) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.fetchCustomers();
  }

  getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  fetchCustomers() {
    const headers = this.getHeaders();
    this.http.get<any[]>('https://localhost:5001/api/customers', { headers })
      .subscribe(data => this.customers = data);
  }

  addCustomers() {
    const headers = this.getHeaders();
    const url = `https://localhost:5001/api/customers/create/${this.customerName}/${this.customerEmail}/${this.customerPhone}`;
    this.http.post(url, null, { headers, responseType: 'text'}).subscribe({
      next: () => {
        this.toast.success('Customer added successfully!', 'Success');
        this.fetchCustomers();
      },
      error: () => this.toast.error('Error adding customer', 'Error')
    });
  }

  updateDetails(cusomter: Customer) {
    const headers = this.getHeaders();
    const url =  `https://localhost:5001/api/customers/update/${cusomter.id}/${cusomter.name}/${cusomter.email}/${cusomter.phone}`
    this.http.put(url, null, { headers }).subscribe({
      next: (response) => {
        this.toast.success('Customer details updated successfully!', 'Success');
        this.fetchCustomers();
      },
      error: (error) => {
        this.toast.error('Failed to update customer details!', 'Error');
      }
    }) 
  }

  editingCustomer(customer: any) {
    // Create a copy so cancel won't affect original
    this.editCustomer = { ...customer };
  }

  saveCustomer() {
    this.updateDetails(this.editCustomer); 
    this.editCustomer = null;
  }

  cancelCustomer() {
    this.editCustomer = null;
  }

}
