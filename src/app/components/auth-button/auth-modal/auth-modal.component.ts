import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.css'
})
export class AuthModalComponent {
  signInModal: boolean = true;
  signInForm = this.formBuilder.group({
    authSignInUsername: "",
    authSignInPassword: "",
  })
  signUpForm = this.formBuilder.group({
    authSignUpUsername: "",
    authSignUpPassword: "",
    authSignUpPasswordConfirmation: "",
  })
  
  @ViewChild("deletePassword") deletePassword!: ElementRef;
  @ViewChild("deletePasswordTooltip") deletePasswordTooltip!: ElementRef;

  @ViewChild("signInUsername") signInUsername!: ElementRef;
  @ViewChild("signInUsernameTooltip") signInUsernameTooltip!: ElementRef;
  @ViewChild("signInPassword") signInPassword!: ElementRef;
  @ViewChild("signInPasswordTooltip") signInPasswordTooltip!: ElementRef;

  @ViewChild("signUpUsername") signUpUsername!: ElementRef;
  @ViewChild("signUpUsernameTooltip") signUpUsernameTooltip!: ElementRef;
  @ViewChild("signUpPassword") signUpPassword!: ElementRef;
  @ViewChild("signUpPasswordTooltip") signUpPasswordTooltip!: ElementRef;
  @ViewChild("signUpPasswordConfirmation") signUpPasswordConfirmation!: ElementRef;
  @ViewChild("signUpPasswordConfirmationTooltip") signUpPasswordConfirmationTooltip!: ElementRef;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) { }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  onLogout() {
    this.authService.logout();
    
    document.querySelector<HTMLElement>(".modal .btn-close")?.click();
  }

  async onDelete() {
    const error = await this.authService.delete(this.deletePassword.nativeElement.value);

    if (this.deletePassword.nativeElement.classList.toggle("is-invalid", error)) {
      this.deletePasswordTooltip.nativeElement.textContent = error;
    } else {
      document.querySelector<HTMLElement>(".modal .btn-close")?.click();
    }

    this.deletePassword.nativeElement.value = "";
  }

  async onSignIn() {
    if (
      this.signInForm.valid
      && this.signInForm.value.authSignInUsername
      && this.signInForm.value.authSignInPassword
    ) {
      const errors = await this.authService.signIn(
        this.signInForm.value.authSignInUsername,
        this.signInForm.value.authSignInPassword
      );

      if (this.signInUsername.nativeElement.classList.toggle("is-invalid", !!errors?.username)) {
        this.signInUsernameTooltip.nativeElement.textContent = errors?.username;
        this.signInUsername.nativeElement.value = "";
      }

      if (this.signInPassword.nativeElement.classList.toggle("is-invalid", !!errors?.password)) {
        this.signInPasswordTooltip.nativeElement.textContent = errors?.password;
        this.signInPassword.nativeElement.value = "";
      }

      if (!errors?.username && !errors?.password) {
        // ferme le panneau si il n'y a pas d'erreur
        this.signInForm.reset();
        document.querySelector<HTMLElement>(".modal .btn-close")?.click();
      }
    }
  }

  async onSignUp() {
    if (
      this.signUpForm.valid
      && this.signUpForm.value.authSignUpUsername
      && this.signUpForm.value.authSignUpPassword
      && this.signUpForm.value.authSignUpPasswordConfirmation
    ) {
      const errors = await this.authService.signUp(
        this.signUpForm.value.authSignUpUsername,
        this.signUpForm.value.authSignUpPassword,
        this.signUpForm.value.authSignUpPasswordConfirmation
      );

      if (this.signUpUsername.nativeElement.classList.toggle("is-invalid", !!errors?.username)) {
        this.signUpUsernameTooltip.nativeElement.textContent = errors?.username;
        this.signUpUsername.nativeElement.value = "";
      }

      if (this.signUpPassword.nativeElement.classList.toggle("is-invalid", !!errors?.password)) {
        this.signUpPasswordTooltip.nativeElement.textContent = errors?.password;
        this.signUpPassword.nativeElement.value = "";
      }

      if (this.signUpPasswordConfirmation.nativeElement.classList.toggle("is-invalid", !!errors?.confirmation)) {
        this.signUpPasswordConfirmationTooltip.nativeElement.textContent = errors?.confirmation;
        this.signUpPasswordConfirmation.nativeElement.value = "";
      }
      
      if (!errors?.username && !errors?.password && !errors?.confirmation) {
        // ferme le panneau si il n'y a pas d'erreur
        this.signUpForm.reset();
        document.querySelector<HTMLElement>(".modal .btn-close")?.click();
      }
    }
  }
}
