import { Component } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrl: './auth-button.component.css'
})
export class AuthButtonComponent {
  constructor(private authService: AuthService) { }

  get buttonContent(): string {
    return this.authService.getUsername() || "Se connecter";
  }
}
