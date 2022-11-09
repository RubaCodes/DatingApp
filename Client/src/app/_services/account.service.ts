import { HttpClient } from '@angular/common/http';
import { CursorError } from '@angular/compiler/src/ml_parser/lexer';
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';
import { User } from '../_models/user';
// i servizi in angular sono singleton
//muoioino quando l'utente chiude l'app
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = "https://localhost:5001/api/"

  private currentUserSource = new ReplaySubject<User>(1)

  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model : any){
    return this.http.post(this.baseUrl + "account/login", model).pipe(
      map((res: User)=>{
        const user = res
        if(user){
          localStorage.setItem("user", JSON.stringify(user));
          this.currentUserSource.next(user)
        }
      })
    )
  }
  register(model ){
      return this.http.post(this.baseUrl + "account/register", model).pipe(
        map((user : User) =>{
          if(user){
            localStorage.setItem("user", JSON.stringify(user));
            this.currentUserSource.next(user);
          }
        })
      )
  }
  logout(){
    localStorage.removeItem("user");
    this.currentUserSource.next(null)
  }
  setCurrentUser(user : User){
    this.currentUserSource.next(user)
  }
}
