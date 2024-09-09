import {Injectable} from '@angular/core';
import {User, UserDTO} from "../models/user";
import {Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../environment";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  private user: User = {
    id: 0,
    roles: [],
    name: '',
    email: ''
  }

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
  }


  createUser(user: UserDTO): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user`, user)
  }

  setUser(user: User): Observable<User>{
    this.user = user;
    return of(user);
  }

  getUser(): User{
    return this.user;
  }

  getUserId(): number {
    return this.user.id;
  }
}
