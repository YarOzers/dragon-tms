import { Injectable } from '@angular/core';
import {User, UserDTO} from "../models/user";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  createUser(user: UserDTO): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user`,user)
  }
}
