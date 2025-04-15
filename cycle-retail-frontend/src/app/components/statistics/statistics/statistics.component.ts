import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service'; // Import the service

interface MonthlySalesData {
  Month: string;
  TotalSales: number;
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})

export class StatisticsComponent implements OnInit {
  monthlySales: MonthlySalesData[] = [];
  ordersByStatus = [];
  topSellingCycles = [];
  inventorySummary = [];
  yearlyRevenue = [];

  // Prepare chart data
  monthlySalesCategories: any[] = [];
  monthlySalesData: any[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getMonthlySales().subscribe((data: MonthlySalesData[]) => {
      this.monthlySales = data;
      this.prepareMonthlySalesChartData();
    });

    this.authService.getOrdersByStatus().subscribe(data => {
      this.ordersByStatus = data;
    });

    this.authService.getTopSellingCycles().subscribe(data => {
      this.topSellingCycles = data;
    });

    this.authService.getInventorySummary().subscribe(data => {
      this.inventorySummary = data;
    });

    this.authService.getYearlyRevenue().subscribe(data => {
      this.yearlyRevenue = data;
    });
  }

  // Prepare data for the Monthly Sales chart
  prepareMonthlySalesChartData(): void {
    // Safely map the categories and data
    this.monthlySalesCategories = this.monthlySales.map(item => item.Month);
    this.monthlySalesData = this.monthlySales.map(item => item.TotalSales);
  }
}
