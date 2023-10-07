import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { SignupRequestPayload } from './signup-request.payload';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupRequestPayload!: SignupRequestPayload;
  signupForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router,
    private toastr: ToastrService) {

    this.signupRequestPayload = {
      username:'',
      password:'',
      email:''
    }

  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    })
  }

  signUp() {
    this.signupRequestPayload.email = this.signupForm.get('email')?.value;
    this.signupRequestPayload.username = this.signupForm.get('username')?.value;
    this.signupRequestPayload.password = this.signupForm.get('password')?.value;

    //  New way of writing .subscribe
    this.authService.signUp(this.signupRequestPayload)
      .subscribe({
        next: () => {
        this.router.navigate(['/login'], { queryParams:  {registered: true}})
        },
        error: () => {
          this.toastr.error('Registration Faild! Please try again');
        }
      });
  }

}
