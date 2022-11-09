import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  registerMode :boolean
  // users : any
  constructor(/*private http : HttpClient */) {}

  ngOnInit(): void {
    // this.fetchUsers();
  }
  registerToggle(){
    this.registerMode = !this.registerMode
  }

  // fetchUsers(){
  //   this.http.get("https://localhost:5001/api/users").subscribe({
  //     next : response => this.users = response,
  //     error : error => console.error(error)
  //   })
  // }
  cancelRegisterMode( event : boolean){
    this.registerMode = event;
  }
}
