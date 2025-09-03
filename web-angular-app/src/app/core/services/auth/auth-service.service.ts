import {Injectable, signal} from '@angular/core';
import {inject} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ILogin} from "../../models/authModel";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  http = inject(HttpClient)
  baseUrl = 'https://api.mock.afric'
  userSignal = signal<object | null>(null)
  constructor() { }

  login(payload :ILogin){
    this.http.post(`${this.baseUrl}/ /auth/login`, payload).subscribe({
      next: (response) => {
      },
      error:(error) => {
        console.error(error);
      }
    })
  }


}
