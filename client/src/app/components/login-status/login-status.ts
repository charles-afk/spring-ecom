import { DOCUMENT } from '@angular/common';
import { Component, Inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.html',
  styleUrl: './login-status.css',
  imports: [RouterLink]
})
export class LoginStatus {
  isAuthenticated= signal<boolean>(false);
  profileJson: string | undefined;
  userEmail: string | undefined;
  storage: Storage = localStorage;

  constructor(
    private auth: AuthService, 
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((authenticated: boolean) => {
      this.isAuthenticated.set(authenticated);
    });

    this.auth.user$.subscribe((user) => {
      this.userEmail = user?.email;
      this.storage.setItem('userEmail', JSON.stringify(user?.email));
    });
  }

  login() {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin }});
  }
}