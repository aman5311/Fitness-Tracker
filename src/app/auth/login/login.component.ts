import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { FormGroup, FormControl , Validators} from '@angular/forms';
import { UIService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import {Observable, Subscription} from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  isLoading$ :Observable<boolean>;
  private loadingSubs:Subscription;

  constructor(private authService:AuthService,
              private uiService:UIService,
              private store:Store<fromRoot.State>)
               { }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.loginForm= new FormGroup({
      email:new FormControl('',{
        validators:[Validators.required,Validators.email]
      }),
      password: new FormControl('',{
        validators:[Validators.required]
      })
    })
    
  }
  onSubmit(form: NgForm)
  {
    this.authService.login({
      email: form.value.email.trim(),
      password: form.value.password
    });
  }

}
