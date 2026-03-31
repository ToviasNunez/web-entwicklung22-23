import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
/** user will login  */
export class LoginComponent implements OnInit, OnDestroy {
  private authStatusSub?: Subscription;
  isLoading = false;
  constructor(public authService: AuthService) {}

  /**
   * subcribe to the auth service
   */
  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  /**
   *
   * @param form  Ngform
   * @returns
   */
  onLogin(form: NgForm) {
    // console.log(form.value);
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    return this.authService.login(form.value.userName, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub?.unsubscribe();
  }
}
