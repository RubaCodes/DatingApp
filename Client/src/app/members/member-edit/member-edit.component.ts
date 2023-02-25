import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/members';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss'],
})
export class MemberEditComponent implements OnInit {
  member: Member;
  user: User;

  @ViewChild('editForm') editForm: NgForm;
  @HostListener('window:beforeunload', ['event']) unloadNotification(
    $event: any
  ) {
    if (this.editForm.dirty) {
      $event.returnVAlue = true;
    }
  }
  constructor(
    private accountSrv: AccountService,
    private memberSrv: MembersService,
    private toastr: ToastrService
  ) {
    this.accountSrv.currentUser$.pipe(take(1)).subscribe({
      next: (user) => (this.user = user),
    });
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    if (!this.user) return;
    this.memberSrv.getMember(this.user.username).subscribe({
      next: (mem) => (this.member = mem),
    });
  }
  updateProfile() {
    this.memberSrv.updateMember(this.editForm.value).subscribe({
      next: (_) => {
        this.toastr.success('Update Successfull');
        this.editForm?.reset(this.member);
      },
    });
  }
}
