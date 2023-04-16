import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/members';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { userParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss'],
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  pagination: Pagination;
  userParams: userParams;
  user: User;
  genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' },
  ];
  constructor(private membersSrv: MembersService) {
    this.userParams = this.membersSrv.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  }
  loadMembers() {
    if (this.userParams) {
      this.membersSrv.setUserParams(this.userParams);
      this.membersSrv.getMembers(this.userParams).subscribe({
        next: (res) => {
          if (res.result && res.pagination) {
            this.pagination = res.pagination;
            this.members = res.result;
          }
        },
      });
    }
  }
  pageChanged(event: any) {
    if (this.userParams.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.membersSrv.setUserParams(this.userParams);
      this.loadMembers();
    }
  }
  resetFilters() {
    if (this.user) {
      this.userParams = this.membersSrv.resetUserParams();
      this.loadMembers();
    }
  }
}
