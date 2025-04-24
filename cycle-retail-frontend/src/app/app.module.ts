import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/auth/login/login.component';
import { CycleListComponent } from './components/cycles/cycle-list/cycle-list.component';
import { AdminDashboardComponent } from './components/dashboard/admin-dashboard/admin-dashboard.component';
import { EmployeeDashboardComponent } from './components/dashboard/employee-dashboard/employee-dashboard.component';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './components/auth/register/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderListComponent } from './components/orders/order-list/order-list.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { CustomersComponent } from './components/customers/customers.component';
import { StatisticsComponent } from './components/statistics/statistics/statistics.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PaymentComponent } from './components/payment/payment/payment.component';
import { PaymentDetailsComponent } from './components/payment_details/payment-details/payment-details.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CycleListComponent,
    AdminDashboardComponent,
    EmployeeDashboardComponent,
    RegisterComponent,
    OrderListComponent,
    EmployeesComponent,
    CustomersComponent,
    StatisticsComponent,
    PaymentComponent,
    PaymentDetailsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgApexchartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
