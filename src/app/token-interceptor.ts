import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Observable, of, switchMap, throwError } from "rxjs";
import { LoginResponse } from "./auth/login/login.response.payload";
import { AuthService } from "./auth/shared/auth.service";

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {

    isTokenRefreshing = false;
    refreshTokenSubject:BehaviorSubject<any> = new BehaviorSubject(null);
    constructor(public authService: AuthService) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        const jwtToken = this.authService.getJwtToken();
        if (jwtToken) {
            this.addToken(req, jwtToken);
        }
        return next.handle(req).pipe(catchError(error => {
            console.log('Error:');
            if (error instanceof HttpErrorResponse && error.status === 403) {
                return this.handleAuthErrors(req, next);
            } else {
                return throwError(error);
            }
        }));
    }

    private handleAuthErrors(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken().pipe(
                switchMap((refreshTokenResponse: LoginResponse) => {
                    this.isTokenRefreshing = false;
                    this.refreshTokenSubject.next(refreshTokenResponse.authToken);
                    return next.handle(this.addToken(req, refreshTokenResponse.authToken));
                })
            )
        }
        return of({
            type: HttpEventType.Sent,  // Indicate that the request has been sent
            loaded: 0,
            total: 0
          });
    }

    addToken(req: HttpRequest<any>, jwtToken: any) {
        return req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + jwtToken)
        });
    }
}