import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  // Monthly Sales
  monthlySalesLabels: string[] = [];
  monthlySalesData: number[] = [];
  monthlySalesChart: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Monthly Sales' }]
  };

  // Orders by Status
  ordersByStatusChart: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: [] }]
  };

  // Top Selling Cycles
  topSellingCyclesChart: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Top Selling' }]
  };

  // Inventory Summary
  inventorySummaryChart: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Stock' }]
  };

  // Yearly Revenue
  yearlyRevenueChart: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{ data: [], label: 'Revenue' }]
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getMonthlySales().subscribe(data => {
      this.monthlySalesLabels = data.map((item: any) => item.Month);
      this.monthlySalesData = data.map((item: any) => item.TotalSales);
      this.monthlySalesChart.labels = this.monthlySalesLabels;
      this.monthlySalesChart.datasets[0].data = this.monthlySalesData;
    });

    this.authService.getOrdersByStatus().subscribe(data => {
      this.ordersByStatusChart.labels = data.map((x: any) => x.Status);
      this.ordersByStatusChart.datasets[0].data = data.map((x: any) => x.Count);
    });

    this.authService.getTopSellingCycles().subscribe(data => {
      this.topSellingCyclesChart.labels = data.map((x: any) => x.CycleName);
      this.topSellingCyclesChart.datasets[0].data = data.map((x: any) => x.QuantitySold);
    });

    this.authService.getInventorySummary().subscribe(data => {
      this.inventorySummaryChart.labels = data.map((x: any) => x.ModelName);
      this.inventorySummaryChart.datasets[0].data = data.map((x: any) => x.Stock);
    });

    this.authService.getYearlyRevenue().subscribe(data => {
      this.yearlyRevenueChart.labels = data.map((x: any) => x.Year.toString());
      this.yearlyRevenueChart.datasets[0].data = data.map((x: any) => x.Revenue);
    });
  }
}
