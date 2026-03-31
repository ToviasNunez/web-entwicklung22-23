import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { environment } from 'src/environments';
const BACKEND_URL = environment.apiURL + '/user/'; // global

@Injectable({
  providedIn: 'root',
})
/**
 * the authentication service
 * create user make sure that only create user can create post
 */
export class AuthService {
  private userId?: string | null;
  private tokenTimer: ReturnType<typeof setTimeout> | null = null;
  private isAthenticated = false;
  private userName?: string | null;
  private token?: string | null; // hold the token the after login will be in response
  private authStatusListener = new Subject<boolean>(); // will inform to the observer after been looed ans generate a token
  private authStatusUserListener = new Subject<string |null>(); // will inform of the observer afet the user was loged
  constructor(private http: HttpClient, private router: Router) {}

  /**
   *
   * @returns the token for the authentication
   */
  getToken() {
    return this.token;
  }

  /**
   *
   * @returns  the status of the authentication as observable
   */
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getAuthStatusUserListener() {
    return this.authStatusUserListener.asObservable();
  }
  /**
   *
   * @returns if the authenticate are true or false
   */
  getIsAuthtenticated() {
    return this.isAthenticated;
  }
/**
 * user will be created
 * @param userName
 * @param password
 * @returns
 */
  createUser(userName: string, password: string) {
    const authData: AuthData = { userName: userName, password: password };
    return this.http.post(BACKEND_URL + 'signup', authData).subscribe(
      (resposnse) => {
       // console.log(resposnse);
        this.router.navigate(['/']); //rediterecte the page
      },
      (error) => {
        console.log(error);
        this.authStatusListener.next(false); // in case that the suer all ready are subcrited it will send a fals
      }
    );
  }
/**
 * login user
 * @param userName
 * @param password
 * @returns
 */
  login(userName: string, password: string) {
    const authData: AuthData = {
      userName: userName,
      password: password,
    };
 /**
  * expiredIn --> the user will become a token that will be only one hour validate
  * token will be catched
  * the user id that we get from the data bank
  */
    return this.http
      .post<{
        expiresIn: number;
        token: string;
        userId: string;
      }>(BACKEND_URL + 'login', authData)
      .subscribe(
        (response) => {
         // console.log('Resposnse login', response);
          // getting the reponse that hold the token
          const token = response.token;
          this.token = token; // store the token into the service
          // console.log('this token from auth-servce', this.getToken());
          // if the token was creater than....
          if (token) {
            const expiresInDuration = response.expiresIn; // get the expires dutaration after login
            this.setAuthTimer(expiresInDuration);
            console.log(expiresInDuration);
            this.isAthenticated = true; // to make sure that after loggin the option from edit and deletd will bi activate
            this.userId = response.userId; // extracting the user id
            this.userName = authData.userName;
            this.authStatusUserListener.next(this.userName)  //
            this.authStatusListener.next(true); // after confirm that the use are logged with a token
            // tranforming the expiration date
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(
              token,
              expirationDate,
              this.userId,
              this.userName
            ); // store the autenfication
            this.router.navigate(['/']); // redirecting the page after login in to the page
          }
        },
        (error) => {
          this.authStatusListener.next(false); // in case that the suer all ready are subcrited it will send a fals
        }
      );
  }

  /**
   * will be execute when i call logout and will
   * reset the value to default
   */
  logout() {
    this.token = null;
    this.isAthenticated = false;
    this.authStatusListener.next(false);
    this.authStatusUserListener.next(null);
    if (this.tokenTimer) {
    clearTimeout(this.tokenTimer);
    this.tokenTimer = null;
    }
    this.clearAuthData();
    this.userId = null; // reset the user id
    this.router.navigate(['/']); // navigate to the home page an logout
  }
  /**
   * saving the token in the local store from the browser
   * @param token
   * @param expirationDate when the token expired
   */
  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    userName: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
  }
  /**
   * clear the token and data from the browser
   */
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  }
  /**
   * counting the the time
   */
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }

    // check the expiration still in the futer
    const now = new Date();
    const expiresIn = authInformation!.expirationDate.getTime() - now.getTime(); // getting the expiration in milisecon
    // check if the expiresIn is smaller or equals as 0 that the time is erpired
    if (expiresIn > 0) {
      this.token = authInformation?.token;
      this.isAthenticated = true;
      this.userId = authInformation.userId;
      this.userName = authInformation.userName;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  /***
   * get the data from local store token and expirate date
   */
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      userName: userName,
    };
  }
  /**
   * set the time out for the expired
   * @param duration
   */
  private setAuthTimer(duration: number) {
    console.log('SetTimer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout(); // call the logout fuction agter the time is out
    }, duration * 1000);
  }
  /** return the user id from the list componer  */
  getUserId() {
    return this.userId;
  }
  /**
   *
   * @returns the user name
   */
  getUserName() {
    return this.userName;
  }
}
