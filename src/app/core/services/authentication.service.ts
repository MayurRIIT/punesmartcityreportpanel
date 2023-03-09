import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment as env } from '../../../environments/environment'

import { User } from '../../models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public setCurrentUserValue(user) {
        this.currentUserSubject.next(user);
    }

    login(email, password,emailFlag) {
        return this.http.post<any>(`${env.api}/rplogin`, { email, password , emailFlag})
            .pipe(map(response => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                console.log(response);
                // if(response)
                // localStorage.setItem('currentUser', JSON.stringify(response.result));
                // console.log(user);
                // this.currentUserSubject.next(user);
                return response;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.clear();
        this.currentUserSubject.next(null);
    }
}