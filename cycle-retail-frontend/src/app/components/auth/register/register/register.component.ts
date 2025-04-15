import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private toast: ToastrService, private authService:AuthService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['admin', Validators.required]
    });
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.toast.warning('Fill in the required fields!', 'Error');
      return;
    }
    
    const { username, password, role} = this.registerForm.value;

    this.authService.register(username, password, role).subscribe({
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
  
        this.toast.success('Registration successful!', 'Success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.toast.error('Invalid username or password!', 'Registration Failed');
      }
    });
  }
}
