import {inject} from '@angular/core';
import {
  HttpRequest
  , HttpHandlerFn
} from '@angular/common/http';
import { AuthServiceService } from '../services/auth/auth-service.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(AuthServiceService).getToken()
  if (authToken){
    // Clone the request to add the authentication header.
    const newReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${authToken}`)
    });
    return next(newReq);
  }

  return next(req);
}
