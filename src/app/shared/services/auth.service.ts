import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LOCALSTORAGE_USER, ROLE_ID_ADMIN } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  public authenticate(postData: any): Observable<any> {
    return this.http.post(`${this.url}login`, postData);
  }

  public forgetPassword(postData: any): Observable<any> {
    return this.http.post(`${this.url}forget-password`, postData);
  }

  public changePassword(postData: any): Observable<any> {
    return this.http.post(`${this.url}change-password`, postData);
  }

  public logout() {
    localStorage.clear();
    return true;
  }

  public isAuthenticated(): boolean {
    const userData: any = this.profileData();

    return userData && userData.token ? true : false;
  }

  public isAdminUser(): boolean {
    const userData: any = this.profileData();

    return userData && userData.role_id === ROLE_ID_ADMIN ? true : false;
  }

  public profileData(): any {
    const userData: any = localStorage.getItem(LOCALSTORAGE_USER);
    return userData ? JSON.parse(userData) : null;
  }
}
