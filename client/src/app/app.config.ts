import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app.routes';
import { AuthInterceptorService } from './services/auth-interceptor';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAuth0({
      domain: "dev-ribr38hk4r55unoz.us.auth0.com",
      clientId: "jlCBVZSbzpA7eoMG9sv5D0RrvKnGjM71",
      authorizationParams: {
        redirect_uri: "https://localhost:4200",
        audience: "http://localhost:8080",
      },
      httpInterceptor: {
        allowedList: [
          'http://localhost:8080/api/orders/**',
          'http://localhost:8080/api/checkout/purchase'
        ],
      },
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    }
  ]
};
