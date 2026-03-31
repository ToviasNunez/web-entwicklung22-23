import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import { HeaderComponent } from './header/header.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostsModule } from './posts/posts.module';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { FooterComponent } from './footer/footer.component';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

//import { PostsService } from './posts/posts.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    FooterComponent,
  ],
  imports: [
    AngularMaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxMatSelectSearchModule,
    PostsModule,
    AuthRoutingModule,
    MdbRippleModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // handle the http request
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ], // inject the interceptor in the auth service
  bootstrap: [AppComponent],
})
export class AppModule {}
