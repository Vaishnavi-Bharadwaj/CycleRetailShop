import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})

export class OrderListComponent implements OnInit {
  orders: any[] = [];
  customers: any[] = [];
  cycleId!: number;
  quantity!: number;
  customerId: number | null = null;
  statusUpdate: { [key: number]: string } = {};
  role: string = '';

  statusPriority: { [key: string]: number } = {
    'Pending': 1,
    'Approved': 2,
    'Shipped': 3,
    'Delivered': 4
  };
  
  constructor(private http: HttpClient, private authService: AuthService, private toast: ToastrService, private cartService:AuthService, private router:Router) {}

  ngOnInit() {
    this.role = localStorage.getItem('role') || '';
    this.loadCustomers();
    this.fetchOrders();
  }

  getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadCustomers() {
    this.authService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (err) => {
        console.error('Failed to fetch customers:', err);
      }
    });
  }

  fetchOrders() {
    const headers = this.getHeaders();
    this.http.get<any[]>('https://localhost:5001/api/orders', { headers })
      .subscribe({
        next: (data) => {
          this.orders = data;
          this.statusUpdate = {}; // Clear previous status
          for (let order of this.orders) {
            this.statusUpdate[order.id] = order.status; // Set initial value
          }
        },
        error: err => this.toast.error('Failed to load orders', 'Error')
      });
  }

  placeOrder() {
    const headers = this.getHeaders();
    const url = `https://localhost:5001/api/orders/create/${this.cycleId}/${this.quantity}/${this.customerId}`;
    this.http.post(url, null, { headers, responseType: 'text' }).subscribe({
      next: () => {
        this.toast.success('Order placed!', 'Success');
        this.fetchOrders();
      },
      error: () => this.toast.error('Error placing order', 'Error')
    });
  }

  updateStatus(orderId: number) {
    const headers = this.getHeaders();
    const newStatus = this.statusUpdate[orderId];
    const url = `https://localhost:5001/api/orders/update/${orderId}/${newStatus}`;
    this.http.put(url, null, { headers, responseType: 'text' }).subscribe({
      next: () => {
        this.toast.success('Order updated!', 'Success');
        this.fetchOrders();
      },
      error: () => this.toast.error('Update failed', 'Error')
    });
  }

  deleteOrder(id: number, cycleId: number, quantity: number) {
    const headers = this.getHeaders();
    const url = `https://localhost:5001/api/orders/delete/${id}?cycleId=${cycleId}&quantity=${quantity}`;
    this.http.delete(url, { headers, responseType: 'text' }).subscribe({
      next: () => {
        this.toast.success('Order deleted', 'Success');
        this.fetchOrders();
      },
      error: (err) => {
        console.error('Delete failed:', err);
        this.toast.error('Delete failed', 'Error');
      }
    });
  }

  addToCart(order: any) {
    const cartItem = {
      cycleId: order.cycleId,
      quantity: order.quantity,
      orderId: order.id
    };
  
    this.cartService.addItem(cartItem);
    this.router.navigate(['/payment']);

  }
  
}
