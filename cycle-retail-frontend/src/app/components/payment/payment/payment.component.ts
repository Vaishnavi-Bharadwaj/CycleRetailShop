import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  orderId: number | null = null;
  selectedMethod: string = '';
  showQRCode: boolean = false;
  showCardForm: boolean = false;
  showCashMessage: boolean = false;
  paymentSuccess: boolean = false;
  successMessage: string = '';  
  errorMessage: string = '';     
  isLoading: boolean = false;
  ModelName: boolean = false;

  cardDetails = {
    cardNumber: '',
    nameOnCard: '',
    expiry: '',
    cvv: ''
  };

  constructor(private router: Router, private http: HttpClient, private toast: ToastrService, private route: ActivatedRoute, private authService: AuthService) {}

  onMethodSelect() {
    this.showQRCode = this.selectedMethod === 'Scan';
    this.showCardForm = this.selectedMethod === 'Card';
    this.showCashMessage = this.selectedMethod === 'Cash';
    this.paymentSuccess = false;
  }

  ngOnInit() {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
  }

  completePayment() {

    this.isLoading = true; // Start loader
    
    const payload = {
      paymentMethod: this.selectedMethod
    };
    
    const token = this.authService.getToken();
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };

    if (this.selectedMethod === 'Card') {
      const { cardNumber, nameOnCard, expiry, cvv } = this.cardDetails;
      if (!cardNumber || !nameOnCard || !expiry || !cvv) {
        this.toast.error('Please fill all card details.', 'Validation Error');
        this.isLoading = false;
        return;
      }
    }
    

    this.http.post(`https://localhost:5001/api/orders/complete-payment/${this.orderId}`, payload, { headers })
      .subscribe({
        next: (res: any) => {
          this.successMessage = res.message;
          this.paymentSuccess = true;
          this.toast.success(this.successMessage, 'Success');
          this.isLoading = false; // Stop loader

          this.router.navigate(['/payment-details'], {
            state: { receiptData: res }
          });
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Something went wrong';
          this.toast.error(this.errorMessage, 'Error');
          this.isLoading = false; // Stop loader
        }
      });
  } 
  
}
