import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/auth.service';
import { LoginRequestPayload } from './login.request.payload';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  loginForm!: FormGroup;
  loginRequestPayload!: LoginRequestPayload;
  isError: boolean = false;
  registerSuccessMessage!: string;
  
  constructor(private authService: AuthService, private router: Router, 
    private activatedRoute: ActivatedRoute, private toastr: ToastrService) {
    this.loginRequestPayload = {
      username: '',
      password: ''
    }
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.pattern('.{6,}')])
    });

    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.registered !== undefined && params.registered === true) {
          this.toastr.success('Signup Successful');
          this.registerSuccessMessage = 'Please check your inbox for activation email.';
        }
      })
  }

  login() {
    this.loginRequestPayload.username = this.loginForm.get('username')?.value;
    this.loginRequestPayload.password = this.loginForm.get('password')?.value;

    this.authService.login(this.loginRequestPayload).subscribe(response => {
      if (response) {
        this.isError = false;
        this.router.navigate(['/']);
        this.toastr.success('Signup Successful');
      } else {
        this.isError = true;
      }
    });
  }

}
