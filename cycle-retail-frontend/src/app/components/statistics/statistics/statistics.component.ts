import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexPlotOptions,
  ApexTooltip, 
  ApexDataLabels
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
    this.loadTopSellingCycles();
    this.loadInventorySummary();
    this.loadYearlyRevenue();
    
  }

  initializeChartOptions(): ChartOptions {
    return {
      series: [],
      chart: { type: 'line', height: 350 },
      xaxis: { categories: [] },
      title: { text: '' },
      labels: [],
      colors: [],
      dataLabels: { enabled: false } 
    };
  }

  vibrantColors: string[] = ['#00E396', '#FEB019', '#FF4560', '#775DD0', '#3F51B5', '#008FFB'];

  loadMonthlySales() {
    this.http.get<any[]>('https://localhost:5001/api/charts/admin-dashboard/monthly-sales').subscribe(data => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlySalesData = new Array(12).fill(0); 
  
      data.forEach(item => {
        const monthIndex = months.indexOf(item.month.substring(0, 3));  
        if (monthIndex >= 0) {
          monthlySalesData[monthIndex] = item.totalSales;  
        }
      });
  
      this.monthlySales = {
        series: [
          {
            name: 'Total Sales',
            data: monthlySalesData  
          }
        ],
        chart: { 
          type: 'line', 
          height: 350, 
          foreColor: '#ffffff' 
        },
        xaxis: { 
          categories: months  
        },
        title: { text: 'Monthly Sales' },
        labels: [],
        colors: ['#00E396'],  
      };
    }, error => {
      console.error('Error loading monthly sales:', error);
    });
  }
  
  
  loadTopSellingCycles() {
    this.http.get<any[]>('https://localhost:5001/api/charts/admin-dashboard/top-selling-cycles').subscribe(data => {
      this.topSellingCycles = {
        series: data.map(item => item.quantitySold),
        chart: { type: 'pie', height: 350, foreColor: '#ffffff' },
        labels: data.map(item => item.cycleName),   
        title: { text: 'Top Selling Cycles' },
        xaxis: { categories: [] },
        colors: this.vibrantColors
      };
    });
  }
  
  loadInventorySummary() {
    this.http.get<any[]>('https://localhost:5001/api/charts/admin-dashboard/inventory-summary').subscribe(data => {
      this.inventorySummary = {
        series: [
          {
            name: 'Stock',
            data: data.map(item => item.stock)
          }
        ],
        chart: {
          type: 'bar',
          height: 350,
          foreColor: '#FFFFFF'
        },
        xaxis: {
          categories: data.map(item => item.modelName)
        },
        title: {
          text: 'Inventory Summary'
        },
        labels: [],
        colors: ['#FF4560'],
        tooltip: {
          theme: 'dark' 
        },
        dataLabels: { enabled: false },
      };
    });
  }

  loadYearlyRevenue() {
    this.http.get<any[]>('https://localhost:5001/api/charts/admin-dashboard/yearly-revenue')
      .subscribe(data => {
        data.sort((a, b) => a.year - b.year);
  
        const years = data.map(item => item.year);
        const revenues = data.map(item => item.revenue);
  
        this.yearlyRevenue = {
          series: [
            {
              name: 'Revenue',
              data: revenues
            }
          ],
          chart: {
            type: 'area',
            height: 350,
            foreColor: '#FFFFFF'
          },
          xaxis: {
            categories: years
          },
          title: {
            text: 'Yearly Revenue',
            style: { color: '#FFFFFF' }
          },
          colors: ['#775DD0'],
          labels: [],       
          tooltip: {
            y: {
              formatter: (val: number) => `₹ ${val.toLocaleString()}`
            }
          }
        };
      }, error => {
        console.error('Error loading yearly revenue:', error);
      });
  }
  
}

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  plotOptions?: ApexPlotOptions;
  colors: string[]; 
  tooltip?: ApexTooltip;
  dataLabels?: ApexDataLabels;
};
