import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexPlotOptions
} from 'ng-apexcharts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  monthlySales: ChartOptions = this.initializeChartOptions();
  ordersByStatus: ChartOptions = this.initializeChartOptions();
  topSellingCycles: ChartOptions = this.initializeChartOptions();
  inventorySummary: ChartOptions = this.initializeChartOptions();
  yearlyRevenue: ChartOptions = this.initializeChartOptions();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMonthlySales();
    this.loadOrdersByStatus();
    this.loadTopSellingCycles();
    this.loadInventorySummary();
    this.loadYearlyRevenue();
    
  }

  initializeChartOptions(): ChartOptions {
    return {
      series: [],
      chart: { type: 'line', height: 350 },
      xaxis: { categories: [] },  // Initialize categories as an empty array
      title: { text: '' },
      labels: [],
    };
  }

  loadMonthlySales() {
    this.http.get<any[]>('http://localhost:5000/api/charts/admin-dashboard/monthly-sales').subscribe(data => {
      console.log('Monthly Sales Data:', data); // Log data to console
      this.monthlySales = {
        series: [
          {
            name: 'Sales',
            data: data.map(item => item.totalSales)
          }
        ],
        chart: { type: 'line', height: 350 },
        xaxis: { categories: data.length ? data.map(item => item.month) : [] },
        title: { text: 'Monthly Sales' }
      };
    });
  }
  

  loadOrdersByStatus() {
    this.http.get<any[]>('http://localhost:5000/api/charts/admin-dashboard/orders-by-status').subscribe(data => {
      if (data && data.length) {
        this.ordersByStatus = {
          series: data.map(item => item.count),
          chart: { type: 'pie', height: 350 },
          labels: data.map(item => item.status),
          title: { text: 'Orders by Status' },
          xaxis: { categories: [] }  // Empty xaxis for pie chart
        };
      }
    });
  }

  loadTopSellingCycles() {
    this.http.get<any[]>('http://localhost:5000/api/charts/admin-dashboard/top-selling-cycles').subscribe(data => {
      if (data && data.length) {
        this.topSellingCycles = {
          series: [
            {
              name: 'Quantity Sold',
              data: data.map(item => item.quantitySold)
            }
          ],
          chart: { type: 'bar', height: 350 },
          xaxis: { categories: data.map(item => item.cycleName) },
          title: { text: 'Top Selling Cycles' }
        };
      }
    });
  }

  loadInventorySummary() {
    this.http.get<any[]>('http://localhost:5000/api/charts/admin-dashboard/inventory-summary').subscribe(data => {
      if (data && data.length) {
        this.inventorySummary = {
          series: [
            {
              name: 'Stock',
              data: data.map(item => item.stock)
            }
          ],
          chart: { type: 'bar', height: 350 },
          xaxis: { categories: data.map(item => item.modelName) },
          title: { text: 'Inventory Summary' }
        };
      }
    });
  }

  loadYearlyRevenue() {
    this.http.get<any[]>('http://localhost:5000/api/charts/admin-dashboard/yearly-revenue').subscribe(data => {
      if (data && data.length) {
        this.yearlyRevenue = {
          series: [
            {
              name: 'Revenue',
              data: data.map(item => item.revenue)
            }
          ],
          chart: { type: 'area', height: 350 },
          xaxis: { categories: data.map(item => item.year) },
          title: { text: 'Yearly Revenue' }
        };
      }
    });
  }
}

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;  // xaxis is required, no longer optional
  title: ApexTitleSubtitle;
  labels?: string[];
  plotOptions?: ApexPlotOptions;
};
