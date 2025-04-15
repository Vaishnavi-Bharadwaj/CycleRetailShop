import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private toast: ToastrService, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['admin', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.toast.warning('Fill in the required fields!', 'Error');
      return;
    }

    const { username, password, role } = this.loginForm.value;
    console.log("Login Attempt:", { username, password }); 
    const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    this.authService.login(username, password, formattedRole).subscribe({
      next: (res) => {
        console.log('Full Response:', res);
        if (!res.token) {
          console.error("No token received!");
          return;
        }
  
        this.authService.saveToken(res.token);
        const tokenParts = res.token.split('.');
        if (tokenParts.length !== 3) {
          console.error("Invalid token format!");
          return;
        }
  
        const tokenPayload = JSON.parse(atob(tokenParts[1]));
        console.log("Decoded Token:", tokenPayload);
  
        const userRole = tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        console.log("User Role:", userRole);
        
        // Save role to localStorage
        localStorage.setItem('role', userRole);

        this.toast.success('Login successful!', 'Success');
        this.router.navigate([userRole === 'Admin' ? '/admin-dashboard' : '/employee-dashboard']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.toast.error('Invalid username or password!', 'Login Failed');
      }
    });
  }
}
