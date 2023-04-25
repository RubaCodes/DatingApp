import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/members';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-members-card',
  templateUrl: './members-card.component.html',
  styleUrls: ['./members-card.component.scss'],
})
export class MembersCardComponent implements OnInit {
  @Input() member: Member;
  constructor(
    private memberSrv: MembersService,
    private toasterSrv: ToastrService
  ) {}

  ngOnInit(): void {}

  addLike(member: Member) {
    this.memberSrv.addLike(member.userName).subscribe({
      next: () => this.toasterSrv.success('You have like ' + member.knownAs),
    });
  }
}
