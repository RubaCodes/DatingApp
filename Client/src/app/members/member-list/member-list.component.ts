import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/members';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss'],
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  constructor(private membersSrv: MembersService) {}

  ngOnInit(): void {
    this.loadMembers();
  }
  loadMembers() {
    this.membersSrv.getMembers().subscribe({
      next: (res) => (this.members = res),
    });
  }
}
