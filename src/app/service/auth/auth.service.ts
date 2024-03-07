import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  public state$: EventEmitter<undefined> = new EventEmitter();

  private url: string = 'http://localhost:3080/';
  private user_id: string | null = localStorage.getItem("user_id");
  private username: string | null = localStorage.getItem("username");

  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean {
    return this.user_id != null;
  }

  getUserId(): string {
    if (this.user_id == null)
      throw "User not logged in";

    return this.user_id;
  }

  getUsername(): string | null {
    return this.username;
  }

  signIn(username: string, password: string): Promise<{ username?: string, password?: string } | undefined> {
    return new Promise(resolve => {
      this.http.post(`${this.url}auth/signin`, { username, password }).subscribe((res: any) => {
        resolve(res.errors);

        if (!res.errors) {
          localStorage.setItem("user_id", this.user_id = res.user_id);
          localStorage.setItem("username", this.username = username);
  
          this.state$.emit();
        }
      });
    });
  }

  signUp(username: string, password: string, confirmation: string): Promise<{ username?: string, password?: string, confirmation?: string } | undefined> {
    return new Promise(resolve => {
      this.http.post(`${this.url}auth/signup`, { username, password, confirmation }).subscribe((res: any) => {
        resolve(res.errors);
          
        if (!res.errors) {
          localStorage.setItem("user_id", this.user_id = res.user_id);
          localStorage.setItem("username", this.username = username);

          this.state$.emit();
        }
      });
    });
  }

  logout() {
    this.user_id = null;
    this.username = null;

    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    
    this.state$.emit();
  }

  delete(password: string): Promise<string | undefined> {
    return new Promise(resolve => {
      this.http.post(`${this.url}auth/delete`, { password, user_id: this.user_id }).subscribe((res: any) => {
        resolve(res.error);

        if (!res.error)
          this.logout();
      });
    });
  }
}
