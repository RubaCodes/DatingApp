import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  model : any = {};
  // @Input() usersFromHomeComponent
  @Output() cancelRegisterEvent = new EventEmitter();
  constructor( private accountService : AccountService, private toastr : ToastrService) { }

  ngOnInit(): void {
  }

  register(){
    this.accountService.register(this.model).subscribe({
      next: res => {
        console.log(res)
        this.cancel()
      },
      error: err => {
        console.error(err)
        this.toastr.error(err.error)
      }
    })
  }

  cancel(){
    console.log("emit")
    this.cancelRegisterEvent.emit(false);
  }
}
