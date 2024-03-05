import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  private user_id?: string = "65e6961d1475c26e0c0c1930"; // test user id

  constructor() { }

  isLoggedIn(): boolean {
    return this.user_id != null;
  }

  getUserId(): string {
    if (this.user_id == null)
      throw "User not logged in";

    return this.user_id;
  }
}
