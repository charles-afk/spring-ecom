import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { routes } from './app.routes';
import { AuthInterceptorService } from './services/auth-interceptor';
import { environment } from '../environments/environment';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams: {
        redirect_uri: environment.auth0.authorizationParams.redirect_uri,
        audience: environment.auth0.authorizationParams.audience,
      },
      httpInterceptor: {
        allowedList: [
          `${environment.apiUrl}/api/orders/**`,
          `${environment.apiUrl}/api/checkout/purchase`
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