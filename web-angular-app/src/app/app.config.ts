import { ApplicationConfig, provideZoneChangeDetection ,LOCALE_ID  } from '@angular/core';
import localeFr from '@angular/common/locales/fr';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./core/interceptors/auth.interceptor";
import {registerLocaleData} from "@angular/common";

registerLocaleData(localeFr);


export const appConfig: ApplicationConfig = {
  providers: [ provideHttpClient(withInterceptors([authInterceptor])),provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
