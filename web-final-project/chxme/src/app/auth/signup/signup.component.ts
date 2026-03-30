import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription | undefined;
  // inject the authentication service
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  // read onject from the html
  onSignup(form: NgForm) {
    //console.log(form.value);
    // send the request
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.userName, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub!.unsubscribe();
  }
}
