import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { jsPDF } from 'jspdf';
@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent {
  receiptData: any;
  currentDate: string = new Date().toLocaleString();

  constructor(private location: Location) {
    const navigation = this.location.getState() as any;
    this.receiptData = navigation.receiptData;
  }

  generateReceipt(orderDetails: any) {
    const doc = new jsPDF();
    let y = 20;
  
    doc.setFontSize(16);
    doc.text('Payment Receipt', 20, y);
  
    y += 20; // space before details
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderDetails.orderId}`, 20, y);
  
    y += 10;
    doc.text(`Model Name: ${orderDetails.cycleName}`, 20, y);
  
    y += 10;
    doc.text(`Payment Method: ${orderDetails.paymentMethod}`, 20, y);
  
    y += 10;
    doc.text(`Amount Paid: ${orderDetails.amount}`, 20, y);
  
    y += 10;
    doc.text(`Payment Date: ${new Date().toLocaleString()}`, 20, y);
  
    doc.save(`Receipt_${orderDetails.orderId}.pdf`);
  }

}
