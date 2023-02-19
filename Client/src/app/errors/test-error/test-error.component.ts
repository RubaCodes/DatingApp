import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent implements OnInit {
  baseUrl : string = "https://localhost:5001/api/";
  validationErrors: string[] = []
  constructor(private http : HttpClient) { }

  ngOnInit(): void {
  }

  get404Error(){
    this.http.get(this.baseUrl + 'buggy/not-found').subscribe({
      next: res => console.log(res),
      error: err => console.error(err)
    })
  }
  get400Error(){
    this.http.get(this.baseUrl + 'buggy/bad-request').subscribe({
      next: res => console.log(res),
      error: err => console.error(err)
    })
  }
  get500Error(){
    this.http.get(this.baseUrl + 'buggy/server-error').subscribe({
      next: res => console.log(res),
      error: err => console.error(err)
    })
  }
  get401Error(){
    this.http.get(this.baseUrl + 'buggy/auth').subscribe({
      next: res => console.log(res),
      error: err => console.error(err)
    })
  }
  get400Validation(){
    this.http.post(this.baseUrl + 'account/register', {}).subscribe({
      next: res => console.log(res),
      error: err => {console.error(err)
        this.validationErrors = err
      }
    })
  }
}
