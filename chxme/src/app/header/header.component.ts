import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})

// handler the situtation after been login
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}
  private authListenerSubs!: Subscription; // to get the observable variable
  userIsAuthenticated = false; // for activate some button on my html
  userName?: string | null;
  authListenerUserSub!: Subscription;

  /**
   * unsubcribe the subcription
   */
  ngOnDestroy() {
    this.authListenerSubs;
  }

  /**
   * auth service call --> get is authenticated  , user name
   * auth status listener
   */
  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuthtenticated(); // get the value when the app start
    this.userName = this.authService.getUserName();

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.authListenerUserSub = this.authService
      .getAuthStatusUserListener()
      .subscribe((userName) => {
        this.userName = userName;
      });
    console.log('this header user ', this.userName);
  }
  /**
   * auth service call the logout fuction
   */
  onLogout() {
    this.authService.logout();
  }
}
