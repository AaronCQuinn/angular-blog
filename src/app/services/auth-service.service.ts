import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any;
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  signUpData = {
    username: '',
    email: '',
    password: '',
    confPassword: '',
  }

  signInData = {
    username: '',
    password: '',
  }

  constructor(private http: HttpClient) {
    this.loadUser().subscribe({
      next: user => {       
        this.setUser(user.username);
      },
      error: err => console.error('Error loading user:', err)
    });
  }
  

  private headers = new HttpHeaders()
  .set('Content-Type', 'application/json')

  submitSignUp(): Observable<User> {  
    return this.http.post<User>('http://localhost:5000/api/register', this.signUpData, {headers: this.headers, withCredentials: true});
  }

  submitSignIn(): Observable<User> {  
    return this.http.post<User>('http://localhost:5000/api/login', this.signInData, {headers: this.headers, withCredentials: true});
  }
  
  public getUser(): any {
    // Return user information
    return this.user;
  }

  setUser(username: any) {          
    this.user = { username };    
    this.userSubject.next(this.user); // emit new user value    
  }
  
  public loadUser(): Observable<any> {   
    // Fetch user information from server based on JWT token 
    return this.http.get<any>('http://localhost:5000/api/verify', {withCredentials: true})
  }
  
  public logout(): void {
    // Clear user information and JWT token
    this.user = null;
  }
}
