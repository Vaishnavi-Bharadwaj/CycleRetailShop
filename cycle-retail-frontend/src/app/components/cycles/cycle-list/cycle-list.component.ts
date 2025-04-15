import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

interface Cycle {
  id: number;
  modelName: string;
  brand: string;
  type: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-cycle-list',
  templateUrl: './cycle-list.component.html',
  styleUrls: ['./cycle-list.component.scss']
})
export class CycleListComponent implements OnInit{
  cycles: Cycle[] = [];
  newCycle: Partial<Cycle> = {};
  editingCycle: any = null;
  role: string = '';
  
  constructor(private http: HttpClient, private authService:AuthService, private toast:ToastrService) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.fetchCycles();
  }

  fetchCycles() {
    this.http.get<Cycle[]>('https://localhost:5001/api/cycles')
      .subscribe(data => this.cycles = data);
  }

  addCycle() {
    const { modelName, brand, type, price, stock } = this.newCycle;
    const url = `https://localhost:5001/api/cycles/add/${modelName}/${brand}/${type}/${price}/${stock}`;

    const token = this.authService.getToken();
    if (!token) {
      console.error('No token found! User might not be logged in.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(url, {}, { headers }).subscribe({
      next: () => {
        this.toast.success('Cycle added successfully!', 'Success');
        this.newCycle = {};
        this.fetchCycles();
      },
      error: (err) => {
        console.error('Error adding cycle:', err);
        this.toast.error('Failed to add cycle!', 'Error');
      }
    });
  }

  updateCycle(cycle: Cycle) {
    const url = `https://localhost:5001/api/cycles/update/${cycle.id}/${cycle.modelName}/${cycle.brand}/${cycle.type}/${cycle.price}/${cycle.stock}`;

    const token = this.authService.getToken(); 
    if (!token) {
      console.error('No token found! User might not be logged in.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put(url, null, { headers }).subscribe({
      next: (response) => {
        this.toast.success('Cycle updated successfully!', 'Success');
        this.fetchCycles();
      },
      error: (error) => {
        console.error('Error updating cycle', error);
        this.toast.error('Failed to update cycle!', 'Error');
      }
    });
  }

  deleteCycle(id: number) {
    const url = `https://localhost:5001/api/cycles/delete/${id}`;

    const token = this.authService.getToken(); // use service to get token
    if (!token) {
      console.error('No token found! User might not be logged in.');
      this.toast.error('User not authenticated!', 'Error');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(url, { headers, responseType: 'text' }).subscribe({
      next: (response) => {
        this.toast.success('Cycle deleted successfully!', 'Success');
        this.fetchCycles();
      },
      error: (error) => {
        console.error('Error deleting cycle', error);
        this.toast.error('Failed to delete cycle!', 'Error');
      }
    });
  }


  editCycle(cycle: any) {
    // Create a copy so cancel won't affect original
    this.editingCycle = { ...cycle };
  }

  saveCycle() {
    this.updateCycle(this.editingCycle); 
    this.editingCycle = null;
  }

  cancelEdit() {
    this.editingCycle = null;
  }

}

