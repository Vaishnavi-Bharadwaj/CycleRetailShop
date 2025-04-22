import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  orderId: number | null = null;
  selectedMethod: string = '';
  transactionId: string = '';
  showQRCode: boolean = false;
  showCardForm: boolean = false;
  showCashMessage: boolean = false;
  paymentSuccess: boolean = false;
  successMessage: string = '';  
  errorMessage: string = '';     

  constructor(private router: Router, private http: HttpClient, private toast: ToastrService) {}

  onMethodSelect() {
    this.showQRCode = this.selectedMethod === 'Scan';
    this.showCardForm = this.selectedMethod === 'Card';
    this.showCashMessage = this.selectedMethod === 'Cash';
    this.paymentSuccess = false;
  }

  completePayment() {
    if (!this.transactionId && this.selectedMethod !== 'Cash') {
      this.toast.warning('Please enter a transaction ID', 'Warning');
      return;
    }

    const payload = {
      paymentMethod: this.selectedMethod,
      transactionId: this.transactionId || 'Cash Payment'
    };
  
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };
  
    this.http.post(`https://localhost:5001/api/orders/complete-payment/${this.orderId}`, payload, { headers })
      .subscribe({
        next: (res: any) => {
          this.successMessage = res.message;
          this.paymentSuccess = true;
          this.generateReceipt(res);
          this.toast.success('Payment completed!', 'Success');

          setTimeout(() => {
            this.router.navigate(['/order-list']);
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Something went wrong';
          this.toast.error(this.errorMessage, 'Error');
        }
      });
  }

  generateReceipt(orderDetails: any) {
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text('Payment Receipt', 20, 20);
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderDetails.orderId}`, 20, 40);
    doc.text(`Payment Method: ${orderDetails.paymentMethod}`, 20, 50);
    doc.text(`Transaction ID: ${orderDetails.transactionId}`, 20, 60);
    doc.text(`Amount Paid: ₹${orderDetails.amount}`, 20, 70);
    doc.text(`Payment Date: ${new Date().toLocaleString()}`, 20, 80);
  
    doc.save(`Receipt_${orderDetails.orderId}.pdf`);
  }

}
